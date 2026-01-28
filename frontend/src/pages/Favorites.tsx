import { useEffect, useState } from 'react';
import { Box, Typography, Alert, Fade, Grow, Button, Skeleton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExploreIcon from '@mui/icons-material/Explore';
import { useNavigate } from 'react-router-dom';
import { favoriteService } from '../services/trails';
import { TrailCard } from '../components/TrailCard';
import type { TrailListItem } from '../types';

// 空狀態插圖元件
function EmptyState({ onExplore }: { onExplore: () => void }) {
  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          px: 4,
        }}
      >
        {/* 裝飾性插圖 */}
        <Box
          sx={{
            position: 'relative',
            width: 160,
            height: 160,
            mx: 'auto',
            mb: 3,
          }}
        >
          {/* 背景圓形 */}
          <Box
            sx={{
              position: 'absolute',
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFE0E0 0%, #FFF0F0 100%)',
            }}
          />
          {/* 裝飾小圓 */}
          <Box
            sx={{
              position: 'absolute',
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: '#FFCDD2',
              top: 10,
              right: 10,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-8px)' },
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: '#EF9A9A',
              bottom: 20,
              left: 5,
              animation: 'float 3s ease-in-out infinite 0.5s',
            }}
          />
          {/* 愛心圖標 */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <FavoriteIcon
              sx={{
                fontSize: 64,
                color: '#E57373',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                },
              }}
            />
          </Box>
        </Box>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          還沒有收藏的步道
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 280, mx: 'auto' }}>
          探索台灣美麗的步道，點擊愛心就能收藏起來
        </Typography>

        <Button
          variant="contained"
          startIcon={<ExploreIcon />}
          onClick={onExplore}
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.2,
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
            },
          }}
        >
          探索步道
        </Button>
      </Box>
    </Fade>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
        },
        gap: 2,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <Box key={i} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Skeleton variant="rectangular" height={200} />
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="60%" height={28} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function Favorites() {
  const navigate = useNavigate();
  const [trails, setTrails] = useState<TrailListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setError(null);
      const data = await favoriteService.getMyFavorites();
      setTrails(data);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
      setError('無法載入收藏列表，請重新登入後再試');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // TrailCard 會處理 API 呼叫，這裡只需要更新列表
  const handleFavoriteToggle = (trailId: number) => {
    setTrails(trails.filter((t) => t.id !== trailId));
  };

  const handleExplore = () => {
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAFA', pb: 10 }}>
      {/* 頂部 Header */}
      <Box
        sx={{
          position: 'relative',
          pt: 4,
          pb: 8,
          px: 3,
          background: 'linear-gradient(135deg, #E53935 0%, #EF5350 50%, #EF9A9A 100%)',
          overflow: 'hidden',
        }}
      >
        {/* 裝飾元素 */}
        <Box
          sx={{
            position: 'absolute',
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
            top: -40,
            right: -30,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.08)',
            bottom: 20,
            left: -20,
          }}
        />

        <Fade in timeout={600}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <FavoriteIcon sx={{ color: 'white', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="white">
                我的收藏
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {isLoading ? '載入中...' : `${trails.length} 條收藏的步道`}
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* 內容區 */}
      <Box sx={{ px: 2, pt: 3, pb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : trails.length > 0 ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(2, 1fr)',
              },
              gap: { xs: 2, sm: 2.5 },
              maxWidth: 1200,
              mx: 'auto',
            }}
          >
            {trails.map((trail, index) => (
              <Grow
                key={trail.id}
                in
                timeout={400}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <Box>
                  <TrailCard
                    trail={trail}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </Box>
              </Grow>
            ))}
          </Box>
        ) : !error ? (
          <EmptyState onExplore={handleExplore} />
        ) : null}
      </Box>

      {/* 底部提示（有收藏時顯示） */}
      {!isLoading && trails.length > 0 && (
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', mt: 4, px: 3 }}>
            <Typography variant="caption" color="text.secondary">
              點擊步道卡片查看詳情，點擊愛心取消收藏
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  );
}
