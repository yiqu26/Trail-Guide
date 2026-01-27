import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BottomNav } from './components/BottomNav';
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

function AppRoutes() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trail/:id" element={<TrailDetail />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="/collection/:id" element={<Collection />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
      <BottomNav />
    </Box>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
