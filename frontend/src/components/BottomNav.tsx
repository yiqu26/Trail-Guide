import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Box, keyframes } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import NearMeIcon from '@mui/icons-material/NearMe';

const bounce = keyframes`
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.15) translateY(-2px); }
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

  const currentIndex = navItems.findIndex(
    (item) => item.path === location.pathname
  );

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      }}
      elevation={8}
    >
      {/* Active indicator line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: `${(currentIndex / navItems.length) * 100 + 100 / navItems.length / 2 - 3}%`,
          width: '6%',
          height: 3,
          bgcolor: 'primary.main',
          borderRadius: '0 0 4px 4px',
          transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      />
      <BottomNavigation
        value={currentIndex}
        onChange={(_, newValue) => {
          navigate(navItems[newValue].path);
        }}
        showLabels
        sx={{
          height: 64,
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
            transition: 'all 0.2s ease',
            '&:active': {
              transform: 'scale(0.95)',
            },
          },
          '& .Mui-selected': {
            color: 'primary.main',
            '& .MuiSvgIcon-root': {
              animation: `${bounce} 0.4s ease-out`,
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.7rem',
            '&.Mui-selected': {
              fontSize: '0.75rem',
              fontWeight: 600,
            },
          },
        }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
