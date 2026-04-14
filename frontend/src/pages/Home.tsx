import {
  Box,
  Typography,
  Skeleton,
  IconButton,
  Chip,
  Button,
  Alert,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Footprints, Users, Moon, Droplets, Sunrise, Mountain, Trees } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { homeService } from '../services/home';
import { BentoTrailCard } from '../components/BentoTrailCard';
import { PullToRefresh } from '../components/PullToRefresh';

import 'swiper/swiper-bundle.css';

// 根據精選集名稱返回對應的圖標和主色調
const getCollectionStyle = (name: string): { icon: React.ReactNode; color: string } => {
  const iconProps = { size: 30, strokeWidth: 1.6, 'aria-hidden': true };
  if (name.includes('百岳') || name.includes('挑戰')) {
    return { icon: <Mountain {...iconProps} />, color: '#2E7D32' };
  }
  if (name.includes('親子') || name.includes('同遊')) {
    return { icon: <Users {...iconProps} />, color: '#D84315' };
  }
  if (name.includes('夜景') || name.includes('絕美')) {
    return { icon: <Moon {...iconProps} />, color: '#3949AB' };
  }
  if (name.includes('瀑布') || name.includes('秘境')) {
    return { icon: <Droplets {...iconProps} />, color: '#00838F' };
  }
  if (name.includes('森林') || name.includes('療癒')) {
    return { icon: <Trees {...iconProps} />, color: '#558B2F' };
  }
  if (name.includes('海') || name.includes('風光') || name.includes('海濱')) {
    return { icon: <Sunrise {...iconProps} />, color: '#1565C0' };
  }
  if (name.includes('新手') || name.includes('入門') || name.includes('推薦')) {
    return { icon: <Footprints {...iconProps} />, color: '#BF360C' };
  }
  return { icon: <Mountain {...iconProps} />, color: '#546E7A' };
};

export function Home() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { data: homeData, isLoading, isError, refetch } = useQuery({
    queryKey: ['home'],
    queryFn: homeService.getHomeData,
  });

  if (isLoading) {
    return (
      <Box>
        <Box sx={{ px: 3, pt: 3, pb: 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Skeleton variant="text" width={80} height={14} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="55%" height={40} />
          <Skeleton variant="text" width="35%" height={18} sx={{ mt: 0.5 }} />
        </Box>
        <Skeleton variant="rectangular" height={240} />
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, overflow: 'hidden' }}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" width={90} height={90} sx={{ borderRadius: 2, flexShrink: 0 }} />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  if (isError) {
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
          無法載入資料，伺服器可能正在啟動中
        </Alert>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          首次載入可能需要 30 秒左右，請稍候再試
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          sx={{ borderRadius: 2 }}
        >
          重新載入
        </Button>
      </Box>
    );
  }

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <Box sx={{ pb: 10 }}>

        {/* Masthead - mobile only (PC has TopNav) */}
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            px: 3,
            pt: 3,
            pb: 2.5,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.75 }}>
            <Box sx={{ height: '1px', width: 24, bgcolor: 'primary.main', opacity: 0.4 }} />
            <Typography
              sx={{
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.3em',
                color: 'primary.main',
                textTransform: 'uppercase',
              }}
            >
              Trail Guide
            </Typography>
            <Box sx={{ height: '1px', flex: 1, bgcolor: 'divider' }} />
          </Box>
          <Typography variant="h4" sx={{ lineHeight: 1.2, mb: 0.5 }}>
            探索台灣山林
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.06em' }}>
            台灣步道資訊平台
          </Typography>
        </Box>

        {/* Banner Swiper */}
      {homeData?.banners && homeData.banners.length > 0 && (
        <Box
          sx={{
            height: { xs: 260, sm: 340, md: 480 },
            position: 'relative',
            '& .swiper': { height: '100%' },
            '& .swiper-pagination': { bottom: '18px' },
            '& .swiper-pagination-bullet': {
              width: 6, height: 6,
              bgcolor: 'rgba(255,255,255,0.45)',
              opacity: 1, mx: '3px',
              transition: 'all 0.25s',
            },
            '& .swiper-pagination-bullet-active': {
              width: 22, height: 6,
              borderRadius: '3px',
              bgcolor: 'white',
            },
          }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
          >
            {homeData.banners.map((banner, index) => (
              <SwiperSlide key={banner.id}>
                <Box
                  sx={{
                    height: '100%',
                    position: 'relative',
                    cursor: banner.link ? 'pointer' : 'default',
                    overflow: 'hidden',
                  }}
                  onClick={() => banner.link && navigate(banner.link)}
                >
                  <Box
                    component="img"
                    src={banner.imageUrl}
                    alt={banner.title || '步道景觀'}
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: ['center 65%', 'center 65%', 'center 30%'][index] ?? 'center 50%',
                      display: 'block',
                    }}
                  />
                  {/* Cinematic multi-stop gradient */}
                  <Box sx={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 35%, rgba(10,20,16,0.6) 70%, rgba(10,20,16,0.88) 100%)',
                  }} />

                  {/* Content */}
                  <Box sx={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    p: { xs: 2.5, md: 4 }, pb: { xs: 5, md: 6 },
                  }}>
                    {/* Eyebrow */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: { xs: 0.8, md: 1.2 } }}>
                      <Box sx={{ width: 18, height: 1.5, bgcolor: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
                      <Typography sx={{
                        fontSize: '0.6rem', letterSpacing: '0.22em',
                        textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)',
                      }}>
                        Trail Guide
                      </Typography>
                    </Box>

                    {banner.title && (
                      <Typography sx={{
                        fontFamily: '"Noto Serif TC", serif',
                        fontWeight: 700,
                        fontSize: { xs: '1.35rem', md: '1.9rem' },
                        lineHeight: 1.25,
                        color: 'white',
                        textShadow: '0 2px 20px rgba(0,0,0,0.35)',
                        maxWidth: { md: 560 },
                      }}>
                        {banner.title}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      )}

      {/* Popular Trails - Bento Grid (moved before collections) */}
      {homeData?.popularTrails && homeData.popularTrails.length > 0 && (
          <Box sx={{ px: { xs: 2, sm: 3, md: 2 }, py: 3, maxWidth: 1600, mx: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                <Typography variant="h5">
                  熱門步道
                </Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                <IconButton size="small" onClick={() => navigate('/search')}>
                  <ChevronRightIcon />
                </IconButton>
              </Box>
            <Box
              sx={{
                display: 'grid',
                gap: 1.5,
                gridTemplateColumns: {
                  xs: 'repeat(2, 1fr)',
                  sm: 'repeat(4, 1fr)',
                  md: 'repeat(4, 1fr)',
                },
                gridTemplateRows: {
                  xs: 'repeat(3, 168px)',
                  sm: 'repeat(2, 200px)',
                  md: 'repeat(2, 250px)',
                },
                gridAutoRows: {
                  xs: '168px',
                  sm: '200px',
                  md: '250px',
                },
              }}
            >
              {homeData.popularTrails[0] && (
                <Box sx={{ gridColumn: 'span 2', gridRow: 'span 2' }}>
                  <BentoTrailCard trail={homeData.popularTrails[0]} isLarge />
                </Box>
              )}
              {homeData.popularTrails[1] && <BentoTrailCard trail={homeData.popularTrails[1]} />}
              {homeData.popularTrails[2] && <BentoTrailCard trail={homeData.popularTrails[2]} />}
              {homeData.popularTrails[3] && <BentoTrailCard trail={homeData.popularTrails[3]} />}
              {homeData.popularTrails[4] && <BentoTrailCard trail={homeData.popularTrails[4]} />}
            </Box>
          </Box>
      )}

      {/* Collections */}
      {homeData?.collections && homeData.collections.length > 0 && (
        <Box sx={{ px: { xs: 2, sm: 3, md: 2 }, pt: 3, pb: 1, maxWidth: 1600, mx: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
            <Typography variant="h5">精選集</Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            <IconButton size="small" onClick={() => navigate('/search')}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              gap: { xs: 2, sm: 3, md: 4 },
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
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: '0 0 auto',
                    minWidth: { xs: 68, md: 84 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 60, md: 74 },
                      height: { xs: 60, md: 74 },
                      borderRadius: '16px',
                      backgroundColor: alpha(style.color, theme.palette.mode === 'dark' ? 0.18 : 0.1),
                      border: '1px solid',
                      borderColor: alpha(style.color, theme.palette.mode === 'dark' ? 0.28 : 0.18),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1.25,
                      color: style.color,
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        backgroundColor: alpha(style.color, theme.palette.mode === 'dark' ? 0.26 : 0.16),
                        boxShadow: `0 8px 20px ${alpha(style.color, 0.22)}`,
                      },
                    }}
                  >
                    {style.icon}
                  </Box>
                  <Typography
                    sx={{
                      textAlign: 'center',
                      fontSize: { xs: '11.5px', md: '13px' },
                      fontWeight: 600,
                      lineHeight: 1.3,
                      color: 'text.primary',
                      maxWidth: { xs: 72, md: 88 },
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

      {/* Announcements */}
      {homeData?.announcements && homeData.announcements.length > 0 && (
        <Box sx={{ px: { xs: 2, sm: 3, md: 2 }, pt: 2.5, pb: 3, maxWidth: 1600, mx: 'auto', width: '100%' }}>
          {/* Section header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h5">最新消息</Typography>
            <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            <Button
              size="small"
              endIcon={<ChevronRightIcon sx={{ fontSize: '14px !important' }} />}
              sx={{ fontSize: '0.8rem', color: 'text.secondary', minWidth: 0 }}
            >
              查看全部
            </Button>
          </Box>

          {/* Items */}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {homeData.announcements.slice(0, 3).map((announcement, index) => (
              <Box
                key={announcement.id}
                onClick={() => announcement.link && window.open(announcement.link, '_blank')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  py: 1.6,
                  borderBottom: index < Math.min(homeData.announcements.length, 3) - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  cursor: announcement.link ? 'pointer' : 'default',
                  borderRadius: 1,
                  px: 1,
                  mx: -1,
                  '&:hover': announcement.link
                    ? { bgcolor: 'action.hover' }
                    : {},
                  transition: 'background 0.15s',
                }}
              >
                {/* Index number */}
                <Typography sx={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: index === 0 ? 'primary.main' : 'text.disabled',
                  width: 18,
                  flexShrink: 0,
                  textAlign: 'center',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {String(index + 1).padStart(2, '0')}
                </Typography>

                {/* Title */}
                <Typography sx={{
                  flex: 1,
                  fontSize: '0.9rem',
                  fontWeight: index === 0 ? 600 : 400,
                  lineHeight: 1.45,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: index === 0 ? 'text.primary' : 'text.secondary',
                }}>
                  {announcement.title}
                </Typography>

                {/* Date */}
                <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', flexShrink: 0 }}>
                  {announcement.date && new Date(announcement.date).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })}
                </Typography>
                {announcement.link && (
                  <OpenInNewIcon sx={{ fontSize: 13, color: 'text.disabled', flexShrink: 0 }} />
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
      </Box>
    </PullToRefresh>
  );
}
