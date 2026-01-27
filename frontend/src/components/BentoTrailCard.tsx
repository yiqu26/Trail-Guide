import { useState } from 'react';
import { Card, Box, Typography, Chip, IconButton, Snackbar, Alert } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TerrainIcon from '@mui/icons-material/Terrain';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { favoriteService } from '../services/trails';
import type { TrailListItem } from '../types';

interface BentoTrailCardProps {
  trail: TrailListItem;
  isLarge?: boolean;
  onFavoriteToggle?: (trailId: number) => void;
}

const difficultyLabels = ['', '入門', '簡單', '中等', '困難', '挑戰'];
const difficultyColors = ['', '#4caf50', '#8bc34a', '#ff9800', '#f44336', '#9c27b0'];

export function BentoTrailCard({ trail, isLarge = false, onFavoriteToggle }: BentoTrailCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(trail.isFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleClick = () => {
    navigate(`/trail/${trail.id}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      setSnackbar({ open: true, message: '請先登入', severity: 'info' });
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    setIsLoading(true);
    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(trail.id);
        setSnackbar({ open: true, message: '已從收藏移除', severity: 'success' });
      } else {
        await favoriteService.addFavorite(trail.id);
        setSnackbar({ open: true, message: '已加入收藏', severity: 'success' });
      }
      setIsFavorite(!isFavorite);
      onFavoriteToggle?.(trail.id);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      setSnackbar({ open: true, message: '操作失敗，請稍後再試', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Card
        onClick={handleClick}
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          borderRadius: 3,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: 6,
          },
        }}
      >
        {/* 背景圖 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${trail.coverImage || '/placeholder-trail.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* 漸層遮罩 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)',
          }}
        />

        {/* 難度標籤 - 左上角 */}
        {trail.difficulty && (
          <Chip
            label={difficultyLabels[trail.difficulty]}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              bgcolor: difficultyColors[trail.difficulty],
              color: 'white',
              fontWeight: 'bold',
              fontSize: isLarge ? '0.75rem' : '0.7rem',
              height: isLarge ? 26 : 22,
            }}
          />
        )}

        {/* 收藏按鈕 - 右上角 */}
        <IconButton
          size="small"
          onClick={handleFavoriteClick}
          disabled={isLoading}
          sx={{
            position: 'absolute',
            top: 6,
            right: 6,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon fontSize="small" sx={{ color: '#ff6b6b' }} />
          ) : (
            <FavoriteBorderIcon fontSize="small" />
          )}
        </IconButton>

        {/* 內容 - 底部 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: isLarge ? 2 : 1.5,
            color: 'white',
          }}
        >
          <Typography
            variant={isLarge ? 'h6' : 'subtitle2'}
            fontWeight="bold"
            sx={{
              textShadow: '0 1px 3px rgba(0,0,0,0.5)',
              mb: 0.5,
              lineHeight: 1.2,
              display: '-webkit-box',
              WebkitLineClamp: isLarge ? 2 : 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {trail.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            {trail.evaluation && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ fontSize: isLarge ? 16 : 14, color: '#ffc107' }} />
                <Typography variant="caption" sx={{ ml: 0.3, fontWeight: 500 }}>
                  {trail.evaluation.toFixed(1)}
                </Typography>
              </Box>
            )}
            {isLarge && trail.costTime && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ fontSize: 14, opacity: 0.9 }} />
                <Typography variant="caption" sx={{ ml: 0.3 }}>
                  {trail.costTime}分
                </Typography>
              </Box>
            )}
            {isLarge && trail.distance && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TerrainIcon sx={{ fontSize: 14, opacity: 0.9 }} />
                <Typography variant="caption" sx={{ ml: 0.3 }}>
                  {(trail.distance / 1000).toFixed(1)}km
                </Typography>
              </Box>
            )}
            {isLarge && trail.locationName && (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {trail.locationName}
              </Typography>
            )}
          </Box>
        </Box>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 8 }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
