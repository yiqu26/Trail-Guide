import { useRegisterSW } from 'virtual:pwa-register/react';
import { Snackbar, Button, Alert } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

export default function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setNeedRefresh(false);
  };

  return (
    <Snackbar
      open={needRefresh}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{ bottom: { xs: 70, sm: 24 } }} // 避免遮住底部導航
    >
      <Alert
        severity="info"
        action={
          <>
            <Button
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              稍後
            </Button>
            <Button
              color="inherit"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleUpdate}
              sx={{ fontWeight: 'bold' }}
            >
              更新
            </Button>
          </>
        }
        sx={{ width: '100%' }}
      >
        發現新版本！
      </Alert>
    </Snackbar>
  );
}
