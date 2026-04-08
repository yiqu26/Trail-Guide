import { useState, type ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Card,
  CardContent,
  Skeleton,
  Snackbar,
  Alert,
  Button,
  keyframes,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StraightenIcon from '@mui/icons-material/Straighten';
import HeightIcon from '@mui/icons-material/Height';
import StarIcon from '@mui/icons-material/Star';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trailService, favoriteService } from '../services/trails';
import { visitedService } from '../services/visited';
import { useAuth } from '../contexts/AuthContext';
import { CommentSection } from '../components/CommentSection';
import { TrailMap } from '../components/TrailMap';
import { formatDuration } from '../utils/formatTime';
import type { TrailDetail as TrailDetailType } from '../types';

const heartPop = keyframes`
  0%   { transform: scale(1); }
  30%  { transform: scale(1.5); }
  60%  { transform: scale(0.85); }
  100% { transform: scale(1); }
`;

const difficultyLabels = ['', '入門', '簡單', '中等', '困難', '挑戰'];
const difficultyColors = ['', '#2E7D32', '#558B2F', '#F9A825', '#E64A19', '#6A1B9A'];

const glassBtn = {
  bgcolor: 'rgba(6,14,10,0.55)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: 'white',
  '&:hover': { bgcolor: 'rgba(6,14,10,0.72)' },
  '&:disabled': { opacity: 0.5, color: 'white' },
} as const;

export function TrailDetail() {
  const { id } = useParams<{ id: string }>();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: trail, isLoading } = useQuery({
    queryKey: ['trail', id],
    queryFn: () => trailService.getTrailById(parseInt(id!)),
    enabled: !!id,
  });

  const { data: visitedData } = useQuery({
    queryKey: ['visited', 'check', id],
    queryFn: () => visitedService.checkVisited(parseInt(id!)),
    enabled: !!id && isAuthenticated,
  });
  const isVisited = visitedData?.isVisited ?? false;

  const favoriteMutation = useMutation({
    mutationFn: () =>
      trail?.isFavorite
        ? favoriteService.removeFavorite(trail.id)
        : favoriteService.addFavorite(trail!.id),
    onSuccess: () => {
      queryClient.setQueryData<TrailDetailType>(['trail', id], (old) =>
        old ? { ...old, isFavorite: !old.isFavorite } : old
      );
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      setSnackbar({
        open: true,
        message: trail?.isFavorite ? '已從口袋名單移除' : '已加入口袋名單',
        severity: 'success',
      });
    },
    onError: () => setSnackbar({ open: true, message: '操作失敗，請稍後再試', severity: 'error' }),
  });

  const visitedMutation = useMutation({
    mutationFn: () =>
      isVisited
        ? visitedService.removeVisited(parseInt(id!))
        : visitedService.markVisited(parseInt(id!)),
    onSuccess: () => {
      queryClient.setQueryData(['visited', 'check', id], { isVisited: !isVisited });
      queryClient.invalidateQueries({ queryKey: ['myVisited'] });
      setSnackbar({
        open: true,
        message: isVisited ? '已取消標記' : '已標記為去過',
        severity: 'success',
      });
    },
    onError: () => setSnackbar({ open: true, message: '操作失敗，請稍後再試', severity: 'error' }),
  });

  const handleShare = async () => {
    if (!trail) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: trail.title, text: `來看看這條步道：${trail.title}`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSnackbar({ open: true, message: '連結已複製', severity: 'success' });
      }
    } catch { /* cancelled */ }
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height="60svh" />
        <Box sx={{ p: 2.5, mt: -6, position: 'relative', bgcolor: 'background.default', borderRadius: '24px 24px 0 0' }}>
          <Skeleton variant="text" width="70%" height={44} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="40%" />
          <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" width={80} height={72} sx={{ flex: 1 }} />)}
          </Box>
        </Box>
      </Box>
    );
  }

  if (!trail) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', mt: 8 }}>
        <Typography color="text.secondary">找不到這條步道</Typography>
      </Box>
    );
  }

  const diffColor = trail.difficulty ? difficultyColors[trail.difficulty] : undefined;

  return (
    <Box sx={{ bgcolor: 'background.default', pb: 12 }}>
      {/* ── Hero Image (full bleed, 60svh) ── */}
      <Box sx={{ position: 'relative', height: '60svh', overflow: 'hidden' }}>
        <Box
          component="img"
          src={trail.coverImage || '/placeholder-trail.jpg'}
          alt={trail.title}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Multi-stop gradient overlay */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.36) 0%, transparent 35%, rgba(6,14,10,0.8) 100%)',
          pointerEvents: 'none',
        }} />

        {/* Back button */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{ position: 'absolute', top: 'max(env(safe-area-inset-top), 12px)', left: 12, ...glassBtn }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>

        {/* Top-right actions */}
        <Box sx={{ position: 'absolute', top: 'max(env(safe-area-inset-top), 12px)', right: 12, display: 'flex', gap: 1 }}>
          <IconButton onClick={handleShare} sx={glassBtn}>
            <ShareIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton
            onClick={() => { if (!isAuthenticated) { navigate('/login'); return; } favoriteMutation.mutate(); }}
            disabled={favoriteMutation.isPending}
            sx={glassBtn}
          >
            {isAuthenticated && trail.isFavorite ? (
              <FavoriteIcon sx={{ fontSize: 20, color: '#ff5c75', animation: `${heartPop} 0.5s ease` }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        </Box>

        {/* Hero bottom text (title sneak peek) */}
        <Box sx={{ position: 'absolute', bottom: 68, left: 20, right: 20, pointerEvents: 'none' }}>
          {trail.difficulty && diffColor && (
            <Box sx={{ display: 'inline-flex', bgcolor: diffColor, borderRadius: '6px', px: 1, py: 0.3, mb: 1 }}>
              <Typography sx={{ fontSize: '0.68rem', color: 'white', fontWeight: 700, lineHeight: 1 }}>
                {difficultyLabels[trail.difficulty]}
              </Typography>
            </Box>
          )}
          <Typography
            sx={{
              fontFamily: '"Noto Serif TC", serif',
              fontWeight: 700,
              fontSize: '1.5rem',
              lineHeight: 1.3,
              color: 'white',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            {trail.title}
          </Typography>
        </Box>
      </Box>

      {/* ── Floating Content Panel ── */}
      <Box
        sx={{
          position: 'relative',
          mt: '-48px',
          borderRadius: '24px 24px 0 0',
          bgcolor: 'background.default',
          minHeight: '60vh',
          pt: 3,
          px: 2.5,
          zIndex: 1,
        }}
      >
        {/* Drag indicator */}
        <Box sx={{ width: 36, height: 4, bgcolor: 'divider', borderRadius: 2, mx: 'auto', mb: 2.5 }} />

        {/* Location + rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOnIcon sx={{ fontSize: 14, color: 'primary.main' }} />
            <Typography variant="caption" color="text.secondary">
              {[trail.countyName, trail.locationName].filter(Boolean).join(' · ')}
            </Typography>
          </Box>
          {trail.evaluation && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
              <StarIcon sx={{ fontSize: 14, color: '#F5C842' }} />
              <Typography variant="body2" fontWeight={700} sx={{ lineHeight: 1 }}>
                {trail.evaluation.toFixed(1)}
              </Typography>
              {trail.commentCount > 0 && (
                <Typography variant="caption" color="text.secondary">
                  ({trail.commentCount})
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* ── Stat Tiles ── */}
        {(trail.distance || trail.costTime || trail.altitude) && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2.5 }}>
            {trail.distance && (
              <Box sx={{
                flex: 1, py: 1.5, px: 1, borderRadius: '14px',
                bgcolor: 'background.paper',
                border: '1px solid', borderColor: 'divider',
                textAlign: 'center',
              }}>
                <StraightenIcon sx={{ fontSize: 18, color: 'primary.main', mb: 0.3 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1, mb: 0.2 }}>
                  {(trail.distance / 1000).toFixed(1)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>公里</Typography>
              </Box>
            )}
            {trail.costTime && (
              <Box sx={{
                flex: 1, py: 1.5, px: 1, borderRadius: '14px',
                bgcolor: 'background.paper',
                border: '1px solid', borderColor: 'divider',
                textAlign: 'center',
              }}>
                <AccessTimeIcon sx={{ fontSize: 18, color: 'primary.main', mb: 0.3 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1, mb: 0.2 }}>
                  {formatDuration(trail.costTime)}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>時間</Typography>
              </Box>
            )}
            {trail.altitude && (
              <Box sx={{
                flex: 1, py: 1.5, px: 1, borderRadius: '14px',
                bgcolor: 'background.paper',
                border: '1px solid', borderColor: 'divider',
                textAlign: 'center',
              }}>
                <HeightIcon sx={{ fontSize: 18, color: 'primary.main', mb: 0.3 }} />
                <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1, mb: 0.2 }}>
                  {trail.altitude}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>公尺</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Tags */}
        {trail.chips.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.75, mb: 2.5, flexWrap: 'wrap' }}>
            {trail.chips.map((chip) => (
              <Chip
                key={chip}
                label={chip}
                size="small"
                sx={{
                  height: 24,
                  fontSize: '0.72rem',
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(27,67,50,0.07)',
                  color: 'text.secondary',
                  border: 'none',
                }}
              />
            ))}
          </Box>
        )}

        {/* ── Intro ── */}
        {trail.intro && (
          <Box sx={{ mb: 3 }}>
            <SectionHeader>步道介紹</SectionHeader>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
              {trail.intro}
            </Typography>
          </Box>
        )}

        {/* ── Map ── */}
        <Box sx={{ mb: 3 }}>
          <SectionHeader>地圖</SectionHeader>
          <TrailMap
            title={trail.title}
            latitude={trail.latitude}
            longitude={trail.longitude}
            trailHeads={trail.trailHeads}
          />
        </Box>

        {/* ── Trail Heads ── */}
        {trail.trailHeads.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <SectionHeader>步道入口</SectionHeader>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {trail.trailHeads.map((head) => (
                <Card
                  key={head.id}
                  elevation={0}
                  sx={{
                    borderLeft: '3px solid', borderLeftColor: 'primary.main',
                    border: '1px solid', borderColor: 'divider',
                  }}
                >
                  <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ fontFamily: '"Noto Serif TC", serif' }}>
                      {head.name}
                    </Typography>
                    {head.description && (
                      <Typography variant="caption" color="text.secondary">{head.description}</Typography>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* ── Road Status ── */}
        {trail.roadStatus && (
          <Box sx={{ mb: 3 }}>
            <SectionHeader>路況</SectionHeader>
            <Typography variant="body2" color="text.secondary">{trail.roadStatus}</Typography>
          </Box>
        )}

        {/* ── Visited Banner ── */}
        <Box
          onClick={() => { if (!isAuthenticated) { navigate('/login'); return; } visitedMutation.mutate(); }}
          sx={{
            display: 'flex', alignItems: 'center', gap: 2,
            p: 2, mb: 3, borderRadius: '14px', cursor: 'pointer',
            bgcolor: isVisited
              ? (theme) => theme.palette.mode === 'dark' ? 'rgba(46,125,50,0.18)' : 'rgba(46,125,50,0.08)'
              : 'background.paper',
            border: '1px solid',
            borderColor: isVisited ? 'success.main' : 'divider',
            transition: 'all 0.2s ease',
            opacity: visitedMutation.isPending ? 0.6 : 1,
          }}
        >
          {isVisited ? (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 28, flexShrink: 0 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ color: 'text.disabled', fontSize: 28, flexShrink: 0 }} />
          )}
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} color={isVisited ? 'success.main' : 'text.primary'}>
              {isVisited ? '已去過這條步道' : '去過這條步道嗎？'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isVisited ? '點擊可取消標記' : '標記來記錄你的足跡'}
            </Typography>
          </Box>
          <Button
            variant={isVisited ? 'outlined' : 'contained'}
            size="small"
            color={isVisited ? 'success' : 'primary'}
            disabled={visitedMutation.isPending}
            onClick={(e) => { e.stopPropagation(); if (!isAuthenticated) { navigate('/login'); return; } visitedMutation.mutate(); }}
            sx={{ borderRadius: '10px', minWidth: 72, flexShrink: 0 }}
          >
            {isVisited ? '已去過' : '標記'}
          </Button>
        </Box>

        {/* ── Comments ── */}
        <SectionHeader>評論</SectionHeader>
        <CommentSection trailId={trail.id} />
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: 9 }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function SectionHeader({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
      <Typography
        variant="h6"
        sx={{ fontFamily: '"Noto Serif TC", serif', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}
      >
        {children}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
    </Box>
  );
}
