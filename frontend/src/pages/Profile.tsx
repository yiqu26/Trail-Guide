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
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import CommentIcon from '@mui/icons-material/Comment';
import HikingIcon from '@mui/icons-material/Hiking';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { visitedService } from '../services/visited';
import { uploadImage } from '../services/cloudinary';
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
          bgcolor: 'background.paper',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 12px rgba(27,67,50,0.08)',
        border: '1px solid',
        borderColor: 'divider',
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
          sx={{ bgcolor: 'background.paper' }}
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
      sx={{ my: 1, '& .MuiOutlinedInput-root': { bgcolor: 'background.paper' } }}
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
          bgcolor: 'action.hover',
        },
      }}
    >
      <Box sx={{ color, display: 'flex', alignItems: 'center' }}>{icon}</Box>
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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
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

  // 已去過統計
  const [visitedCount, setVisitedCount] = useState<number>(0);

  // 進入頁面時刷新用戶數據（包括統計）
  useEffect(() => {
    refreshUser();
    // 獲取已去過統計
    visitedService.getStats().then(stats => setVisitedCount(stats.totalCount)).catch(console.error);
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

    // 驗證格式
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setSnackbar({ open: true, message: '請選擇 JPG、PNG、GIF 或 WebP 格式的圖片', severity: 'error' });
      return;
    }

    // 驗證大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: '圖片大小不能超過 5MB', severity: 'error' });
      return;
    }

    try {
      setIsUploadingAvatar(true);

      // 上傳到 Cloudinary
      const result = await uploadImage(file, 'avatars');

      // 更新用戶資料
      await authService.updateProfile({ avatar: result.secure_url });

      // 刷新用戶資料
      await refreshUser();

      setSnackbar({ open: true, message: '頭像更新成功', severity: 'success' });
    } catch (error) {
      console.error('Avatar upload failed:', error);
      setSnackbar({ open: true, message: '頭像上傳失敗，請稍後再試', severity: 'error' });
    } finally {
      setIsUploadingAvatar(false);
      // 清空 input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
    <Box sx={{ pb: 10, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 頂部背景 */}
      <Box
        sx={{
          position: 'relative',
          height: 190,
          background: (theme) => theme.palette.mode === 'dark'
            ? 'linear-gradient(160deg, #0D2818 0%, #1B4332 60%, #0A1410 100%)'
            : 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 60%, #52796F 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Topographic decorative lines */}
        <Box
          sx={{
            position: 'absolute', inset: 0,
            backgroundImage: `repeating-linear-gradient(
              100deg,
              transparent,
              transparent 40px,
              rgba(255,255,255,0.04) 40px,
              rgba(255,255,255,0.04) 41px
            )`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 220, height: 220, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.06)',
            top: -80, right: -60,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 140, height: 140, borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.05)',
            bottom: -40, left: -40,
          }}
        />
        <Fade in timeout={600}>
          <Box sx={{ position: 'absolute', top: 20, left: 20 }}>
            <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', mb: 0.5 }}>
              Trail Guide
            </Typography>
            <Typography variant="h5" sx={{ color: 'white', fontFamily: '"Noto Serif TC", serif' }}>
              個人檔案
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* 頭像區塊 */}
      <Box sx={{ px: 3, mt: -10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user?.avatar}
              onClick={isUploadingAvatar ? undefined : handleAvatarClick}
              sx={{
                width: 120,
                height: 120,
                border: '4px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                cursor: isUploadingAvatar ? 'default' : 'pointer',
                fontSize: 48,
                bgcolor: 'primary.main',
                transition: 'transform 0.3s',
                opacity: isUploadingAvatar ? 0.7 : 1,
                '&:hover': isUploadingAvatar ? {} : {
                  transform: 'scale(1.05)',
                },
              }}
            >
              {user?.name?.[0] || <HikingIcon sx={{ fontSize: 48 }} />}
            </Avatar>
            {isUploadingAvatar && (
              <CircularProgress
                size={40}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-20px',
                  marginLeft: '-20px',
                  color: 'white',
                }}
              />
            )}
            <IconButton
              onClick={handleAvatarClick}
              disabled={isUploadingAvatar}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: 'background.paper',
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
              accept="image/jpeg,image/png,image/gif,image/webp"
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
          icon={<CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 24 }} />}
          value={visitedCount}
          label="已去過"
          color="#2E7D32"
          onClick={() => navigate('/my-visited')}
          delay={100}
        />
        <StatCard
          icon={<BookmarkIcon sx={{ color: '#FF8F00', fontSize: 24 }} />}
          value={user?.stats?.favoritesCount || 0}
          label="想去"
          color="#FF8F00"
          onClick={() => navigate('/favorites')}
          delay={200}
        />
        <StatCard
          icon={<CommentIcon sx={{ color: '#1976D2', fontSize: 24 }} />}
          value={user?.stats?.commentsCount || 0}
          label="評論"
          color="#1976D2"
          onClick={() => navigate('/my-comments')}
          delay={300}
        />
      </Box>

      {/* 個人資料卡片 */}
      <Fade in timeout={1000}>
        <Box
          sx={{
            mx: 3,
            mt: 3,
            p: 3,
            bgcolor: 'background.paper',
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
            bgcolor: 'background.paper',
            borderRadius: 3,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}
        >
          <MenuItemRow
            icon={<CheckCircleIcon sx={{ color: 'success.main' }} />}
            label="已去過的步道"
            onClick={() => navigate('/my-visited')}
          />
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mx: 2 }} />
          <MenuItemRow
            icon={<BookmarkIcon sx={{ color: 'warning.main' }} />}
            label="口袋名單"
            onClick={() => navigate('/favorites')}
          />
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mx: 2 }} />
          <MenuItemRow
            icon={<CommentIcon sx={{ color: 'primary.light' }} />}
            label="我的評論"
            onClick={() => navigate('/my-comments')}
          />
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mx: 2 }} />
          <MenuItemRow
            icon={<SettingsIcon sx={{ color: 'text.secondary' }} />}
            label="設定"
            onClick={() => navigate('/settings')}
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
