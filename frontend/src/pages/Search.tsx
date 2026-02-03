import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Fade,
  Grow,
  Skeleton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PlaceIcon from '@mui/icons-material/Place';
import TerrainIcon from '@mui/icons-material/Terrain';
import { trailService, lookupService } from '../services/trails';
import { TrailCard } from '../components/TrailCard';
import type { TrailListItem, TrailSearchParams, County, Classification } from '../types';

const difficultyOptions = [
  { value: 1, label: '入門', color: '#4CAF50' },
  { value: 2, label: '簡單', color: '#8BC34A' },
  { value: 3, label: '中等', color: '#FFC107' },
  { value: 4, label: '困難', color: '#FF9800' },
  { value: 5, label: '挑戰', color: '#F44336' },
];

// 熱門搜尋標籤
const popularTags = [
  { label: '陽明山', keyword: '陽明山' },
  { label: '合歡山', keyword: '合歡山' },
  { label: '阿里山', keyword: '阿里山' },
  { label: '太魯閣', keyword: '太魯閣' },
  { label: '玉山', keyword: '玉山' },
  { label: '雪山', keyword: '雪山' },
];

// 空狀態元件 - 初始
function InitialState({ onTagClick }: { onTagClick: (keyword: string) => void }) {
  return (
    <Fade in timeout={600}>
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        {/* 裝飾性圖示 */}
        <Box
          sx={{
            position: 'relative',
            width: 140,
            height: 140,
            mx: 'auto',
            mb: 3,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              width: 140,
              height: 140,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              width: 20,
              height: 20,
              borderRadius: '50%',
              bgcolor: '#81C784',
              top: 5,
              right: 15,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-6px)' },
              },
            }}
          />
          <TerrainIcon
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: 56,
              color: '#4CAF50',
            }}
          />
        </Box>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          探索步道
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: 260, mx: 'auto' }}>
          輸入關鍵字搜尋，或使用篩選條件找到理想的步道
        </Typography>

        {/* 熱門搜尋 */}
        <Box sx={{ mt: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <TrendingUpIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              熱門搜尋
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {popularTags.map((tag) => (
              <Chip
                key={tag.label}
                label={tag.label}
                onClick={() => onTagClick(tag.keyword)}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderColor: 'primary.main',
                  },
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}

// 空狀態元件 - 無結果
function NoResultState() {
  return (
    <Fade in timeout={600}>
      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            bgcolor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <SearchIcon sx={{ fontSize: 40, color: 'grey.400' }} />
        </Box>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          找不到符合的步道
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 260, mx: 'auto' }}>
          試試調整搜尋關鍵字或篩選條件
        </Typography>
      </Box>
    </Fade>
  );
}

// Loading Skeleton
function LoadingSkeleton() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        gap: 2,
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <Box key={i} sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Skeleton variant="rectangular" height={180} />
          <Box sx={{ p: 2 }}>
            <Skeleton variant="text" width="70%" height={28} />
            <Skeleton variant="text" width="40%" height={20} />
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export function Search() {
  const [keyword, setKeyword] = useState('');
  const [trails, setTrails] = useState<TrailListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Filter states
  const [counties, setCounties] = useState<County[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [selectedCounty, setSelectedCounty] = useState<number | ''>('');
  const [selectedClassification, setSelectedClassification] = useState<number | ''>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | ''>('');

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [countiesData, classificationsData] = await Promise.all([
          lookupService.getCounties(),
          lookupService.getClassifications(),
        ]);
        setCounties(countiesData);
        setClassifications(classificationsData);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };
    loadFilterOptions();
  }, []);

  const handleSearch = async (searchKeyword?: string) => {
    const finalKeyword = searchKeyword ?? keyword;
    setIsLoading(true);
    setHasSearched(true);
    try {
      const params: TrailSearchParams = {};

      if (finalKeyword.trim()) {
        params.keyword = finalKeyword.trim();
      }
      if (selectedCounty) {
        params.countyId = selectedCounty;
      }
      if (selectedClassification) {
        params.classificationId = selectedClassification;
      }
      if (selectedDifficulty) {
        params.minDifficulty = selectedDifficulty;
        params.maxDifficulty = selectedDifficulty;
      }

      const results = await trailService.getTrails(params);
      setTrails(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tagKeyword: string) => {
    setKeyword(tagKeyword);
    handleSearch(tagKeyword);
  };

  const handleClearFilters = () => {
    setSelectedCounty('');
    setSelectedClassification('');
    setSelectedDifficulty('');
  };

  const hasActiveFilters = selectedCounty || selectedClassification || selectedDifficulty;

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCounty) count++;
    if (selectedClassification) count++;
    if (selectedDifficulty) count++;
    return count;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* 頂部搜尋區 */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          pt: 2,
          pb: 2,
          px: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {/* 搜尋輸入框 */}
        <TextField
          fullWidth
          placeholder="搜尋步道名稱..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowFilters(!showFilters)}
                  sx={{
                    position: 'relative',
                    bgcolor: hasActiveFilters ? 'primary.50' : 'transparent',
                    '&:hover': {
                      bgcolor: hasActiveFilters ? 'primary.100' : 'grey.100',
                    },
                  }}
                >
                  <FilterListIcon color={hasActiveFilters ? 'primary' : 'action'} />
                  {getActiveFilterCount() > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontSize: 11,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {getActiveFilterCount()}
                    </Box>
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'action.hover',
              '& fieldset': { border: 'none' },
              '&:hover': { bgcolor: 'action.selected' },
              '&.Mui-focused': {
                bgcolor: 'background.paper',
                boxShadow: '0 0 0 2px rgba(46, 125, 50, 0.2)',
              },
            },
          }}
        />

        {/* 篩選面板 */}
        <Collapse in={showFilters}>
          <Box
            sx={{
              mt: 2,
              p: 2,
              bgcolor: 'action.hover',
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                篩選條件
              </Typography>
              {hasActiveFilters && (
                <Button size="small" startIcon={<ClearIcon />} onClick={handleClearFilters}>
                  清除
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* 縣市 */}
              <FormControl fullWidth size="small">
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PlaceIcon sx={{ fontSize: 16 }} />
                    縣市
                  </Box>
                </InputLabel>
                <Select
                  value={selectedCounty}
                  label="縣市"
                  onChange={(e) => setSelectedCounty(e.target.value as number | '')}
                  sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                >
                  <MenuItem value="">全部縣市</MenuItem>
                  {counties.map((county) => (
                    <MenuItem key={county.id} value={county.id}>
                      {county.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 分類 */}
              <FormControl fullWidth size="small">
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TerrainIcon sx={{ fontSize: 16 }} />
                    步道類型
                  </Box>
                </InputLabel>
                <Select
                  value={selectedClassification}
                  label="步道類型"
                  onChange={(e) => setSelectedClassification(e.target.value as number | '')}
                  sx={{ bgcolor: 'background.paper', borderRadius: 2 }}
                >
                  <MenuItem value="">全部類型</MenuItem>
                  {classifications.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* 難度 */}
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                  難度等級
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {difficultyOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      variant={selectedDifficulty === option.value ? 'filled' : 'outlined'}
                      onClick={() =>
                        setSelectedDifficulty(selectedDifficulty === option.value ? '' : option.value)
                      }
                      sx={{
                        bgcolor: selectedDifficulty === option.value ? option.color : 'white',
                        color: selectedDifficulty === option.value ? 'white' : 'text.primary',
                        borderColor: selectedDifficulty === option.value ? option.color : 'grey.300',
                        '&:hover': {
                          bgcolor: selectedDifficulty === option.value ? option.color : 'grey.100',
                        },
                      }}
                      size="small"
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              onClick={() => handleSearch()}
              sx={{
                mt: 2,
                borderRadius: 2,
                py: 1.2,
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
              }}
            >
              搜尋步道
            </Button>
          </Box>
        </Collapse>

        {/* 快速搜尋按鈕 */}
        {!showFilters && (
          <Button
            fullWidth
            variant="contained"
            onClick={() => handleSearch()}
            sx={{
              mt: 2,
              borderRadius: 2,
              py: 1.2,
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
            }}
          >
            搜尋
          </Button>
        )}
      </Box>

      {/* 結果區 */}
      <Box sx={{ p: 2 }}>
        {isLoading ? (
          <LoadingSkeleton />
        ) : trails.length > 0 ? (
          <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
            <Fade in timeout={400}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  找到
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">
                  {trails.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  條步道
                </Typography>
              </Box>
            </Fade>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                },
                gap: { xs: 2, sm: 2.5 },
              }}
            >
              {trails.map((trail, index) => (
                <Grow
                  key={trail.id}
                  in
                  timeout={400}
                  style={{ transitionDelay: `${index * 60}ms` }}
                >
                  <Box>
                    <TrailCard trail={trail} />
                  </Box>
                </Grow>
              ))}
            </Box>
          </Box>
        ) : hasSearched ? (
          <NoResultState />
        ) : (
          <InitialState onTagClick={handleTagClick} />
        )}
      </Box>
    </Box>
  );
}
