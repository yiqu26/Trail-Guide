import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Switch, Paper, Divider, IconButton } from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Brightness6 as Brightness6Icon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '../contexts/ThemeContext';

export function Settings() {
  const navigate = useNavigate();
  const { mode, setMode, isDark } = useThemeMode();

  const handleThemeChange = () => {
    if (mode === 'light') setMode('dark');
    else if (mode === 'dark') setMode('system');
    else setMode('light');
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
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ height: 3, bgcolor: 'secondary.main' }} />
        <Box sx={{ px: 2, pt: 2, pb: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => navigate(-1)} size="small" edge="start">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>設定</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        {/* 顯示設定 */}
        <Typography
          variant="overline"
          sx={{ px: 1, display: 'block', mb: 1, color: 'text.secondary' }}
        >
          顯示
        </Typography>
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <List disablePadding>
            <ListItem component="div" onClick={handleThemeChange} sx={{ cursor: 'pointer' }}>
              <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                {getThemeIcon()}
              </ListItemIcon>
              <ListItemText
                primary="外觀模式"
                secondary={getThemeText()}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
              <Switch checked={isDark} onChange={handleThemeChange} color="primary" size="small" />
            </ListItem>
          </List>
        </Paper>

        {/* 關於 */}
        <Typography
          variant="overline"
          sx={{ px: 1, display: 'block', mt: 3, mb: 1, color: 'text.secondary' }}
        >
          關於
        </Typography>
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}>
          <List disablePadding>
            <ListItem>
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                <InfoIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="版本"
                secondary="1.0.0"
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItem>
            <Divider component="li" />
            <ListItem
              component="a"
              href="/privacy"
              sx={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                <SecurityIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="隱私政策" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItem>
            <Divider component="li" />
            <ListItem
              component="a"
              href="/terms"
              sx={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
            >
              <ListItemIcon sx={{ color: 'text.secondary', minWidth: 40 }}>
                <DescriptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="服務條款" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItem>
          </List>
        </Paper>

        {/* 署名 */}
        <Box sx={{ textAlign: 'center', mt: 6, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, justifyContent: 'center', mb: 1.5 }}>
            <Box sx={{ height: '1px', width: 32, bgcolor: 'divider' }} />
            <Typography sx={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'text.secondary', textTransform: 'uppercase' }}>
              Trail Guide
            </Typography>
            <Box sx={{ height: '1px', width: 32, bgcolor: 'divider' }} />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            台灣步道資訊平台
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, opacity: 0.6 }}>
            React 19 · ASP.NET Core 8 · PostgreSQL
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Settings;
