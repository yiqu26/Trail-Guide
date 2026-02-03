import { Box, Skeleton, Card, CardContent, Grid } from '@mui/material';

// 步道卡片骨架屏
export function TrailCardSkeleton() {
  return (
    <Card sx={{ display: 'flex', height: 140 }}>
      <Skeleton
        variant="rectangular"
        width={140}
        height={140}
        animation="wave"
      />
      <CardContent sx={{ flex: 1, py: 1.5 }}>
        <Skeleton variant="text" width="70%" height={28} animation="wave" />
        <Skeleton variant="text" width="50%" height={20} animation="wave" />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <Skeleton variant="rounded" width={60} height={24} animation="wave" />
          <Skeleton variant="rounded" width={60} height={24} animation="wave" />
        </Box>
        <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} animation="wave" />
      </CardContent>
    </Card>
  );
}

// 步道列表骨架屏
export function TrailListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <TrailCardSkeleton key={i} />
      ))}
    </Box>
  );
}

// Bento Grid 骨架屏 (首頁熱門步道)
export function BentoGridSkeleton() {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton
          variant="rounded"
          height={280}
          animation="wave"
          sx={{ borderRadius: 3 }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Grid container spacing={2}>
          {[1, 2, 3, 4].map((i) => (
            <Grid size={6} key={i}>
              <Skeleton
                variant="rounded"
                height={134}
                animation="wave"
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}

// Banner 骨架屏
export function BannerSkeleton() {
  return (
    <Skeleton
      variant="rounded"
      height={200}
      animation="wave"
      sx={{ borderRadius: 3, mb: 3 }}
    />
  );
}

// 精選集骨架屏
export function CollectionSkeleton() {
  return (
    <Box sx={{ display: 'flex', gap: 2, overflowX: 'hidden' }}>
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          width={160}
          height={200}
          animation="wave"
          sx={{ borderRadius: 2, flexShrink: 0 }}
        />
      ))}
    </Box>
  );
}

// 步道詳情骨架屏
export function TrailDetailSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      {/* 圖片 */}
      <Skeleton
        variant="rounded"
        height={250}
        animation="wave"
        sx={{ borderRadius: 0, mx: -2, mt: -2 }}
      />

      {/* 標題 */}
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width="60%" height={36} animation="wave" />
        <Skeleton variant="text" width="40%" height={24} animation="wave" />
      </Box>

      {/* 標籤 */}
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <Skeleton variant="rounded" width={70} height={32} animation="wave" />
        <Skeleton variant="rounded" width={70} height={32} animation="wave" />
        <Skeleton variant="rounded" width={70} height={32} animation="wave" />
      </Box>

      {/* 資訊卡片 */}
      <Box sx={{ mt: 3 }}>
        <Skeleton variant="rounded" height={120} animation="wave" sx={{ borderRadius: 2 }} />
      </Box>

      {/* 描述 */}
      <Box sx={{ mt: 3 }}>
        <Skeleton variant="text" width="30%" height={28} animation="wave" />
        <Skeleton variant="text" width="100%" animation="wave" />
        <Skeleton variant="text" width="100%" animation="wave" />
        <Skeleton variant="text" width="80%" animation="wave" />
      </Box>
    </Box>
  );
}

// 個人資料骨架屏
export function ProfileSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      {/* 頭像區 */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Skeleton variant="circular" width={100} height={100} animation="wave" />
        <Skeleton variant="text" width={120} height={32} sx={{ mt: 1 }} animation="wave" />
        <Skeleton variant="text" width={180} height={20} animation="wave" />
      </Box>

      {/* 統計卡片 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            sx={{ flex: 1, height: 80, borderRadius: 2 }}
            animation="wave"
          />
        ))}
      </Box>

      {/* 選單 */}
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={56}
          sx={{ mb: 1, borderRadius: 2 }}
          animation="wave"
        />
      ))}
    </Box>
  );
}

// 成就列表骨架屏
export function AchievementSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid size={{ xs: 6, sm: 4 }} key={i}>
          <Skeleton
            variant="rounded"
            height={160}
            animation="wave"
            sx={{ borderRadius: 2 }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

// 打卡紀錄骨架屏
export function CheckinSkeleton({ count = 3 }: { count?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Skeleton variant="circular" width={48} height={48} animation="wave" />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={24} animation="wave" />
                <Skeleton variant="text" width="40%" height={20} animation="wave" />
                <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} animation="wave" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

// 全頁載入骨架屏 (用於 Suspense fallback)
export function PageSkeleton() {
  return (
    <Box sx={{ p: 2, pb: 10 }}>
      {/* 頂部區域 */}
      <BannerSkeleton />

      {/* 標題 */}
      <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} animation="wave" />

      {/* 列表 */}
      <TrailListSkeleton count={3} />
    </Box>
  );
}
