import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Fade,
  Grow,
  Skeleton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TerrainIcon from '@mui/icons-material/Terrain';
import { useNavigate } from 'react-router-dom';
import { visitedService } from '../services/visited';
import { TrailCard } from '../components/TrailCard';
import type { VisitedTrail } from '../types';

// 空狀態元件
function EmptyState() {
  return (
    <Fade in timeout={600}>
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Box
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            mx: 'auto',
            mb: 3,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            }}
          />
          <TerrainIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 48,
              color: '#4CAF50',
            }}
          />
        </Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          還沒有去過的步道
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260, mx: 'auto' }}>
          探索步道後，標記「已去過」來記錄你的足跡
        </Typography>
      </Box>
    </Fade>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[1, 2, 3].map((i) => (
        <Box key={i} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Skeleton variant="rectangular" height={120} />
        </Box>
      ))}
    </Box>
  );
}

export function MyVisited() {
  const navigate = useNavigate();
  const [visited, setVisited] = useState<VisitedTrail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVisited();
  }, []);

  const loadVisited = async () => {
    try {
      const data = await visitedService.getMyVisited();
      setVisited(data);
    } catch (error) {
      console.error('Failed to load visited trails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 2,
          pb: 2,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <CheckCircleIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">
          已去過的步道
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
          {visited.length} 條
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : visited.length === 0 ? (
          <EmptyState />
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
              gap: 2,
            }}
          >
            {visited.map((item, index) => (
              <Grow
                key={item.id}
                in
                timeout={400}
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <Box>
                  <TrailCard
                    trail={{
                      id: item.trailId,
                      title: item.trailTitle,
                      coverImage: item.trailCoverImage,
                      difficulty: item.trailDifficulty,
                      locationName: item.trailLocation,
                      chips: [],
                      isFavorite: false,
                    }}
                  />
                  {item.visitedAt && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mt: 0.5, ml: 1 }}
                    >
                      去過日期：{new Date(item.visitedAt).toLocaleDateString('zh-TW')}
                    </Typography>
                  )}
                </Box>
              </Grow>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
