import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import type { UserAchievementProgress } from '../types';

interface AchievementCardProps {
  achievement: UserAchievementProgress;
}

const categoryIcons: Record<string, string> = {
  milestone: '🏆',
  difficulty: '⛰️',
  region: '🗺️',
  hidden: '🎁',
};

const categoryColors: Record<string, string> = {
  milestone: '#FFD700',
  difficulty: '#FF6B6B',
  region: '#4ECDC4',
  hidden: '#9B59B6',
};

export function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = achievement.isUnlocked;
  const hasProgress = achievement.progress !== undefined && achievement.target !== undefined;
  const progressPercent = hasProgress
    ? Math.min((achievement.progress! / achievement.target!) * 100, 100)
    : 0;

  return (
    <Card
      sx={{
        borderRadius: 3,
        position: 'relative',
        overflow: 'visible',
        opacity: isUnlocked ? 1 : 0.7,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: isUnlocked ? 'translateY(-4px)' : 'none',
          boxShadow: isUnlocked ? '0 8px 24px rgba(0,0,0,0.15)' : undefined,
        },
      }}
    >
      {/* Unlocked Badge */}
      {isUnlocked && (
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            right: -8,
            bgcolor: 'success.main',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <CheckCircleIcon sx={{ fontSize: 18, color: 'white' }} />
        </Box>
      )}

      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Icon */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              bgcolor: isUnlocked
                ? categoryColors[achievement.category] || '#2E7D32'
                : 'grey.300',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
              flexShrink: 0,
            }}
          >
            {isUnlocked ? (
              categoryIcons[achievement.category] || <EmojiEventsIcon sx={{ fontSize: 28, color: 'white' }} />
            ) : (
              <LockIcon sx={{ fontSize: 28, color: 'grey.500' }} />
            )}
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{
                  color: isUnlocked ? 'text.primary' : 'text.secondary',
                }}
              >
                {achievement.name}
              </Typography>
              <Chip
                label={`${achievement.points} 點`}
                size="small"
                sx={{
                  bgcolor: isUnlocked ? 'primary.light' : 'grey.200',
                  color: isUnlocked ? 'primary.dark' : 'text.secondary',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, mb: 1 }}
            >
              {achievement.description}
            </Typography>

            {/* Progress Bar */}
            {!isUnlocked && hasProgress && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    進度
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {achievement.progress} / {achievement.target}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercent}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Box>
            )}

            {/* Unlocked Date */}
            {isUnlocked && achievement.unlockedAt && (
              <Typography variant="caption" color="success.main">
                {new Date(achievement.unlockedAt).toLocaleDateString('zh-TW')} 解鎖
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AchievementCard;
