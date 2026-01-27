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
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CampaignIcon from '@mui/icons-material/Campaign';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { homeService } from '../services/home';
import { TrailCard } from '../components/TrailCard';
import type { HomeData } from '../types';

import 'swiper/swiper-bundle.css';

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

// 根據精選集名稱返回對應的圖標和顏色
const getCollectionStyle = (name: string): { icon: React.ReactNode; bgColor: string; iconColor: string } => {
  if (name.includes('百岳') || name.includes('挑戰')) {
    return { icon: CollectionIcons.mountain, bgColor: '#E8F5E9', iconColor: '#2E7D32' };
  }
  if (name.includes('親子') || name.includes('同遊')) {
    return { icon: CollectionIcons.family, bgColor: '#FFF3E0', iconColor: '#E65100' };
  }
  if (name.includes('夜景') || name.includes('絕美')) {
    return { icon: CollectionIcons.nightView, bgColor: '#E8EAF6', iconColor: '#3949AB' };
  }
  if (name.includes('瀑布') || name.includes('秘境')) {
    return { icon: CollectionIcons.waterfall, bgColor: '#E0F7FA', iconColor: '#00838F' };
  }
  if (name.includes('森林') || name.includes('療癒')) {
    return { icon: CollectionIcons.forest, bgColor: '#F1F8E9', iconColor: '#558B2F' };
  }
  if (name.includes('海') || name.includes('風光') || name.includes('海濱')) {
    return { icon: CollectionIcons.ocean, bgColor: '#E3F2FD', iconColor: '#1565C0' };
  }
  if (name.includes('新手') || name.includes('入門') || name.includes('推薦')) {
    return { icon: CollectionIcons.beginner, bgColor: '#FBE9E7', iconColor: '#BF360C' };
  }
  // 預設
  return { icon: CollectionIcons.default, bgColor: '#ECEFF1', iconColor: '#546E7A' };
};

export function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await homeService.getHomeData();
        setHomeData(data);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

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

  return (
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
        <Box
          sx={{
            py: 3,
            px: 2,
            background: 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)',
            borderBottom: '1px solid #eee',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              overflowX: 'auto',
              gap: 2,
              pb: 1,
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {homeData.collections.map((collection) => {
              const style = getCollectionStyle(collection.name);
              return (
                <Box
                  key={collection.id}
                  onClick={() => navigate(`/collection/${collection.id}`)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    minWidth: 70,
                    flex: '0 0 auto',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      transform: 'scale(0.95)',
                    },
                  }}
                >
                  {/* Icon Container with Background */}
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: style.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                      border: '3px solid white',
                      color: style.iconColor,
                    }}
                  >
                    {style.icon}
                  </Box>
                  {/* Label */}
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: '#333',
                      maxWidth: 80,
                    }}
                  >
                    {collection.name}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Popular Trails */}
      {homeData?.popularTrails && homeData.popularTrails.length > 0 && (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 2, maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              熱門步道
            </Typography>
            <IconButton size="small" onClick={() => navigate('/search')}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
              },
              gap: { xs: 1.5, sm: 2, md: 2.5 },
            }}
          >
            {homeData.popularTrails.slice(0, 6).map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </Box>
        </Box>
      )}

      {/* Announcements */}
      {homeData?.announcements && homeData.announcements.length > 0 && (
        <Box sx={{ px: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
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
              <Card
                key={announcement.id}
                elevation={1}
                sx={{
                  cursor: announcement.link ? 'pointer' : 'default',
                  transition: 'all 0.2s ease',
                  '&:hover': announcement.link ? {
                    transform: 'translateX(4px)',
                    boxShadow: 3,
                  } : {},
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
            ))}
          </Box>
        </Paper>
        </Box>
      )}
    </Box>
  );
}
