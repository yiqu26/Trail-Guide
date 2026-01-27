import { useEffect, useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { favoriteService } from '../services/trails';
import { TrailCard } from '../components/TrailCard';
import type { TrailListItem } from '../types';

export function Favorites() {
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

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>載入中...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
        我的收藏
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {trails.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(2, 1fr)',
            },
            gap: { xs: 1.5, sm: 2, md: 2.5 },
            maxWidth: 1200,
            mx: 'auto',
          }}
        >
          {trails.map((trail) => (
            <TrailCard
              key={trail.id}
              trail={trail}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </Box>
      ) : !error && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <FavoriteIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">
            還沒有收藏的步道
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            點擊步道詳情頁的愛心圖示即可收藏
          </Typography>
        </Box>
      )}
    </Box>
  );
}
