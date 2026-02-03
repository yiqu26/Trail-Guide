import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Alert,
  Fade,
  Grow,
  Skeleton,
  Tabs,
  Tab,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { achievementService } from '../services/achievements';
import { AchievementCard } from '../components/AchievementCard';
import type { MyAchievements, UserAchievementProgress } from '../types';

const categoryLabels: Record<string, string> = {
  all: '全部',
  milestone: '里程碑',
  difficulty: '難度挑戰',
  region: '地區探索',
  hidden: '隱藏成就',
};

function LoadingSkeleton() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} variant="rounded" height={100} sx={{ borderRadius: 3 }} />
      ))}
    </Box>
  );
}

function OverviewCard({ data }: { data: MyAchievements }) {
  const progressPercent = (data.unlockedCount / data.totalCount) * 100;

  return (
    <Card sx={{ mb: 3, borderRadius: 3, bgcolor: 'primary.main', color: 'white' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <EmojiEventsIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {data.totalPoints}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              累計點數
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">
              成就進度
            </Typography>
            <Typography variant="body2">
              {data.unlockedCount} / {data.totalCount}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                bgcolor: 'white',
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export function Achievements() {
  const [data, setData] = useState<MyAchievements | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const result = await achievementService.getMyAchievements();
        setData(result);
      } catch (err) {
        console.error('Failed to fetch achievements:', err);
        setError('無法載入成就資料，請重新登入後再試');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = data
    ? ['all', ...new Set(data.achievements.map((a) => a.category))]
    : ['all'];

  const filteredAchievements: UserAchievementProgress[] = data
    ? activeTab === 'all'
      ? data.achievements
      : data.achievements.filter((a) => a.category === activeTab)
    : [];

  // Sort: unlocked first, then by sortOrder
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (a.isUnlocked !== b.isUnlocked) {
      return a.isUnlocked ? -1 : 1;
    }
    return a.sortOrder - b.sortOrder;
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          position: 'relative',
          pt: 4,
          pb: 8,
          px: 3,
          background: 'linear-gradient(135deg, #FF8F00 0%, #FFB300 50%, #FFD54F 100%)',
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
              <EmojiEventsIcon sx={{ color: 'white', fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold" color="white">
                成就徽章
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              {isLoading
                ? '載入中...'
                : `已解鎖 ${data?.unlockedCount || 0} / ${data?.totalCount || 0} 個成就`}
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
        ) : data ? (
          <>
            <OverviewCard data={data} />

            {/* Category Tabs */}
            <Tabs
              value={activeTab}
              onChange={(_, value) => setActiveTab(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              {categories.map((cat) => (
                <Tab
                  key={cat}
                  value={cat}
                  label={categoryLabels[cat] || cat}
                />
              ))}
            </Tabs>

            {/* Achievement List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {sortedAchievements.map((achievement, index) => (
                <Grow
                  key={achievement.id}
                  in
                  timeout={400}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <Box>
                    <AchievementCard achievement={achievement} />
                  </Box>
                </Grow>
              ))}

              {sortedAchievements.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    此分類暫無成就
                  </Typography>
                </Box>
              )}
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  );
}
