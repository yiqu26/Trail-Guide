import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Switch, Paper, Divider, IconButton } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Brightness6 as Brightness6Icon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';

export function Settings() {
  const navigate = useNavigate();
  const { mode, setMode, isDark } = useThemeMode();

  const handleThemeChange = () => {
    // 循环切换：light -> dark -> system -> light
    if (mode === 'light') {
      setMode('dark');
    } else if (mode === 'dark') {
      setMode('system');
    } else {
      setMode('light');
    }
  };

  const getThemeIcon = () => {
    if (mode === 'dark') return <DarkModeIcon />;
    if (mode === 'light') return <LightModeIcon />;
    return <Brightness6Icon />;
  };

  const getThemeText = () => {
    if (mode === 'dark') return '深色模式';
    if (mode === 'light') return '淺色模式';
    return '跟隨系統';
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: 10 }}>
      {/* 顶部栏 */}
      <Box
        sx={{
          bgcolor: 'background.paper',
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <IconButton onClick={() => navigate(-1)} edge="start">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>
          設定
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* 显示设置 */}
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ px: 2, py: 1, fontWeight: 600 }}
        >
          顯示
        </Typography>
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List disablePadding>
            <ListItem
              component="div"
              onClick={handleThemeChange}
              sx={{ cursor: 'pointer' }}
            >
              <ListItemIcon>{getThemeIcon()}</ListItemIcon>
              <ListItemText
                primary="外觀模式"
                secondary={getThemeText()}
              />
              <Switch
                checked={isDark}
                onChange={handleThemeChange}
                color="primary"
              />
            </ListItem>
          </List>
        </Paper>

        {/* 关于 */}
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ px: 2, py: 1, mt: 3, fontWeight: 600 }}
        >
          關於
        </Typography>
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List disablePadding>
            <ListItem>
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText
                primary="版本"
                secondary="1.0.0"
              />
            </ListItem>
            <Divider component="li" />
            <ListItem
              component="a"
              href="/privacy"
              sx={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon>
                <SecurityIcon />
              </ListItemIcon>
              <ListItemText primary="隱私政策" />
            </ListItem>
            <Divider component="li" />
            <ListItem
              component="a"
              href="/terms"
              sx={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="服務條款" />
            </ListItem>
          </List>
        </Paper>

        {/* 底部信息 */}
        <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
          <Typography variant="body2">
            Trail Guide 步道導覽
          </Typography>
          <Typography variant="caption">
            Made with React + ASP.NET Core
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Settings;
