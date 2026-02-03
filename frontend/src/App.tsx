import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BottomNav } from './components/BottomNav';
import { PageTransition } from './components/PageTransition';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import { Home } from './pages/Home';

// Lazy load pages
import { Suspense, lazy } from 'react';
const Search = lazy(() => import('./pages/Search').then((m) => ({ default: m.Search })));
const TrailDetail = lazy(() => import('./pages/TrailDetail').then((m) => ({ default: m.TrailDetail })));
const Nearby = lazy(() => import('./pages/Nearby').then((m) => ({ default: m.Nearby })));
const Favorites = lazy(() => import('./pages/Favorites').then((m) => ({ default: m.Favorites })));
const Profile = lazy(() => import('./pages/Profile').then((m) => ({ default: m.Profile })));
const Login = lazy(() => import('./pages/Login').then((m) => ({ default: m.Login })));
const Collection = lazy(() => import('./pages/Collection').then((m) => ({ default: m.Collection })));
const DesignDemo = lazy(() => import('./pages/DesignDemo').then((m) => ({ default: m.DesignDemo })));
const MyCheckins = lazy(() => import('./pages/MyCheckins').then((m) => ({ default: m.MyCheckins })));
const Achievements = lazy(() => import('./pages/Achievements').then((m) => ({ default: m.Achievements })));

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // 綠色主題，呼應大自然
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Noto Sans TC"',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function LoadingFallback() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      載入中...
    </Box>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/search" element={<PageTransition><Search /></PageTransition>} />
        <Route path="/trail/:id" element={<PageTransition><TrailDetail /></PageTransition>} />
        <Route path="/nearby" element={<PageTransition><Nearby /></PageTransition>} />
        <Route path="/collection/:id" element={<PageTransition><Collection /></PageTransition>} />
        <Route path="/design-demo" element={<PageTransition><DesignDemo /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <PageTransition><Favorites /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition><Profile /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-checkins"
          element={
            <ProtectedRoute>
              <PageTransition><MyCheckins /></PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <PageTransition><Achievements /></PageTransition>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Suspense fallback={<LoadingFallback />}>
        <AnimatedRoutes />
      </Suspense>
      <BottomNav />
    </Box>
  );
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
          <PWAUpdatePrompt />
        </ThemeProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
