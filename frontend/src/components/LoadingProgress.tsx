import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { GlobalStyles } from '@mui/material';

// 配置 NProgress
NProgress.configure({
  showSpinner: false,
  speed: 300,
  minimum: 0.1,
  trickleSpeed: 100,
});

// 自定義樣式 - 使用主題綠色
const progressStyles = (
  <GlobalStyles
    styles={{
      '#nprogress': {
        pointerEvents: 'none',
      },
      '#nprogress .bar': {
        background: 'linear-gradient(90deg, #2E7D32, #4CAF50)',
        position: 'fixed',
        zIndex: 9999,
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
      },
      '#nprogress .peg': {
        display: 'block',
        position: 'absolute',
        right: '0px',
        width: '100px',
        height: '100%',
        boxShadow: '0 0 10px #4CAF50, 0 0 5px #4CAF50',
        opacity: 1,
        transform: 'rotate(3deg) translate(0px, -4px)',
      },
    }}
  />
);

// 路由變化時顯示進度條
export function LoadingProgress() {
  const location = useLocation();

  useEffect(() => {
    NProgress.done();
  }, [location]);

  return progressStyles;
}

// 手動控制進度條 (用於 Suspense lazy loading)
export function startProgress() {
  NProgress.start();
}

export function stopProgress() {
  NProgress.done();
}

// Suspense 專用的 Fallback 組件
export function SuspenseFallback({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    NProgress.start();
    return () => {
      NProgress.done();
    };
  }, []);

  return <>{children}</>;
}

export default LoadingProgress;
