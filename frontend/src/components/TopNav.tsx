import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, InputBase, Button, Avatar,
  IconButton, Menu, MenuItem, Chip, Divider,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HikingIcon from '@mui/icons-material/Hiking';
import { useAuth } from '../contexts/AuthContext';

export function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const navLinks = [
    { label: '探索步道', path: '/search' },
    { label: '附近步道', path: '/nearby' },
    { label: '口袋名單', path: '/favorites' },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        display: { xs: 'none', md: 'flex' },
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 2, px: { md: 3, lg: 4 }, minHeight: { md: 64 } }}>
        {/* Logo */}
        <Box
          onClick={() => navigate('/')}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            cursor: 'pointer', flexShrink: 0,
            '&:hover': { opacity: 0.8 },
          }}
        >
          <HikingIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Box sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'text.primary', letterSpacing: '-0.3px' }}>
            Trail Guide
          </Box>
        </Box>

        {/* Search bar */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flex: 1, maxWidth: 480,
            display: 'flex', alignItems: 'center',
            bgcolor: 'action.hover',
            borderRadius: 3,
            px: 2, py: 0.5,
            border: '1px solid transparent',
            '&:focus-within': {
              borderColor: 'primary.main',
              bgcolor: 'background.paper',
            },
            transition: 'all 0.2s',
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', fontSize: 20, mr: 1 }} />
          <InputBase
            placeholder="搜尋步道、縣市、難度..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, fontSize: '0.9rem' }}
          />
        </Box>

        {/* Nav links */}
        <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
          {navLinks.map((link) => (
            <Button
              key={link.path}
              onClick={() => navigate(link.path)}
              sx={{
                color: location.pathname === link.path ? 'primary.main' : 'text.secondary',
                fontWeight: location.pathname === link.path ? 600 : 400,
                fontSize: '0.875rem',
                borderRadius: 2,
                px: 1.5,
                '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
              }}
            >
              {link.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* User */}
        {isAuthenticated ? (
          <>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ p: 0.5 }}>
              <Avatar
                src={user?.avatarUrl}
                sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem' }}
              >
                {user?.username?.[0]?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              PaperProps={{ sx: { mt: 1, minWidth: 160, borderRadius: 2 } }}
            >
              <MenuItem onClick={() => { navigate('/profile'); setAnchorEl(null); }}>個人資料</MenuItem>
              <MenuItem onClick={() => { navigate('/my-visited'); setAnchorEl(null); }}>已去過</MenuItem>
              <MenuItem onClick={() => { navigate('/my-comments'); setAnchorEl(null); }}>我的評論</MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); setAnchorEl(null); }}>設定</MenuItem>
              <Divider />
              <MenuItem onClick={() => { logout(); setAnchorEl(null); }} sx={{ color: 'error.main' }}>登出</MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              onClick={() => navigate('/login')}
              variant="outlined"
              size="small"
              sx={{ borderRadius: 2, fontSize: '0.875rem' }}
            >
              登入
            </Button>
            <Button
              onClick={() => navigate('/login')}
              variant="contained"
              size="small"
              sx={{ borderRadius: 2, fontSize: '0.875rem' }}
            >
              註冊
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
