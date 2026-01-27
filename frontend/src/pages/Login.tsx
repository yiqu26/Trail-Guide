import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Tab, Tabs } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (tab === 0) {
        await login(email, password);
      } else {
        await register(email, password, name);
      }
      navigate('/');
    } catch (err) {
      setError(tab === 0 ? '登入失敗，請檢查帳號密碼' : '註冊失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        bgcolor: 'background.default',
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, mt: 4 }}>
        Trail Guide
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        探索台灣最美步道
      </Typography>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="登入" />
        <Tab label="註冊" />
      </Tabs>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        {tab === 1 && (
          <TextField
            fullWidth
            label="姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
        )}
        <TextField
          fullWidth
          label="電子郵件"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="密碼"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          sx={{ mb: 3 }}
        />
        <Button
          fullWidth
          variant="contained"
          type="submit"
          disabled={isLoading}
          sx={{ py: 1.5 }}
        >
          {isLoading ? '處理中...' : tab === 0 ? '登入' : '註冊'}
        </Button>
      </Box>

      <Button
        sx={{ mt: 2 }}
        onClick={() => navigate('/')}
      >
        返回首頁
      </Button>
    </Box>
  );
}
