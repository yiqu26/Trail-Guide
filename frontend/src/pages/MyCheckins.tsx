import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Fade,
  Grow,
  Button,
  Skeleton,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useNavigate } from 'react-router-dom';
import { checkinService } from '../services/checkins';
import { CheckinImages } from '../components/CheckinImages';
import type { Checkin, CheckinStats } from '../types';

function EmptyState({ onExplore }: { onExplore: () => void }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Fade in timeout={800}>
      <Box sx={{ textAlign: 'center', py: 8, px: 4 }}>
        <Box
          sx={{
            position: 'relative',
            width: 160,
            height: 160,
            mx: 'auto',
            mb: 3,
          }}
        >
          {/* 背景圓形 */}
          <Box
            sx={{
              position: 'absolute',
              width: 160,
              height: 160,
              borderRadius: '50%',
              background: isDark
                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
                : 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            }}
          />
          {/* 裝飾小圓 */}
          <Box
            sx={{
              position: 'absolute',
              width: 24,
              height: 24,
              borderRadius: '50%',
              bgcolor: isDark ? alpha(theme.palette.primary.main, 0.3) : '#A5D6A7',
              top: 10,
              right: 10,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-8px)' },
              },
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: isDark ? alpha(theme.palette.primary.main, 0.4) : '#81C784',
              bottom: 20,
              left: 5,
              animation: 'float 3s ease-in-out infinite 0.5s',
            }}
          />
          {/* 打卡圖標 */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color: 'primary.main',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                },
              }}
            />
          </Box>
        </Box>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          還沒有打卡紀錄
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 280, mx: 'auto' }}>
          探索步道並完成打卡，記錄你的登山足跡
        </Typography>

        <Button
          variant="contained"
          startIcon={<ExploreIcon />}
          onClick={onExplore}
          sx={{ borderRadius: 3, px: 4, py: 1.2 }}
        >
          探索步道
        </Button>
      </Box>
    </Fade>
  );
}

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

function StatsCard({ stats }: { stats: CheckinStats }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {stats.totalCheckins}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              總打卡數
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {stats.uniqueTrails}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              不同步道
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {stats.verifiedCheckins}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              GPS 驗證
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Chip
            icon={<EmojiEventsIcon />}
            label={`${stats.totalPoints} 點`}
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={`${Math.floor(stats.totalMinutes / 60)}h ${stats.totalMinutes % 60}m`}
            variant="outlined"
          />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => navigate('/achievements')}
        >
          查看成就 ({stats.achievementCount} 個已解鎖)
        </Button>
      </CardContent>
    </Card>
  );
}

function CheckinCard({
  checkin,
  onDelete,
}: {
  checkin: Checkin;
  onDelete: (id: number) => void;
}) {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete(checkin.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card sx={{ borderRadius: 3, mb: 2 }}>
        <CardContent sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Trail Image */}
            <Box
              component="img"
              src={checkin.trailCoverImage || '/placeholder-trail.jpg'}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                objectFit: 'cover',
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/trail/${checkin.trailId}`)}
            />

            {/* Content */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/trail/${checkin.trailId}`)}
                  >
                    {checkin.trailTitle}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(checkin.checkinTime).toLocaleDateString('zh-TW', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => setShowDeleteDialog(true)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                {checkin.isLocationVerified && (
                  <Chip
                    icon={<LocationOnIcon />}
                    label="已驗證"
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                )}
                {checkin.trailDifficulty && (
                  <Chip
                    label={`難度 ${checkin.trailDifficulty}`}
                    size="small"
                    variant="outlined"
                  />
                )}
                {checkin.durationMinutes && (
                  <Chip
                    icon={<AccessTimeIcon />}
                    label={`${Math.floor(checkin.durationMinutes / 60)}h ${checkin.durationMinutes % 60}m`}
                    size="small"
                    variant="outlined"
                  />
                )}
              </Box>

              {checkin.note && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                  {checkin.note}
                </Typography>
              )}

              {/* Checkin Photos */}
              {checkin.images && checkin.images.length > 0 && (
                <Box sx={{ mt: 1.5 }}>
                  <CheckinImages images={checkin.images} height={64} />
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>確定要刪除這筆打卡？</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            刪除後將無法恢復，但已解鎖的成就不會受影響。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>取消</Button>
          <Button color="error" onClick={handleDelete}>
            刪除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function MyCheckins() {
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const [checkinsData, statsData] = await Promise.all([
        checkinService.getMyCheckins(1, 50),
        checkinService.getMyStats(),
      ]);
      setCheckins(checkinsData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch checkins:', err);
      setError('無法載入打卡紀錄，請重新登入後再試');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await checkinService.deleteCheckin(id);
      setCheckins(checkins.filter((c) => c.id !== id));
      // Refresh stats
      const newStats = await checkinService.getMyStats();
      setStats(newStats);
    } catch (err) {
      console.error('Failed to delete checkin:', err);
    }
  };

  const handleExplore = () => {
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          position: 'relative',
          pt: 4,
          pb: 8,
          px: 3,
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 50%, #81C784 100%)',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
            top: -40,
            right: -30,
          }}
        />

        <Fade in timeout={600}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <CheckCircleIcon sx={{ color: 'white', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="white">
                我的打卡紀錄
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {isLoading ? '載入中...' : `${checkins.length} 筆登山紀錄`}
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pt: 3, pb: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : checkins.length > 0 ? (
          <>
            {stats && <StatsCard stats={stats} />}
            {checkins.map((checkin, index) => (
              <Grow
                key={checkin.id}
                in
                timeout={400}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <Box>
                  <CheckinCard checkin={checkin} onDelete={handleDelete} />
                </Box>
              </Grow>
            ))}
          </>
        ) : !error ? (
          <EmptyState onExplore={handleExplore} />
        ) : null}
      </Box>
    </Box>
  );
}
