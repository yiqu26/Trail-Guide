import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Skeleton,
  IconButton,
  Chip,
  Paper,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { motion } from 'motion/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CampaignIcon from '@mui/icons-material/Campaign';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { homeService } from '../services/home';
import { BentoTrailCard } from '../components/BentoTrailCard';
import { PullToRefresh } from '../components/PullToRefresh';
import type { HomeData } from '../types';

import 'swiper/swiper-bundle.css';

// 動畫配置
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// 自定義 SVG 圖標組件
const CollectionIcons = {
  // 新手入門 - 路標指示牌
  beginner: (
    <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
      <path d="M24 4v40M20 44h8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M24 8l16 6-16 6V8z" fill="currentColor" opacity="0.9"/>
      <path d="M24 22l-14 5 14 5v-10z" fill="currentColor" opacity="0.6"/>
    </svg>
  ),
  // 親子同遊 - 大小手牽手
  family: (
    <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
      <circle cx="16" cy="12" r="5" fill="currentColor"/>
      <circle cx="34" cy="16" r="3.5" fill="currentColor" opacity="0.7"/>
      <path d="M16 19c-5 0-9 4-9 9v8h18v-8c0-5-4-9-9-9z" fill="currentColor" opacity="0.8"/>
      <path d="M34 21c-3.5 0-6 2.5-6 6v6h12v-6c0-3.5-2.5-6-6-6z" fill="currentColor" opacity="0.5"/>
      <path d="M22 30h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  ),
  // 夜景步道 - 星空下的山稜線
  nightView: (
    <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
      {/* 星星 */}
      <path d="M12 8l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5-2.5-2.5 3.5-.5L12 8z" fill="currentColor" opacity="0.9"/>
      <path d="M32 6l1 2 2.5.3-1.8 1.7.4 2.5-2.1-1-2.1 1 .4-2.5-1.8-1.7 2.5-.3 1-2z" fill="currentColor" opacity="0.7"/>
      <circle cx="40" cy="14" r="1.5" fill="currentColor" opacity="0.5"/>
      <circle cx="24" cy="10" r="1" fill="currentColor" opacity="0.4"/>
      <circle cx="6" cy="18" r="1" fill="currentColor" opacity="0.4"/>
      {/* 山稜線 */}
      <path d="M0 44l12-20 8 10 8-14 8 12 12-8v24H0z" fill="currentColor" opacity="0.7"/>
      <path d="M0 44l16-14 10 6 12-12 10 6v14H0z" fill="currentColor" opacity="0.4"/>
    </svg>
  ),
  // 瀑布秘境
  waterfall: (
    <svg viewBox="0 0 64 64" width="32" height="32">
      <defs>
        <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#B3E5FC" stopOpacity="1" />
          <stop offset="100%" stopColor="#81D4FA" stopOpacity="1" />
        </linearGradient>
      </defs>
      {/* 左側瀑布 */}
      <g transform="translate(14, 4)">
        <rect fill="#FFF9C4" x="0" y="48" width="16" height="8" rx="2"/>
        <rect fill="url(#waterGradient)" x="1" y="6" width="14" height="44"/>
        <path d="M1,30 L15,30 L15,45 C15,45 10,42 8,45 C6,48 1,45 1,45 L1,30 Z" fill="#455A64" opacity="0.3"/>
        <rect fill="#FFF9C4" x="0" y="0" width="16" height="8" rx="2"/>
        <circle fill="#DCE775" cx="8" cy="2" r="3"/>
      </g>
      {/* 右側瀑布 */}
      <g transform="translate(34, 4)">
        <rect fill="#FFF9C4" x="0" y="48" width="16" height="8" rx="2"/>
        <rect fill="url(#waterGradient)" x="1" y="6" width="14" height="44"/>
        <path d="M1,30 L15,30 L15,45 C15,45 10,42 8,45 C6,48 1,45 1,45 L1,30 Z" fill="#455A64" opacity="0.3" transform="translate(8, 37.5) scale(-1, 1) translate(-8, -37.5)"/>
        <rect fill="#FFF9C4" x="0" y="0" width="16" height="8" rx="2"/>
        <circle fill="#DCE775" cx="8" cy="2" r="3"/>
      </g>
    </svg>
  ),
  // 海濱風光 - 海浪與太陽
  ocean: (
    <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
      <circle cx="36" cy="12" r="6" fill="currentColor" opacity="0.9"/>
      <path d="M28 12h-4M36 4v-2M44 12h2M42 6l1.5-1.5M42 18l1.5 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      <path d="M4 28c4-4 8-4 12 0s8 4 12 0 8-4 12 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.8"/>
      <path d="M4 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
      <path d="M4 44c4-4 8-4 12 0s8 4 12 0 8-4 12 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.4"/>
    </svg>
  ),
  // 百岳挑戰 - 山峰與旗幟
  mountain: (
    <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
      <path d="M4 42L18 14l8 12 6-8 12 24H4z" fill="currentColor" opacity="0.6"/>
      <path d="M14 42L24 24l10 18H14z" fill="currentColor" opacity="0.9"/>
      <path d="M24 24V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M24 8l8 5-8 3V8z" fill="currentColor"/>
    </svg>
  ),
  // 森林療癒 - 樹木
  forest: (
    <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
      <path d="M24 4l12 16H12L24 4z" fill="currentColor" opacity="0.5"/>
      <path d="M24 12l10 14H14l10-14z" fill="currentColor" opacity="0.7"/>
      <path d="M24 20l8 12H16l8-12z" fill="currentColor" opacity="0.9"/>
      <rect x="22" y="32" width="4" height="12" fill="currentColor" opacity="0.8"/>
    </svg>
  ),
  // 預設 - 登山步道
  default: (
    <svg viewBox="0 0 48 48" fill="none" width="32" height="32">
      <path d="M8 40l14-28 6 12 6-8 6 24H8z" fill="currentColor" opacity="0.5"/>
      <circle cx="22" cy="8" r="4" fill="currentColor"/>
      <path d="M18 16l-6 24M22 14l4 8-2 18M26 16l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.8"/>
    </svg>
  ),
};

// 根據精選集名稱返回對應的圖標和主色調
const getCollectionStyle = (name: string): { icon: React.ReactNode; color: string } => {
  if (name.includes('百岳') || name.includes('挑戰')) {
    return { icon: CollectionIcons.mountain, color: '#2E7D32' };
  }
  if (name.includes('親子') || name.includes('同遊')) {
    return { icon: CollectionIcons.family, color: '#E65100' };
  }
  if (name.includes('夜景') || name.includes('絕美')) {
    return { icon: CollectionIcons.nightView, color: '#3949AB' };
  }
  if (name.includes('瀑布') || name.includes('秘境')) {
    return { icon: CollectionIcons.waterfall, color: '#00838F' };
  }
  if (name.includes('森林') || name.includes('療癒')) {
    return { icon: CollectionIcons.forest, color: '#558B2F' };
  }
  if (name.includes('海') || name.includes('風光') || name.includes('海濱')) {
    return { icon: CollectionIcons.ocean, color: '#1565C0' };
  }
  if (name.includes('新手') || name.includes('入門') || name.includes('推薦')) {
    return { icon: CollectionIcons.beginner, color: '#BF360C' };
  }
  // 預設
  return { icon: CollectionIcons.default, color: '#546E7A' };
};

export function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const theme = useTheme();

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await homeService.getHomeData();
      setHomeData(data);
    } catch (err) {
      console.error('Failed to fetch home data:', err);
      setError('無法載入資料，伺服器可能正在啟動中');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="text" width="40%" />
        <Box sx={{ display: 'flex', gap: 2, mt: 1, overflow: 'hidden' }}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" width={100} height={100} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Alert severity="warning" sx={{ mb: 3, maxWidth: 400 }}>
          {error}
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          首次載入可能需要 30 秒左右，請稍候再試
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
          sx={{ borderRadius: 2 }}
        >
          重新載入
        </Button>
      </Box>
    );
  }

  const handleRefresh = async () => {
    await fetchData();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Box sx={{ pb: 10 }}>
        {/* Banner Swiper */}
      {homeData?.banners && homeData.banners.length > 0 && (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000 }}
          pagination={{ clickable: true }}
          loop
          style={{ height: 200 }}
        >
          {homeData.banners.map((banner) => (
            <SwiperSlide key={banner.id}>
              <Box
                sx={{
                  height: '100%',
                  backgroundImage: `url(${banner.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: banner.link ? 'pointer' : 'default',
                }}
                onClick={() => banner.link && navigate(banner.link)}
              >
                {banner.title && (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      p: 2,
                      color: 'white',
                    }}
                  >
                    <Typography variant="h6">{banner.title}</Typography>
                  </Box>
                )}
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Collections - Icon with Background Style */}
      {homeData?.collections && homeData.collections.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box
            sx={{
              py: { xs: 3, md: 4 },
              px: { xs: 2, sm: 3, md: 4, lg: 6 },
              bgcolor: 'background.default',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Box
              component={motion.div}
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              sx={{
                maxWidth: 1600,
                mx: 'auto',
                display: 'flex',
                justifyContent: { xs: 'space-between', md: 'center' },
                overflowX: 'auto',
                gap: { xs: 2, sm: 3, md: 5, lg: 8 },
                pb: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {homeData.collections.map((collection, index) => {
                const style = getCollectionStyle(collection.name);
                return (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    whileHover={{ y: -6, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(`/collection/${collection.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        minWidth: { xs: 70, md: 90 },
                        flex: '0 0 auto',
                      }}
                    >
                      {/* Icon Container with Background */}
                      <Box
                        sx={{
                          width: { xs: 60, md: 80 },
                          height: { xs: 60, md: 80 },
                          borderRadius: '50%',
                          backgroundColor: alpha(style.color, theme.palette.mode === 'dark' ? 0.2 : 0.15),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 1.5,
                          boxShadow: theme.palette.mode === 'dark'
                            ? '0 4px 12px rgba(0,0,0,0.3)'
                            : '0 4px 12px rgba(0,0,0,0.12)',
                          border: 3,
                          borderColor: 'background.paper',
                          color: style.color,
                          transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
                          '&:hover': {
                            boxShadow: theme.palette.mode === 'dark'
                              ? '0 8px 24px rgba(0,0,0,0.4)'
                              : '0 8px 24px rgba(0,0,0,0.18)',
                          },
                          '& svg': {
                            width: { xs: 32, md: 40 },
                            height: { xs: 32, md: 40 },
                          },
                        }}
                      >
                        {style.icon}
                      </Box>
                      {/* Label */}
                      <Typography
                        sx={{
                          textAlign: 'center',
                          fontSize: { xs: '12px', md: '14px' },
                          fontWeight: 600,
                          lineHeight: 1.3,
                          color: 'text.primary',
                          maxWidth: { xs: 80, md: 100 },
                        }}
                      >
                        {collection.name}
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })}
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Popular Trails - Bento Grid */}
      {homeData?.popularTrails && homeData.popularTrails.length > 0 && (
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
        >
          <Box sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 }, py: 3, maxWidth: 1600, mx: 'auto' }}>
            <motion.div variants={fadeInUp}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" fontWeight="bold">
                  熱門步道
                </Typography>
                <IconButton size="small" onClick={() => navigate('/search')}>
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            </motion.div>
            {/* Bento Grid Layout - 響應式 */}
            <Box
              sx={{
                display: 'grid',
                gap: { xs: 1.5, sm: 2, md: 2.5 },
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',      // 手機: 2 欄
                  sm: 'repeat(4, 1fr)',      // 平板: 4 欄
                  lg: 'repeat(6, 1fr)',      // 桌面: 6 欄
                },
                gridTemplateRows: {
                  xs: 'repeat(3, 150px)',    // 手機: 3 排
                  sm: 'repeat(2, 180px)',    // 平板: 2 排
                  lg: 'repeat(2, 200px)',    // 桌面: 2 排，更高
                },
              }}
            >
              {/* 大卡片 - 佔據 2x2 */}
              {homeData.popularTrails[0] && (
                <motion.div
                  variants={fadeInUp}
                  style={{ gridColumn: 'span 2', gridRow: 'span 2' }}
                >
                  <BentoTrailCard trail={homeData.popularTrails[0]} isLarge />
                </motion.div>
              )}
              {/* 小卡片 1-4 (所有尺寸都顯示) */}
              {homeData.popularTrails[1] && (
                <motion.div variants={fadeInUp}>
                  <BentoTrailCard trail={homeData.popularTrails[1]} />
                </motion.div>
              )}
              {homeData.popularTrails[2] && (
                <motion.div variants={fadeInUp}>
                  <BentoTrailCard trail={homeData.popularTrails[2]} />
                </motion.div>
              )}
              {homeData.popularTrails[3] && (
                <motion.div variants={fadeInUp}>
                  <BentoTrailCard trail={homeData.popularTrails[3]} />
                </motion.div>
              )}
              {homeData.popularTrails[4] && (
                <motion.div variants={fadeInUp}>
                  <BentoTrailCard trail={homeData.popularTrails[4]} />
                </motion.div>
              )}
              {/* 小卡片 5-6 (僅桌面版顯示) */}
              {homeData.popularTrails[5] && (
                <Box sx={{ display: { xs: 'none', lg: 'block' }, height: '100%' }}>
                  <motion.div variants={fadeInUp} style={{ height: '100%' }}>
                    <BentoTrailCard trail={homeData.popularTrails[5]} />
                  </motion.div>
                </Box>
              )}
              {homeData.popularTrails[6] && (
                <Box sx={{ display: { xs: 'none', lg: 'block' }, height: '100%' }}>
                  <motion.div variants={fadeInUp} style={{ height: '100%' }}>
                    <BentoTrailCard trail={homeData.popularTrails[6]} />
                  </motion.div>
                </Box>
              )}
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Announcements */}
      {homeData?.announcements && homeData.announcements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ px: { xs: 2, sm: 3, md: 4, lg: 6 }, maxWidth: 1600, mx: 'auto', width: '100%' }}>
            <Paper
              elevation={0}
              sx={{
                mb: 3,
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CampaignIcon sx={{ color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  最新消息
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {homeData.announcements.map((announcement, index) => (
                  <motion.div
                    key={announcement.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={announcement.link ? { x: 4, scale: 1.01 } : {}}
                  >
                    <Card
                      elevation={1}
                      sx={{
                        cursor: announcement.link ? 'pointer' : 'default',
                        borderLeft: '4px solid',
                        borderLeftColor: index === 0 ? 'primary.main' : 'grey.300',
                      }}
                      onClick={() => announcement.link && window.open(announcement.link, '_blank')}
                    >
                      <CardContent sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              {index === 0 && (
                                <Chip
                                  label="NEW"
                                  size="small"
                                  color="primary"
                                  sx={{ height: 20, fontSize: '0.65rem', fontWeight: 'bold' }}
                                />
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {announcement.date && new Date(announcement.date).toLocaleDateString('zh-TW')}
                              </Typography>
                            </Box>
                            <Typography variant="subtitle2" fontWeight="medium" sx={{ lineHeight: 1.4 }}>
                              {announcement.title}
                            </Typography>
                            {announcement.source && (
                              <Typography variant="caption" color="text.secondary">
                                來源：{announcement.source}
                              </Typography>
                            )}
                          </Box>
                          {announcement.link && (
                            <OpenInNewIcon sx={{ fontSize: 16, color: 'text.secondary', ml: 1, mt: 0.5 }} />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </Box>
            </Paper>
          </Box>
        </motion.div>
      )}
      </Box>
    </PullToRefresh>
  );
}
