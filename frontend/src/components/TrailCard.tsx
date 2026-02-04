import { useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton, Snackbar, Alert, keyframes } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const heartBeat = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.3); }
  100% { transform: scale(1); }
`;
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TerrainIcon from '@mui/icons-material/Terrain';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { favoriteService } from '../services/trails';
import { formatDuration } from '../utils/formatTime';
import { ProgressiveImage } from './ProgressiveImage';
import type { TrailListItem } from '../types';

interface TrailCardProps {
  trail: TrailListItem;
  onFavoriteToggle?: (trailId: number) => void;
}

const difficultyLabels = ['', '入門', '簡單', '中等', '困難', '挑戰'];
const difficultyColors = ['', '#4caf50', '#8bc34a', '#ff9800', '#f44336', '#9c27b0'];

export function TrailCard({ trail, onFavoriteToggle }: TrailCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(trail.isFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Responsive image size
  const imageSize = {
    width: { xs: 110, sm: 140, md: 160 },
    height: { xs: 110, sm: 140, md: 160 },
  };

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
    <Card
      sx={{
        display: 'flex',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 24px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.15)',
          transform: 'translateY(-4px) scale(1.01)',
        },
        '&:active': {
          transform: 'translateY(-2px) scale(0.99)',
        },
      }}
      onClick={handleClick}
    >
      <ProgressiveImage
        src={trail.coverImage || '/placeholder-trail.jpg'}
        alt={trail.title}
        width={imageSize.width}
        height={imageSize.height}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <CardContent sx={{ flex: '1 0 auto', py: { xs: 1, sm: 1.5 }, px: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1, sm: 1.5 } } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="subtitle1" fontWeight="bold" noWrap sx={{ flex: 1 }}>
              {trail.title}
            </Typography>
            <IconButton
              size="small"
              onClick={handleFavoriteClick}
              disabled={isLoading}
              sx={{
                ml: 0.5,
                p: 0.5,
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
                '&:active': {
                  transform: 'scale(0.9)',
                },
              }}
            >
              {isFavorite ? (
                <FavoriteIcon
                  color="error"
                  fontSize="small"
                  sx={{
                    animation: `${heartBeat} 0.6s ease-in-out`,
                  }}
                />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </Box>

          <Typography variant="caption" color="text.secondary">
            {trail.locationName}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 0.5 }}>
            {trail.difficulty && (
              <Chip
                label={difficultyLabels[trail.difficulty]}
                size="small"
                sx={{
                  bgcolor: difficultyColors[trail.difficulty],
                  color: 'white',
                  height: 20,
                  fontSize: '0.7rem',
                }}
              />
            )}
            {trail.evaluation && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ fontSize: 14, color: '#ffc107' }} />
                <Typography variant="caption" sx={{ ml: 0.3 }}>
                  {trail.evaluation.toFixed(1)}
                </Typography>
              </Box>
            )}
            {trail.costTime && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ ml: 0.3 }}>
                  {formatDuration(trail.costTime)}
                </Typography>
              </Box>
            )}
            {trail.distance && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TerrainIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                <Typography variant="caption" sx={{ ml: 0.3 }}>
                  {(trail.distance / 1000).toFixed(1)}km
                </Typography>
              </Box>
            )}
          </Box>

          {trail.chips.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
              {trail.chips.slice(0, 3).map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  size="small"
                  variant="outlined"
                  sx={{ height: 18, fontSize: '0.65rem' }}
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Box>

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
    </Card>
  );
}
