import { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StraightenIcon from '@mui/icons-material/Straighten';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { favoriteService } from '../services/trails';
import { formatDuration } from '../utils/formatTime';
import type { TrailListItem } from '../types';

const difficultyLabels = ['', '入門', '簡單', '中等', '困難', '挑戰'];
const difficultyColors = ['', '#2E7D32', '#558B2F', '#F9A825', '#E64A19', '#6A1B9A'];

interface PCTrailCardProps {
  trail: TrailListItem;
  isActive?: boolean;
  onHover?: (id: number | null) => void;
  onFavoriteToggle?: (trailId: number) => void;
}

export function PCTrailCard({ trail, isActive, onHover, onFavoriteToggle }: PCTrailCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isFavorite, setIsFavorite] = useState(isAuthenticated && trail.isFavorite);
  const [hovered, setHovered] = useState(false);

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(trail.id);
      } else {
        await favoriteService.addFavorite(trail.id);
      }
      setIsFavorite(!isFavorite);
      onFavoriteToggle?.(trail.id);
    } catch (e) { console.error(e); }
  };

  return (
    <Box
      onClick={() => navigate(`/trail/${trail.id}`)}
      onMouseEnter={() => { setHovered(true); onHover?.(trail.id); }}
      onMouseLeave={() => { setHovered(false); onHover?.(null); }}
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        cursor: 'pointer',
        aspectRatio: '16/9',
        flexShrink: 0,
        outline: isActive ? '2px solid' : 'none',
        outlineColor: 'primary.main',
        outlineOffset: '2px',
        transition: 'outline 0.2s',
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={trail.coverImage || '/placeholder-trail.jpg'}
        alt={trail.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: hovered
            ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
            : 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
          transition: 'background 0.4s ease',
        }}
      />

      {/* Favorite button */}
      <Box
        onClick={handleFavorite}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 34,
          height: 34,
          borderRadius: '50%',
          bgcolor: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.25s',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.55)' },
        }}
      >
        {isFavorite
          ? <FavoriteIcon sx={{ fontSize: 17, color: '#f87171' }} />
          : <FavoriteBorderIcon sx={{ fontSize: 17, color: 'white' }} />}
      </Box>

      {/* Difficulty badge */}
      {trail.difficulty && (
        <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
          <Box
            sx={{
              px: 1.2, py: 0.4,
              borderRadius: 1.5,
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'white',
              bgcolor: difficultyColors[trail.difficulty] + 'cc',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            {difficultyLabels[trail.difficulty]}
          </Box>
        </Box>
      )}

      {/* Bottom content */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
        }}
      >
        {/* Trail name */}
        <Typography
          sx={{
            color: 'white',
            fontWeight: 700,
            fontSize: '1rem',
            lineHeight: 1.3,
            mb: hovered ? 1 : 0,
            transition: 'margin 0.3s ease',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}
        >
          {trail.title}
        </Typography>

        {/* Stats - revealed on hover */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            overflow: 'hidden',
            maxHeight: hovered ? 40 : 0,
            opacity: hovered ? 1 : 0,
            transition: 'max-height 0.3s ease, opacity 0.3s ease',
          }}
        >
          {trail.evaluation && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <StarIcon sx={{ fontSize: 13, color: '#FFC107' }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
                {trail.evaluation.toFixed(1)}
              </Typography>
            </Box>
          )}
          {trail.distance && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <StraightenIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
                {trail.distance.toFixed(1)} km
              </Typography>
            </Box>
          )}
          {trail.costTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <AccessTimeIcon sx={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }} />
              <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.9)' }}>
                {formatDuration(trail.costTime)}
              </Typography>
            </Box>
          )}
          {trail.locationName && (
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', ml: 'auto' }}>
              {trail.locationName}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
