import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, Alert, Fade, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RefreshIcon from '@mui/icons-material/Refresh';
import ExploreOffIcon from '@mui/icons-material/ExploreOff';
import { trailService } from '../services/trails';
import { TrailCard } from '../components/TrailCard';
import type { NearbyTrail } from '../types';

function NoNearbyState() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Fade in timeout={600}>
      <Box sx={{ textAlign: 'center', py: 6, px: 4 }}>
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
              bgcolor: isDark ? alpha(theme.palette.warning.main, 0.1) : alpha('#FF9800', 0.1),
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: isDark ? alpha(theme.palette.warning.main, 0.2) : alpha('#FF9800', 0.2),
              top: 5,
              right: 10,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-6px)' },
              },
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
            <ExploreOffIcon sx={{ fontSize: 48, color: isDark ? 'warning.light' : 'warning.main' }} />
          </Box>
        </Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          附近沒有找到步道
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260, mx: 'auto' }}>
          100 公里內沒有收錄的步道，可以試試搜尋功能
        </Typography>
      </Box>
    </Fade>
  );
}

export function Nearby() {
  const [trails, setTrails] = useState<NearbyTrail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fetchNearby = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 取得使用者位置
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000, // 5分鐘快取
        });
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });

      const nearby = await trailService.getNearbyTrails(latitude, longitude, 100, 15);
      setTrails(nearby);
    } catch (err) {
      console.error('Failed to get location or fetch trails:', err);
      const geoError = err as GeolocationPositionError;
      if (geoError.code === 1) {
        setError('定位權限被拒絕，請在瀏覽器設定中允許定位');
      } else if (geoError.code === 2) {
        setError('無法取得位置資訊，請確認 GPS 已開啟');
      } else if (geoError.code === 3) {
        setError('取得位置逾時，請重試');
      } else {
        setError('無法取得您的位置，請確認已開啟定位權限');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNearby();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
        }}
      >
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2 }}>正在取得您的位置...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <LocationOnIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography color="text.secondary" sx={{ mb: 2 }}>{error}</Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchNearby}
        >
          重新定位
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, pb: 10 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          附近步道
        </Typography>
        <Button size="small" startIcon={<RefreshIcon />} onClick={fetchNearby}>
          重新定位
        </Button>
      </Box>

      {userLocation && (
        <Alert severity="info" sx={{ mb: 2 }}>
          搜尋範圍：100 公里內，找到 {trails.length} 條步道
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
              trail={{
                id: trail.id,
                title: trail.title,
                coverImage: trail.coverImage,
                difficulty: trail.difficulty,
                evaluation: trail.evaluation,
                chips: [],
                isFavorite: false,
                locationName: `距離 ${trail.distanceKm} 公里`,
              }}
            />
          ))}
        </Box>
      ) : (
        <NoNearbyState />
      )}
    </Box>
  );
}
