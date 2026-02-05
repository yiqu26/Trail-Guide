import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert, Tab, Tabs, Divider } from '@mui/material';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface GoogleJwtPayload {
  sub: string;      // Google User ID
  email: string;
  name?: string;
  picture?: string;
}

export function Login() {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, register, socialLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google 登入失敗');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);

      await socialLogin({
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
        avatar: decoded.picture,
      });

      navigate('/');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google 登入失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google 登入失敗');
  };

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
    } catch {
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

      <Divider sx={{ my: 3 }}>或</Divider>

      {/* Google Login - use pill shape for modern look, centered */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          '& > div': { width: '100%' },
          '& iframe': { margin: '0 auto' },
        }}
      >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text={tab === 0 ? 'signin_with' : 'signup_with'}
          shape="pill"
          size="large"
          theme="outline"
        />
      </Box>

      <Button
        sx={{ mt: 3 }}
        onClick={() => navigate('/')}
      >
        返回首頁
      </Button>
    </Box>
  );
}
