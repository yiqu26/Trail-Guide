import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Chip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TerrainIcon from '@mui/icons-material/Terrain';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

// Mock 數據 - 使用真實步道圖片 URL
const mockTrails = [
  {
    id: 1,
    title: '陽明山七星山主峰步道',
    coverImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
    difficulty: 3,
    evaluation: 4.8,
    costTime: 180,
    distance: 4200,
    locationName: '台北市北投區',
    chips: ['百岳', '賞芒花'],
  },
  {
    id: 2,
    title: '合歡山主峰步道',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    difficulty: 2,
    evaluation: 4.9,
    costTime: 60,
    distance: 1800,
    locationName: '南投縣仁愛鄉',
    chips: ['百岳', '日出'],
  },
  {
    id: 3,
    title: '阿里山眠月線',
    coverImage: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800',
    difficulty: 4,
    evaluation: 4.7,
    costTime: 480,
    distance: 13000,
    locationName: '嘉義縣阿里山鄉',
    chips: ['秘境', '鐵道'],
  },
  {
    id: 4,
    title: '抹茶山（聖母山莊步道）',
    coverImage: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    difficulty: 3,
    evaluation: 4.6,
    costTime: 300,
    distance: 5300,
    locationName: '宜蘭縣礁溪鄉',
    chips: ['網美景點', '抹茶山'],
  },
  {
    id: 5,
    title: '象山親山步道',
    coverImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    difficulty: 1,
    evaluation: 4.3,
    costTime: 40,
    distance: 1500,
    locationName: '台北市信義區',
    chips: ['夜景', '101'],
  },
  {
    id: 6,
    title: '太魯閣錐麓古道',
    coverImage: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
    difficulty: 4,
    evaluation: 4.9,
    costTime: 360,
    distance: 10300,
    locationName: '花蓮縣秀林鄉',
    chips: ['斷崖', '古道'],
  },
];

const difficultyLabels = ['', '入門', '簡單', '中等', '困難', '挑戰'];
const difficultyColors = ['', '#4caf50', '#8bc34a', '#ff9800', '#f44336', '#9c27b0'];

export function DesignDemo() {
  const [designType, setDesignType] = useState<'bento' | 'imageFirst'>('bento');
  const navigate = useNavigate();

  return (
    <Box sx={{ pb: 10, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          熱門步道區塊設計比較
        </Typography>
      </Paper>

      {/* Toggle */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={designType}
          exclusive
          onChange={(_, value) => value && setDesignType(value)}
          sx={{ bgcolor: 'white' }}
        >
          <ToggleButton value="bento" sx={{ px: 3 }}>
            A. Bento Grid
          </ToggleButton>
          <ToggleButton value="imageFirst" sx={{ px: 3 }}>
            C. 圖片優先卡片
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Design Description */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Paper sx={{ p: 2, bgcolor: designType === 'bento' ? '#e3f2fd' : '#fff3e0' }}>
          {designType === 'bento' ? (
            <>
              <Typography variant="subtitle1" fontWeight="bold" color="primary">
                A. Bento Grid（便當盒網格）
              </Typography>
              <Typography variant="body2" color="text.secondary">
                靈感來自 Apple。使用不規則大小的格子，1 個大區塊突出精選內容，搭配多個小區塊展示更多選項。強調視覺層次和資訊優先級。
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#e65100' }}>
                C. 圖片優先卡片（Image-First Card）
              </Typography>
              <Typography variant="body2" color="text.secondary">
                靈感來自 Airbnb。大面積圖片佔據卡片主體，文字疊加在圖片底部（漸層遮罩）。視覺衝擊強，適合風景類內容。
              </Typography>
            </>
          )}
        </Paper>
      </Box>

      {/* Section Title */}
      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          熱門步道
        </Typography>
      </Box>

      {/* Design Content */}
      <Box sx={{ px: 2 }}>
        {designType === 'bento' ? (
          <BentoGridDesign trails={mockTrails} />
        ) : (
          <ImageFirstDesign trails={mockTrails} />
        )}
      </Box>
    </Box>
  );
}

// ============================================
// A. Bento Grid 設計
// ============================================
function BentoGridDesign({ trails }: { trails: typeof mockTrails }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(2, 180px)',
        gap: 1.5,
        // 響應式：手機版改為 2 欄
        '@media (max-width: 600px)': {
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'repeat(3, 150px)',
        },
      }}
    >
      {/* 大卡片 - 佔據 2x2 格子 */}
      <Box
        sx={{
          gridColumn: { xs: 'span 2', sm: 'span 2' },
          gridRow: { xs: 'span 2', sm: 'span 2' },
        }}
      >
        <BentoCard trail={trails[0]} isLarge />
      </Box>

      {/* 小卡片 1 */}
      <BentoCard trail={trails[1]} />

      {/* 小卡片 2 */}
      <BentoCard trail={trails[2]} />

      {/* 小卡片 3 */}
      <BentoCard trail={trails[3]} />

      {/* 小卡片 4 */}
      <BentoCard trail={trails[4]} />
    </Box>
  );
}

function BentoCard({
  trail,
  isLarge = false,
}: {
  trail: (typeof mockTrails)[0];
  isLarge?: boolean;
}) {
  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: 6,
        },
      }}
    >
      {/* 背景圖 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${trail.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* 漸層遮罩 */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* 難度標籤 - 左上角 */}
      <Chip
        label={difficultyLabels[trail.difficulty]}
        size="small"
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          bgcolor: difficultyColors[trail.difficulty],
          color: 'white',
          fontWeight: 'bold',
          fontSize: isLarge ? '0.75rem' : '0.65rem',
        }}
      />

      {/* 收藏按鈕 - 右上角 */}
      <IconButton
        size="small"
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          color: 'white',
          bgcolor: 'rgba(0,0,0,0.3)',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
        }}
      >
        <FavoriteBorderIcon fontSize="small" />
      </IconButton>

      {/* 內容 - 底部 */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: isLarge ? 2 : 1.5,
          color: 'white',
        }}
      >
        <Typography
          variant={isLarge ? 'h6' : 'subtitle2'}
          fontWeight="bold"
          sx={{
            textShadow: '0 1px 3px rgba(0,0,0,0.5)',
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          {trail.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon sx={{ fontSize: isLarge ? 16 : 14, color: '#ffc107' }} />
            <Typography variant="caption" sx={{ ml: 0.3 }}>
              {trail.evaluation}
            </Typography>
          </Box>
          {isLarge && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon sx={{ fontSize: 14, opacity: 0.8 }} />
                <Typography variant="caption" sx={{ ml: 0.3 }}>
                  {trail.costTime}分
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {trail.locationName}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Card>
  );
}

// ============================================
// C. 圖片優先卡片設計
// ============================================
function ImageFirstDesign({ trails }: { trails: typeof mockTrails }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: 2,
      }}
    >
      {trails.map((trail) => (
        <ImageFirstCard key={trail.id} trail={trail} />
      ))}
    </Box>
  );
}

function ImageFirstCard({ trail }: { trail: (typeof mockTrails)[0] }) {
  return (
    <Card
      sx={{
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      {/* 圖片容器 - 16:10 比例 */}
      <Box
        sx={{
          position: 'relative',
          paddingTop: '62.5%', // 16:10 比例
          overflow: 'hidden',
        }}
      >
        {/* 背景圖 */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${trail.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'transform 0.3s',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />

        {/* 漸層遮罩 - 底部 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* 難度標籤 - 左上角 */}
        <Chip
          label={difficultyLabels[trail.difficulty]}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            bgcolor: difficultyColors[trail.difficulty],
            color: 'white',
            fontWeight: 'bold',
          }}
        />

        {/* 收藏按鈕 - 右上角 */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: 'white',
            bgcolor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
          }}
        >
          <FavoriteBorderIcon />
        </IconButton>

        {/* 標題 - 圖片底部疊加 */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            color: 'white',
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
              lineHeight: 1.3,
            }}
          >
            {trail.title}
          </Typography>
        </Box>
      </Box>

      {/* 資訊區塊 - 卡片底部 */}
      <Box sx={{ p: 2, bgcolor: 'white' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {trail.locationName}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon sx={{ fontSize: 18, color: '#ffc107' }} />
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 0.5 }}>
              {trail.evaluation}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {trail.costTime}分鐘
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TerrainIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" sx={{ ml: 0.5 }}>
              {(trail.distance / 1000).toFixed(1)}km
            </Typography>
          </Box>
        </Box>

        {/* 標籤 */}
        <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
          {trail.chips.map((chip) => (
            <Chip
              key={chip}
              label={chip}
              size="small"
              variant="outlined"
              sx={{
                borderRadius: 2,
                fontSize: '0.75rem',
              }}
            />
          ))}
        </Box>
      </Box>
    </Card>
  );
}
