import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Fade,
  Grow,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import HikingIcon from '@mui/icons-material/Hiking';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import type { UpdateProfileData } from '../types';

// 統計卡片元件
function StatCard({
  icon,
  value,
  label,
  color,
  onClick,
  delay,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  onClick?: () => void;
  delay: number;
}) {
  return (
    <Grow in timeout={600} style={{ transitionDelay: `${delay}ms` }}>
      <Box
        onClick={onClick}
        sx={{
          flex: 1,
          textAlign: 'center',
          p: 2.5,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': onClick ? {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          } : {},
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: `${color}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 1,
          }}
        >
          {icon}
        </Box>
        <Typography variant="h4" fontWeight="bold" color={color}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Box>
    </Grow>
  );
}

// 可編輯欄位元件
function EditableField({
  label,
  value,
  isEditing,
  onChange,
  type = 'text',
  options,
}: {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: 'text' | 'select';
  options?: { value: string; label: string }[];
}) {
  if (!isEditing) {
    return (
      <Box sx={{ py: 1.5 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={500}>
          {value || '未設定'}
        </Typography>
      </Box>
    );
  }

  if (type === 'select' && options) {
    return (
      <FormControl fullWidth size="small" sx={{ my: 1 }}>
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={(e) => onChange(e.target.value)}
          sx={{ bgcolor: 'white' }}
        >
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ my: 1, '& .MuiOutlinedInput-root': { bgcolor: 'white' } }}
    />
  );
}

// 選單項目元件
function MenuItemRow({
  icon,
  label,
  onClick,
  color = 'inherit',
  showArrow = true,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color?: string;
  showArrow?: boolean;
}) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: 'grey.100',
        },
      }}
    >
      <Box sx={{ color }}>{icon}</Box>
      <Typography sx={{ flex: 1, color }}>{label}</Typography>
      {showArrow && <ChevronRightIcon sx={{ color: 'grey.400' }} />}
    </Box>
  );
}

export function Profile() {
  const { user, logout, refreshUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // 編輯表單狀態
  const [editForm, setEditForm] = useState<UpdateProfileData>({
    name: user?.name || '',
    gender: user?.gender,
    phoneNumber: user?.phoneNumber || '',
  });

  // 進入頁面時刷新用戶數據（包括統計）
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleStartEdit = () => {
    setEditForm({
      name: user?.name || '',
      gender: user?.gender,
      phoneNumber: user?.phoneNumber || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await authService.updateProfile(editForm);
      await refreshUser();
      setIsEditing(false);
      setSnackbar({ open: true, message: '個人資料已更新', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: '更新失敗，請稍後再試', severity: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: 實作頭像上傳
    setSnackbar({ open: true, message: '頭像上傳功能開發中', severity: 'info' as 'success' });
  };

  const genderDisplay = (gender: boolean | undefined | null) => {
    if (gender === undefined || gender === null) return '不公開';
    return gender ? '男性' : '女性';
  };

  const genderValue = (gender: boolean | undefined | null) => {
    if (gender === undefined || gender === null) return 'none';
    return gender ? 'male' : 'female';
  };

  // Loading 狀態
  if (authLoading) {
    return (
      <Box sx={{ pb: 10 }}>
        <Box sx={{ height: 280, background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)' }} />
        <Box sx={{ p: 2 }}>
          <Skeleton variant="circular" width={100} height={100} sx={{ mx: 'auto', mt: -8 }} />
          <Skeleton variant="text" width={120} height={32} sx={{ mx: 'auto', mt: 2 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10, minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* 頂部漸層背景 */}
      <Box
        sx={{
          position: 'relative',
          height: 200,
          background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 50%, #81C784 100%)',
          overflow: 'hidden',
        }}
      >
        {/* 裝飾圓形 */}
        <Box
          sx={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.1)',
            top: -50,
            right: -30,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 120,
            height: 120,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.08)',
            bottom: 20,
            left: -40,
          }}
        />

        {/* 頁面標題 */}
        <Fade in timeout={600}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              color: 'white',
              position: 'absolute',
              top: 20,
              left: 20,
            }}
          >
            個人檔案
          </Typography>
        </Fade>
      </Box>

      {/* 頭像區塊 */}
      <Box sx={{ px: 3, mt: -10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user?.avatar}
              onClick={handleAvatarClick}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                fontSize: 48,
                bgcolor: 'primary.main',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              {user?.name?.[0] || <HikingIcon sx={{ fontSize: 48 }} />}
            </Avatar>
            <IconButton
              onClick={handleAvatarClick}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                '&:hover': { bgcolor: 'grey.100' },
              }}
              size="small"
            >
              <CameraAltIcon fontSize="small" />
            </IconButton>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleAvatarChange}
            />
          </Box>
        </Box>

        {/* 用戶名稱 */}
        <Fade in timeout={800}>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="h5" fontWeight="bold">
              {user?.name || '用戶'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* 統計卡片 */}
      <Box sx={{ display: 'flex', gap: 2, px: 3, mt: 3 }}>
        <StatCard
          icon={<FavoriteIcon sx={{ color: '#E53935', fontSize: 24 }} />}
          value={user?.stats?.favoritesCount || 0}
          label="收藏步道"
          color="#E53935"
          onClick={() => navigate('/favorites')}
          delay={100}
        />
        <StatCard
          icon={<CommentIcon sx={{ color: '#1976D2', fontSize: 24 }} />}
          value={user?.stats?.commentsCount || 0}
          label="發表評論"
          color="#1976D2"
          delay={200}
        />
      </Box>

      {/* 個人資料卡片 */}
      <Fade in timeout={1000}>
        <Box
          sx={{
            mx: 3,
            mt: 3,
            p: 3,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              個人資料
            </Typography>
            {!isEditing ? (
              <IconButton onClick={handleStartEdit} size="small">
                <EditIcon fontSize="small" />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handleCancelEdit}
                  size="small"
                  sx={{ color: 'grey.500' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <IconButton
                  onClick={handleSaveProfile}
                  size="small"
                  disabled={isSaving}
                  sx={{ color: 'primary.main' }}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          <EditableField
            label="姓名"
            value={isEditing ? (editForm.name || '') : (user?.name || '')}
            isEditing={isEditing}
            onChange={(v) => setEditForm({ ...editForm, name: v })}
          />

          <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />

          <EditableField
            label="性別"
            value={isEditing ? genderValue(editForm.gender) : genderDisplay(user?.gender)}
            isEditing={isEditing}
            onChange={(v) => setEditForm({
              ...editForm,
              gender: v === 'none' ? undefined : v === 'male'
            })}
            type="select"
            options={[
              { value: 'none', label: '不公開' },
              { value: 'female', label: '女性' },
              { value: 'male', label: '男性' },
            ]}
          />

          <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }} />

          <EditableField
            label="手機號碼"
            value={isEditing ? (editForm.phoneNumber || '') : (user?.phoneNumber || '')}
            isEditing={isEditing}
            onChange={(v) => setEditForm({ ...editForm, phoneNumber: v })}
          />
        </Box>
      </Fade>

      {/* 選單 */}
      <Fade in timeout={1200}>
        <Box
          sx={{
            mx: 3,
            mt: 3,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <MenuItemRow
            icon={<FavoriteIcon />}
            label="我的收藏"
            onClick={() => navigate('/favorites')}
          />
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mx: 2 }} />
          <MenuItemRow
            icon={<LogoutIcon sx={{ color: 'error.main' }} />}
            label="登出"
            onClick={handleLogout}
            color="error.main"
            showArrow={false}
          />
        </Box>
      </Fade>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
