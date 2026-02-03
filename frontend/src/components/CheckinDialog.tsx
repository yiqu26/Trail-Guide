import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { checkinService } from '../services/checkins';
import type { CreateCheckinData, CheckinResult, Achievement } from '../types';

interface CheckinDialogProps {
  open: boolean;
  onClose: () => void;
  trailId: number;
  trailTitle: string;
  trailLat?: number;
  trailLng?: number;
  onSuccess?: (result: CheckinResult) => void;
}

export function CheckinDialog({
  open,
  onClose,
  trailId,
  trailTitle,
  trailLat,
  trailLng,
  onSuccess,
}: CheckinDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [durationMinutes, setDurationMinutes] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showAchievements, setShowAchievements] = useState(false);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNote('');
      setDurationMinutes('');
      setError(null);
      setNewAchievements([]);
      setShowAchievements(false);
      setLocation(null);
      setLocationError(null);
      // Auto-get location when dialog opens
      getLocation();
    }
  }, [open]);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('您的瀏覽器不支援定位功能');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('定位權限被拒絕');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('無法取得位置資訊');
            break;
          case error.TIMEOUT:
            setLocationError('取得位置逾時');
            break;
          default:
            setLocationError('定位失敗');
        }
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const calculateDistance = () => {
    if (!location || !trailLat || !trailLng) return null;

    const R = 6371000; // Earth radius in meters
    const lat1 = location.lat * Math.PI / 180;
    const lat2 = trailLat * Math.PI / 180;
    const deltaLat = (trailLat - location.lat) * Math.PI / 180;
    const deltaLng = (trailLng - location.lng) * Math.PI / 180;

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const distance = calculateDistance();
  const isWithinRange = distance !== null && distance <= 1000;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const data: CreateCheckinData = {
      trailId,
      latitude: location?.lat,
      longitude: location?.lng,
      note: note.trim() || undefined,
      durationMinutes: durationMinutes || undefined,
    };

    try {
      const result = await checkinService.createCheckin(data);

      if (result.newAchievements && result.newAchievements.length > 0) {
        setNewAchievements(result.newAchievements);
        setShowAchievements(true);
      } else {
        onSuccess?.(result);
        onClose();
      }
    } catch (err) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || '打卡失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAchievementClose = () => {
    setShowAchievements(false);
    onSuccess?.({ checkin: {} as CheckinResult['checkin'], newAchievements });
    onClose();
  };

  // Achievement celebration view
  if (showAchievements && newAchievements.length > 0) {
    return (
      <Dialog open={open} onClose={handleAchievementClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
          <Typography variant="h5" color="primary" fontWeight="bold">
            恭喜解鎖新成就！
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
            {newAchievements.map((achievement) => (
              <Box
                key={achievement.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  bgcolor: 'success.light',
                  borderRadius: 2,
                  animation: 'fadeIn 0.5s ease-in-out',
                  '@keyframes fadeIn': {
                    from: { opacity: 0, transform: 'translateY(20px)' },
                    to: { opacity: 1, transform: 'translateY(0)' },
                  },
                }}
              >
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 36, color: 'white' }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="white">
                    {achievement.name}
                  </Typography>
                  <Typography variant="body2" color="white" sx={{ opacity: 0.9 }}>
                    {achievement.description}
                  </Typography>
                  <Chip
                    label={`+${achievement.points} 點`}
                    size="small"
                    sx={{ mt: 1, bgcolor: 'white', color: 'primary.main' }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button variant="contained" size="large" onClick={handleAchievementClose}>
            太棒了！
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        登山打卡
        <Typography variant="body2" color="text.secondary">
          {trailTitle}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
          {/* GPS Location */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              GPS 定位驗證
            </Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: location
                  ? isWithinRange
                    ? 'success.light'
                    : 'warning.light'
                  : 'grey.100',
              }}
            >
              {isLocating ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} />
                  <Typography variant="body2">正在取得位置...</Typography>
                </Box>
              ) : location ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon color={isWithinRange ? 'success' : 'warning'} />
                    <Typography variant="body2" fontWeight="bold">
                      {isWithinRange ? '位置已驗證' : '距離較遠'}
                    </Typography>
                  </Box>
                  {distance !== null && (
                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                      距離步道 {distance < 1000 ? `${Math.round(distance)} 公尺` : `${(distance / 1000).toFixed(1)} 公里`}
                    </Typography>
                  )}
                  {!isWithinRange && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      超出 1 公里範圍，打卡將標記為未驗證
                    </Typography>
                  )}
                </Box>
              ) : locationError ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOffIcon color="error" />
                    <Typography variant="body2" color="error">
                      {locationError}
                    </Typography>
                  </Box>
                  <Button size="small" onClick={getLocation} sx={{ mt: 1 }}>
                    重新定位
                  </Button>
                </Box>
              ) : (
                <Button startIcon={<LocationOnIcon />} onClick={getLocation}>
                  取得位置
                </Button>
              )}
            </Box>
          </Box>

          {/* Duration */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              花費時間（選填）
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon color="action" />
              <TextField
                type="number"
                size="small"
                placeholder="輸入分鐘數"
                value={durationMinutes}
                onChange={(e) => {
                  const value = e.target.value;
                  setDurationMinutes(value === '' ? '' : Math.max(0, parseInt(value)));
                }}
                sx={{ width: 150 }}
                inputProps={{ min: 0 }}
              />
              <Typography variant="body2" color="text.secondary">
                分鐘
              </Typography>
            </Box>
            {durationMinutes && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                約 {Math.floor(Number(durationMinutes) / 60)} 小時 {Number(durationMinutes) % 60} 分鐘
              </Typography>
            )}
          </Box>

          {/* Note */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              心得筆記（選填）
            </Typography>
            <TextField
              multiline
              rows={3}
              fullWidth
              placeholder="分享你的登山心得..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Box>

          {/* Error */}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          取消
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? '打卡中...' : '確認打卡'}
        </Button>
      </DialogActions>
      {isLoading && <LinearProgress />}
    </Dialog>
  );
}

export default CheckinDialog;
