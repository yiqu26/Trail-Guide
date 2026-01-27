import { useState } from 'react';
import { Card, Box, Typography, Chip, IconButton, Snackbar, Alert } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TerrainIcon from '@mui/icons-material/Terrain';
import LocationOnIcon from '@mui/icons-material/LocationOn';
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
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: isLarge ? 'scale(1.02)' : 'scale(1.03)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
          },
          '&:hover .card-image': {
            transform: 'scale(1.08)',
          },
          '&:hover .card-overlay': {
            background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.8) 100%)',
          },
          '&:hover .card-content': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        {/* 背景圖 - 加入縮放動畫 */}
        <Box
          className="card-image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${trail.coverImage || '/placeholder-trail.jpg'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.4s ease',
          }}
        />

        {/* 漸層遮罩 - hover 時加深 */}
        <Box
          className="card-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.7) 100%)',
            transition: 'background 0.3s ease',
          }}
        />

        {/* 難度標籤 - 左上角 */}
        {trail.difficulty && (
          <Chip
            label={difficultyLabels[trail.difficulty]}
            size="small"
            sx={{
              position: 'absolute',
              top: isLarge ? 14 : 10,
              left: isLarge ? 14 : 10,
              bgcolor: difficultyColors[trail.difficulty],
              color: 'white',
              fontWeight: 'bold',
              fontSize: isLarge ? '0.8rem' : '0.7rem',
              height: isLarge ? 28 : 22,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          />
        )}

        {/* 收藏按鈕 - 右上角，加強 hover 效果 */}
        <IconButton
          size={isLarge ? 'medium' : 'small'}
          onClick={handleFavoriteClick}
          disabled={isLoading}
          sx={{
            position: 'absolute',
            top: isLarge ? 10 : 6,
            right: isLarge ? 10 : 6,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.5)',
              transform: 'scale(1.1)',
            },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon fontSize={isLarge ? 'medium' : 'small'} sx={{ color: '#ff6b6b' }} />
          ) : (
            <FavoriteBorderIcon fontSize={isLarge ? 'medium' : 'small'} />
          )}
        </IconButton>

        {/* 內容 - 底部，加入上移動畫 */}
        <Box
          className="card-content"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: isLarge ? 2.5 : 1.5,
            color: 'white',
            transition: 'transform 0.3s ease',
          }}
        >
          {/* 地點 - 大卡片顯示在標題上方 */}
          {isLarge && trail.locationName && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, opacity: 0.9 }}>
              <LocationOnIcon sx={{ fontSize: 14, mr: 0.3 }} />
              <Typography variant="caption">
                {trail.locationName}
              </Typography>
            </Box>
          )}

          <Typography
            variant={isLarge ? 'h6' : 'subtitle2'}
            fontWeight="bold"
            sx={{
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              mb: isLarge ? 1 : 0.5,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: isLarge ? 2 : 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              fontSize: isLarge ? '1.25rem' : undefined,
            }}
          >
            {trail.title}
          </Typography>

          {/* 資訊列 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: isLarge ? 2 : 1.5, flexWrap: 'wrap' }}>
            {trail.evaluation && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ fontSize: isLarge ? 18 : 14, color: '#ffc107' }} />
                <Typography variant="caption" sx={{ ml: 0.3, fontWeight: 600, fontSize: isLarge ? '0.85rem' : undefined }}>
                  {trail.evaluation.toFixed(1)}
                </Typography>
              </Box>
            )}
            {trail.costTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', opacity: isLarge ? 1 : 0.9 }}>
                <AccessTimeIcon sx={{ fontSize: isLarge ? 16 : 14 }} />
                <Typography variant="caption" sx={{ ml: 0.3, fontSize: isLarge ? '0.85rem' : undefined }}>
                  {trail.costTime}分
                </Typography>
              </Box>
            )}
            {trail.distance && (
              <Box sx={{ display: 'flex', alignItems: 'center', opacity: isLarge ? 1 : 0.9 }}>
                <TerrainIcon sx={{ fontSize: isLarge ? 16 : 14 }} />
                <Typography variant="caption" sx={{ ml: 0.3, fontSize: isLarge ? '0.85rem' : undefined }}>
                  {(trail.distance / 1000).toFixed(1)}km
                </Typography>
              </Box>
            )}
          </Box>

          {/* 標籤 - 僅大卡片顯示 */}
          {isLarge && trail.chips && trail.chips.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.75, mt: 1.5, flexWrap: 'wrap' }}>
              {trail.chips.slice(0, 3).map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  size="small"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    backdropFilter: 'blur(4px)',
                    fontSize: '0.7rem',
                    height: 24,
                    '& .MuiChip-label': { px: 1 },
                  }}
                />
              ))}
            </Box>
          )}
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
