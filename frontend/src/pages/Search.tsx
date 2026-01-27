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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { trailService, lookupService } from '../services/trails';
import { TrailCard } from '../components/TrailCard';
import type { TrailListItem, TrailSearchParams, County, Classification } from '../types';

const difficultyOptions = [
  { value: 1, label: '入門' },
  { value: 2, label: '簡單' },
  { value: 3, label: '中等' },
  { value: 4, label: '困難' },
  { value: 5, label: '挑戰' },
];

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

  const handleSearch = async () => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const params: TrailSearchParams = {};

      if (keyword.trim()) {
        params.keyword = keyword.trim();
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
    <Box sx={{ p: 2, pb: 10 }}>
      {/* Search Input */}
      <TextField
        fullWidth
        placeholder="搜尋步道名稱..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                color={hasActiveFilters ? 'primary' : 'default'}
              >
                <FilterListIcon />
                {getActiveFilterCount() > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      fontSize: 10,
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
        sx={{ mb: 2 }}
      />

      {/* Filter Panel */}
      <Collapse in={showFilters}>
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
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
            {/* County Select */}
            <FormControl fullWidth size="small">
              <InputLabel>縣市</InputLabel>
              <Select
                value={selectedCounty}
                label="縣市"
                onChange={(e) => setSelectedCounty(e.target.value as number | '')}
              >
                <MenuItem value="">全部</MenuItem>
                {counties.map((county) => (
                  <MenuItem key={county.id} value={county.id}>
                    {county.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Classification Select */}
            <FormControl fullWidth size="small">
              <InputLabel>分類</InputLabel>
              <Select
                value={selectedClassification}
                label="分類"
                onChange={(e) => setSelectedClassification(e.target.value as number | '')}
              >
                <MenuItem value="">全部</MenuItem>
                {classifications.map((classification) => (
                  <MenuItem key={classification.id} value={classification.id}>
                    {classification.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Difficulty Chips */}
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                難度
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {difficultyOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    variant={selectedDifficulty === option.value ? 'filled' : 'outlined'}
                    color={selectedDifficulty === option.value ? 'primary' : 'default'}
                    onClick={() =>
                      setSelectedDifficulty(selectedDifficulty === option.value ? '' : option.value)
                    }
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSearch}
            sx={{ mt: 2 }}
          >
            搜尋
          </Button>
        </Box>
      </Collapse>

      {/* Quick Search Button (when filters collapsed) */}
      {!showFilters && (
        <Button
          fullWidth
          variant="contained"
          onClick={handleSearch}
          sx={{ mb: 2 }}
        >
          搜尋
        </Button>
      )}

      {/* Results */}
      {isLoading ? (
        <Typography>搜尋中...</Typography>
      ) : trails.length > 0 ? (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            找到 {trails.length} 條步道
          </Typography>
          {trails.map((trail) => (
            <TrailCard key={trail.id} trail={trail} />
          ))}
        </>
      ) : hasSearched ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography color="text.secondary">找不到符合的步道</Typography>
          <Typography variant="caption" color="text.secondary">
            試試調整搜尋條件
          </Typography>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <SearchIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography color="text.secondary">輸入關鍵字或使用篩選條件</Typography>
          <Typography variant="caption" color="text.secondary">
            點擊搜尋按鈕開始
          </Typography>
        </Box>
      )}
    </Box>
  );
}
