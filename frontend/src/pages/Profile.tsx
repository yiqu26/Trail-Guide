import { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import type { UpdateProfileData } from '../types';

export function Profile() {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Edit form state
  const [editForm, setEditForm] = useState<UpdateProfileData>({
    name: user?.name || '',
    gender: user?.gender,
    phoneNumber: user?.phoneNumber || '',
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleOpenEdit = () => {
    setEditForm({
      name: user?.name || '',
      gender: user?.gender,
      phoneNumber: user?.phoneNumber || '',
    });
    setShowEditDialog(true);
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await authService.updateProfile(editForm);
      await refreshUser();
      setShowEditDialog(false);
      setSnackbar({ open: true, message: '個人資料已更新', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: '更新失敗，請稍後再試', severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar
          src={user?.avatar}
          sx={{ width: 64, height: 64, bgcolor: 'white', color: 'primary.main' }}
        >
          {user?.name?.[0] || <PersonIcon />}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold">
            {user?.name || '用戶'}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {user?.email}
          </Typography>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: 'flex', gap: 2, p: 2 }}>
        <Card sx={{ flex: 1 }} onClick={() => navigate('/favorites')}>
          <CardContent sx={{ textAlign: 'center', py: 2, cursor: 'pointer' }}>
            <FavoriteIcon color="error" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h5" fontWeight="bold">
              {user?.stats?.favoritesCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              收藏步道
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ textAlign: 'center', py: 2 }}>
            <CommentIcon color="primary" sx={{ fontSize: 28, mb: 0.5 }} />
            <Typography variant="h5" fontWeight="bold">
              {user?.stats?.commentsCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              發表評論
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Menu */}
      <List>
        <ListItemButton onClick={handleOpenEdit}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="編輯個人資料" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate('/favorites')}>
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="我的收藏" />
        </ListItemButton>
        <Divider />
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="登出" sx={{ color: 'error.main' }} />
        </ListItemButton>
      </List>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>編輯個人資料</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="姓名"
              value={editForm.name || ''}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>性別</InputLabel>
              <Select
                value={editForm.gender === undefined ? 'none' : editForm.gender ? 'male' : 'female'}
                label="性別"
                onChange={(e) => {
                  const val = e.target.value as string;
                  setEditForm({
                    ...editForm,
                    gender: val === 'none' ? undefined : val === 'male'
                  });
                }}
              >
                <MenuItem value="none">不公開</MenuItem>
                <MenuItem value="female">女性</MenuItem>
                <MenuItem value="male">男性</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="手機號碼"
              value={editForm.phoneNumber || ''}
              onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>取消</Button>
          <Button variant="contained" onClick={handleSaveProfile} disabled={isLoading}>
            {isLoading ? '儲存中...' : '儲存'}
          </Button>
        </DialogActions>
      </Dialog>

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
