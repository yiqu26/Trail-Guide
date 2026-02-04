import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AnimatePresence } from 'motion/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import { BottomNav } from './components/BottomNav';
import { PageTransition } from './components/PageTransition';
import PWAUpdatePrompt from './components/PWAUpdatePrompt';
import { LoadingProgress, SuspenseFallback } from './components/LoadingProgress';
import { PageSkeleton } from './components/Skeletons';
import { ScrollToTop } from './components/ScrollToTop';
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
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));

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
    <SuspenseFallback>
      <PageSkeleton />
    </SuspenseFallback>
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
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageTransition><Settings /></PageTransition>
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
      <LoadingProgress />
      <Suspense fallback={<LoadingFallback />}>
        <AnimatedRoutes />
      </Suspense>
      <ScrollToTop />
      <BottomNav />
    </Box>
  );
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <CssBaseline />
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
          <PWAUpdatePrompt />
        </ThemeContextProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
