import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, IconButton, Skeleton, Fade, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { homeService } from '../services/home';
import { TrailCard } from '../components/TrailCard';
import type { CollectionDetail } from '../types';

function EmptyCollectionState() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Fade in timeout={600}>
      <Box sx={{ textAlign: 'center', py: 8, px: 4 }}>
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
              bgcolor: isDark ? alpha(theme.palette.primary.main, 0.1) : 'action.hover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <FolderOpenIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          </Box>
        </Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          這個精選集還沒有步道
        </Typography>
        <Typography variant="body2" color="text.secondary">
          稍後再來看看吧
        </Typography>
      </Box>
    </Fade>
  );
}

export function Collection() {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<CollectionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return;
      try {
        const data = await homeService.getCollection(parseInt(id));
        setCollection(data);
      } catch (error) {
        console.error('Failed to fetch collection:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollection();
  }, [id]);

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="40%" />
      </Box>
    );
  }

  if (!collection) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>找不到這個精選集</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {collection.name}
          </Typography>
          {collection.subTitle && (
            <Typography variant="caption" color="text.secondary">
              {collection.subTitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Trails */}
      <Box sx={{ px: { xs: 2, md: 4 }, py: 2, maxWidth: 1200, mx: 'auto' }}>
        {collection.trails.length > 0 ? (
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
            {collection.trails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </Box>
        ) : (
          <EmptyCollectionState />
        )}
      </Box>
    </Box>
  );
}
