import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import NearMeIcon from '@mui/icons-material/NearMe';

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
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}
      elevation={3}
    >
      <BottomNavigation
        value={currentIndex}
        onChange={(_, newValue) => {
          navigate(navItems[newValue].path);
        }}
        showLabels
        sx={{
          height: 64,
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
          },
          '& .Mui-selected': {
            color: 'primary.main',
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
