import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, keyframes } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import NearMeIcon from '@mui/icons-material/NearMe';

const pop = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.2); }
  70% { transform: scale(0.93); }
  100% { transform: scale(1); }
`;

const navItems = [
  { label: '首頁', icon: <HomeIcon />, path: '/' },
  { label: '搜尋', icon: <SearchIcon />, path: '/search' },
  { label: '附近', icon: <NearMeIcon />, path: '/nearby' },
  { label: '收藏', icon: <FavoriteIcon />, path: '/favorites' },
  { label: '我的', icon: <PersonIcon />, path: '/profile' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = navItems.findIndex((item) => item.path === location.pathname);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: { xs: 0, md: '50%' },
        right: { xs: 0, md: 'auto' },
        transform: { xs: 'none', md: 'translateX(-50%)' },
        width: { xs: '100%', md: 430 },
        zIndex: 1000,
        px: 2,
        pb: 'max(env(safe-area-inset-bottom), 10px)',
        pt: 0,
        pointerEvents: 'none',
      }}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(10,22,14,0.92)'
              : 'rgba(254,252,248,0.92)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderRadius: 4,
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.07)'
              : 'rgba(26,51,38,0.08)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04) inset'
              : '0 8px 32px rgba(26,51,38,0.14), 0 1px 0 rgba(255,255,255,0.9) inset',
          display: 'flex',
          height: 60,
          pointerEvents: 'auto',
        }}
      >
        {navItems.map((item, i) => {
          const active = currentIndex === i;
          return (
            <Box
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.3,
                cursor: 'pointer',
                borderRadius: 3,
                mx: 0.4,
                my: 0.5,
                bgcolor: active
                  ? (theme) =>
                      theme.palette.mode === 'dark'
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(27,67,50,0.08)'
                  : 'transparent',
                color: active ? 'primary.main' : 'text.secondary',
                transition: 'background-color 0.2s ease, color 0.2s ease',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <Box
                sx={{
                  animation: active ? `${pop} 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)` : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {React.cloneElement(item.icon as React.ReactElement<{ sx?: object }>, {
                  sx: { fontSize: active ? 22 : 20, transition: 'font-size 0.2s ease' },
                })}
              </Box>
              <Typography
                sx={{
                  fontSize: '0.58rem',
                  fontWeight: active ? 700 : 400,
                  lineHeight: 1,
                  letterSpacing: active ? '0.02em' : 0,
                  transition: 'font-weight 0.2s ease',
                }}
              >
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
