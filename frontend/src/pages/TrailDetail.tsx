import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Card,
  CardContent,
  Skeleton,
  Divider,
  Snackbar,
  Alert,
  Button,
  Avatar,
  keyframes,
} from '@mui/material';

const heartBeat = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.3); }
  100% { transform: scale(1); }
`;
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TerrainIcon from '@mui/icons-material/Terrain';
import HeightIcon from '@mui/icons-material/Height';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate } from 'react-router-dom';
import { trailService, favoriteService } from '../services/trails';
import { checkinService } from '../services/checkins';
import { useAuth } from '../contexts/AuthContext';
import { CommentSection } from '../components/CommentSection';
import { TrailMap } from '../components/TrailMap';
import { CheckinDialog } from '../components/CheckinDialog';
import { formatDuration } from '../utils/formatTime';
import type { TrailDetail as TrailDetailType, Checkin } from '../types';

const difficultyLabels = ['', '入門', '簡單', '中等', '困難', '挑戰'];

export function TrailDetail() {
  const { id } = useParams<{ id: string }>();
  const [trail, setTrail] = useState<TrailDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [showCheckinDialog, setShowCheckinDialog] = useState(false);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [checkinsLoading, setCheckinsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchTrail = async () => {
      if (!id) return;
      try {
        const data = await trailService.getTrailById(parseInt(id));
        setTrail(data);
      } catch (error) {
        console.error('Failed to fetch trail:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrail();
  }, [id]);

  useEffect(() => {
    const fetchCheckins = async () => {
      if (!id) return;
      setCheckinsLoading(true);
      try {
        const data = await checkinService.getTrailCheckins(parseInt(id), 1, 5);
        setCheckins(data);
      } catch (error) {
        console.error('Failed to fetch checkins:', error);
      } finally {
        setCheckinsLoading(false);
      }
    };

    fetchCheckins();
  }, [id]);

  const handleCheckinClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowCheckinDialog(true);
  };

  const handleCheckinSuccess = () => {
    setSnackbar({ open: true, message: '打卡成功！', severity: 'success' });
    // Refresh checkins
    if (id) {
      checkinService.getTrailCheckins(parseInt(id), 1, 5).then(setCheckins);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!trail) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsFavoriteLoading(true);
    try {
      if (trail.isFavorite) {
        await favoriteService.removeFavorite(trail.id);
        setSnackbar({ open: true, message: '已從收藏移除', severity: 'success' });
      } else {
        await favoriteService.addFavorite(trail.id);
        setSnackbar({ open: true, message: '已加入收藏', severity: 'success' });
      }
      setTrail({ ...trail, isFavorite: !trail.isFavorite });
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      setSnackbar({ open: true, message: '操作失敗，請稍後再試', severity: 'error' });
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleShare = async () => {
    if (!trail) return;

    const shareData = {
      title: trail.title,
      text: `來看看這條步道：${trail.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({ open: true, message: '連結已複製到剪貼簿', severity: 'success' });
      }
    } catch {
      // User cancelled or error
      console.log('Share cancelled or failed');
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={250} />
        <Box sx={{ p: 2 }}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Box>
    );
  }

  if (!trail) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography>找不到這條步道</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      {/* Header Image */}
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={trail.coverImage || '/placeholder-trail.jpg'}
          alt={trail.title}
          sx={{ width: '100%', height: 250, objectFit: 'cover' }}
        />
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            bgcolor: (theme) => theme.palette.mode === 'dark'
              ? 'rgba(30, 30, 30, 0.85)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(50, 50, 50, 0.9)'
                : 'rgba(255, 255, 255, 1)',
            },
          }}
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
          <IconButton
            sx={{
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.85)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              '&:hover': {
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(50, 50, 50, 0.9)'
                  : 'rgba(255, 255, 255, 1)',
              },
            }}
            onClick={handleShare}
          >
            <ShareIcon />
          </IconButton>
          <IconButton
            sx={{
              bgcolor: (theme) => theme.palette.mode === 'dark'
                ? 'rgba(30, 30, 30, 0.85)'
                : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              transition: 'transform 0.2s ease, background-color 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(50, 50, 50, 0.9)'
                  : 'rgba(255, 255, 255, 1)',
              },
              '&:active': {
                transform: 'scale(0.9)',
              },
            }}
            onClick={handleFavoriteToggle}
            disabled={isFavoriteLoading}
          >
            {trail.isFavorite ? (
              <FavoriteIcon
                color="error"
                sx={{
                  animation: `${heartBeat} 0.6s ease-in-out`,
                }}
              />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          {trail.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {trail.countyName} {trail.locationName}
        </Typography>

        {/* Stats */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          {trail.difficulty && (
            <Chip
              label={difficultyLabels[trail.difficulty]}
              color="primary"
              size="small"
            />
          )}
          {trail.evaluation && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ fontSize: 18, color: '#ffc107' }} />
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {trail.evaluation.toFixed(1)} ({trail.commentCount} 則評論)
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
          {trail.distance && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TerrainIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2">
                {(trail.distance / 1000).toFixed(1)} 公里
              </Typography>
            </Box>
          )}
          {trail.costTime && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTimeIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2">{formatDuration(trail.costTime)}</Typography>
            </Box>
          )}
          {trail.altitude && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <HeightIcon sx={{ fontSize: 20, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2">{trail.altitude} 公尺</Typography>
            </Box>
          )}
        </Box>

        {/* Chips */}
        {trail.chips.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
            {trail.chips.map((chip) => (
              <Chip key={chip} label={chip} size="small" variant="outlined" />
            ))}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Intro */}
        {trail.intro && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              步道介紹
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {trail.intro}
            </Typography>
          </Box>
        )}

        {/* Map */}
        <TrailMap
          title={trail.title}
          latitude={trail.latitude}
          longitude={trail.longitude}
          trailHeads={trail.trailHeads}
        />

        {/* Trail Heads */}
        {trail.trailHeads.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              步道入口
            </Typography>
            {trail.trailHeads.map((head) => (
              <Card key={head.id} sx={{ mb: 1 }}>
                <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {head.name}
                  </Typography>
                  {head.description && (
                    <Typography variant="caption" color="text.secondary">
                      {head.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Road Status */}
        {trail.roadStatus && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              路況
            </Typography>
            <Typography variant="body2">{trail.roadStatus}</Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Checkin Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              登山打卡
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<CheckCircleIcon />}
              onClick={handleCheckinClick}
            >
              打卡
            </Button>
          </Box>

          {checkinsLoading ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="circular" width={40} height={40} />
              ))}
            </Box>
          ) : checkins.length === 0 ? (
            <Card sx={{ bgcolor: 'action.hover' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary" variant="body2">
                  還沒有人打卡
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  成為第一個完成這條步道的人！
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box>
              {checkins.slice(0, 3).map((checkin) => (
                <Box
                  key={checkin.id}
                  sx={{
                    display: 'flex',
                    gap: 1.5,
                    py: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Avatar src={checkin.userAvatar} sx={{ width: 36, height: 36 }}>
                    {checkin.userName[0]}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {checkin.userName}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {checkin.isLocationVerified && (
                          <LocationOnIcon sx={{ fontSize: 14, color: 'success.main' }} />
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {new Date(checkin.checkinTime).toLocaleDateString('zh-TW')}
                        </Typography>
                      </Box>
                    </Box>
                    {checkin.note && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {checkin.note}
                      </Typography>
                    )}
                    {checkin.durationMinutes && (
                      <Typography variant="caption" color="text.secondary">
                        花費 {Math.floor(checkin.durationMinutes / 60)}h {checkin.durationMinutes % 60}m
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
              {checkins.length > 3 && (
                <Typography
                  variant="body2"
                  color="primary"
                  sx={{ mt: 1, textAlign: 'center', cursor: 'pointer' }}
                >
                  查看全部 {checkins.length} 筆打卡紀錄
                </Typography>
              )}
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Comments Section */}
        <CommentSection trailId={trail.id} />
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 8 }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Checkin Dialog */}
      {trail && (
        <CheckinDialog
          open={showCheckinDialog}
          onClose={() => setShowCheckinDialog(false)}
          trailId={trail.id}
          trailTitle={trail.title}
          trailLat={trail.latitude}
          trailLng={trail.longitude}
          onSuccess={handleCheckinSuccess}
        />
      )}
    </Box>
  );
}
