import { useState } from 'react';
import { Typography, Box, Chip, IconButton, Snackbar, Alert, keyframes } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StraightenIcon from '@mui/icons-material/Straighten';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { favoriteService } from '../services/trails';
import { formatDuration } from '../utils/formatTime';
import type { TrailListItem } from '../types';

interface TrailCardProps {
  trail: TrailListItem;
  onFavoriteToggle?: (trailId: number) => void;
}

const heartPop = keyframes`
  0%   { transform: scale(1); }
  30%  { transform: scale(1.4); }
  60%  { transform: scale(0.88); }
  100% { transform: scale(1); }
`;

const difficultyLabels = ['', '入門', '簡單', '中等', '困難', '挑戰'];
const difficultyColors = ['', '#2E7D32', '#558B2F', '#F9A825', '#E64A19', '#6A1B9A'];

export function TrailCard({ trail, onFavoriteToggle }: TrailCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isAuthenticated && trail.isFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false, message: '', severity: 'success',
  });

  const handleClick = () => navigate(`/trail/${trail.id}`);

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
        setSnackbar({ open: true, message: '已從口袋名單移除', severity: 'success' });
      } else {
        await favoriteService.addFavorite(trail.id);
        setSnackbar({ open: true, message: '已加入口袋名單', severity: 'success' });
      }
      setIsFavorite(!isFavorite);
      onFavoriteToggle?.(trail.id);
    } catch {
      setSnackbar({ open: true, message: '操作失敗，請稍後再試', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const diffColor = trail.difficulty ? difficultyColors[trail.difficulty] : undefined;

  return (
    <>
      <Box
        onClick={handleClick}
        sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          cursor: 'pointer',
          bgcolor: 'background.paper',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 2px 12px rgba(0,0,0,0.4)'
              : '0 2px 12px rgba(26,51,38,0.10)',
          transition: 'transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease',
          '&:active': {
            transform: 'scale(0.97)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 1px 4px rgba(0,0,0,0.3)'
                : '0 1px 4px rgba(26,51,38,0.08)',
          },
        }}
      >
        {/* ── Photo ── */}
        <Box sx={{ position: 'relative', width: '100%', height: 176, overflow: 'hidden', flexShrink: 0 }}>
          <Box
            component="img"
            src={trail.coverImage || '/placeholder-trail.jpg'}
            alt={trail.title}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s ease',
              '.MuiBox-root:active &': { transform: 'scale(1.04)' },
            }}
          />

          {/* Bottom gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '60%',
              background: 'linear-gradient(to top, rgba(6,14,10,0.72) 0%, transparent 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Rating badge — top left */}
          {trail.evaluation && (
            <Box
              sx={{
                position: 'absolute', top: 10, left: 10,
                bgcolor: 'rgba(6,14,10,0.65)',
                backdropFilter: 'blur(8px)',
                borderRadius: '8px',
                px: 0.9, py: 0.35,
                display: 'flex', alignItems: 'center', gap: 0.4,
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <StarIcon sx={{ fontSize: 12, color: '#F5C842' }} />
              <Typography sx={{ fontSize: '0.72rem', color: 'white', fontWeight: 700, lineHeight: 1 }}>
                {trail.evaluation.toFixed(1)}
              </Typography>
            </Box>
          )}

          {/* Difficulty badge — bottom left (above gradient) */}
          {trail.difficulty && diffColor && (
            <Box
              sx={{
                position: 'absolute', bottom: 10, left: 10,
                bgcolor: diffColor,
                borderRadius: '6px',
                px: 0.8, py: 0.25,
              }}
            >
              <Typography sx={{ fontSize: '0.65rem', color: 'white', fontWeight: 700, lineHeight: 1 }}>
                {difficultyLabels[trail.difficulty]}
              </Typography>
            </Box>
          )}

          {/* Favorite button — top right */}
          <IconButton
            size="small"
            onClick={handleFavoriteClick}
            disabled={isLoading}
            sx={{
              position: 'absolute', top: 6, right: 6,
              bgcolor: 'rgba(6,14,10,0.55)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.12)',
              p: 0.75,
              '&:hover': { bgcolor: 'rgba(6,14,10,0.75)' },
            }}
          >
            {isFavorite ? (
              <FavoriteIcon
                sx={{
                  fontSize: 16,
                  color: '#ff5c75',
                  animation: `${heartPop} 0.5s cubic-bezier(0.34,1.56,0.64,1)`,
                }}
              />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 16, color: 'rgba(255,255,255,0.88)' }} />
            )}
          </IconButton>
        </Box>

        {/* ── Info ── */}
        <Box sx={{ px: 1.5, pt: 1.25, pb: 1.5 }}>
          {/* Title */}
          <Typography
            sx={{
              fontFamily: '"Noto Serif TC", serif',
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.35,
              mb: 0.75,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'text.primary',
            }}
          >
            {trail.title}
          </Typography>

          {/* Location */}
          {trail.locationName && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4, mb: 0.75 }}>
              <LocationOnIcon sx={{ fontSize: 12, color: 'primary.main', flexShrink: 0 }} />
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ fontSize: '0.72rem' }}
              >
                {trail.locationName}
              </Typography>
            </Box>
          )}

          {/* Stats row */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: trail.chips?.length ? 0.75 : 0 }}>
            {trail.costTime && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35 }}>
                <AccessTimeIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                  {formatDuration(trail.costTime)}
                </Typography>
              </Box>
            )}
            {trail.distance && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.35 }}>
                <StraightenIcon sx={{ fontSize: 12, color: 'text.disabled' }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                  {(trail.distance / 1000).toFixed(1)} km
                </Typography>
              </Box>
            )}
          </Box>

          {/* Tags */}
          {trail.chips && trail.chips.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {trail.chips.slice(0, 2).map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.62rem',
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.07)'
                        : 'rgba(27,67,50,0.07)',
                    color: 'text.secondary',
                    border: 'none',
                    '& .MuiChip-label': { px: 0.9 },
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 9 }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
