import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, GlobalStyles } from '@mui/material';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const serif = '"Noto Serif TC", Georgia, serif';
const sans = '"DM Sans", "Noto Sans TC", system-ui, sans-serif';

const getTheme = (isDark: boolean) =>
  createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: isDark ? '#40916C' : '#1B4332',
        light: isDark ? '#74C69E' : '#52796F',
        dark: isDark ? '#2D6A4F' : '#0D2818',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#C8872A',
        light: '#E0A85A',
        dark: '#9A6118',
        contrastText: '#ffffff',
      },
      error: { main: '#C62828' },
      warning: { main: '#C8872A' },
      success: { main: '#2E7D32' },
      background: isDark
        ? { default: '#0A1410', paper: '#132219' }
        : { default: '#F5F2ED', paper: '#FEFCF8' },
      text: isDark
        ? { primary: '#EAE6DF', secondary: '#9CAF9A' }
        : { primary: '#1A2A1C', secondary: '#5A7060' },
      divider: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: sans,
      h1: { fontFamily: serif, fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontFamily: serif, fontWeight: 700, letterSpacing: '-0.015em' },
      h3: { fontFamily: serif, fontWeight: 600, letterSpacing: '-0.01em' },
      h4: { fontFamily: serif, fontWeight: 600, letterSpacing: '-0.01em' },
      h5: { fontFamily: serif, fontWeight: 600, letterSpacing: '-0.005em' },
      h6: { fontFamily: sans, fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 600 },
      button: { fontFamily: sans, fontWeight: 500, letterSpacing: '0.01em' },
      overline: { fontFamily: sans, fontWeight: 700, letterSpacing: '0.15em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          '*, *::before, *::after': { boxSizing: 'border-box' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDark
              ? '0 2px 12px rgba(0,0,0,0.4)'
              : '0 2px 12px rgba(26,42,28,0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: 12 },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 16px rgba(0,0,0,0.4)'
                : '0 4px 16px rgba(27,67,50,0.25)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 6, fontWeight: 500 },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 16 },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { borderRadius: 8 },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': { borderRadius: 10 },
          },
        },
      },
    },
  });

const globalStyles = (isDark: boolean) => ({
  'html': { scrollBehavior: 'smooth' },
  '::-webkit-scrollbar': { width: '5px', height: '5px' },
  '::-webkit-scrollbar-track': { background: 'transparent' },
  '::-webkit-scrollbar-thumb': {
    background: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(27,67,50,0.2)',
    borderRadius: '4px',
  },
  '::-webkit-scrollbar-thumb:hover': {
    background: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(27,67,50,0.35)',
  },
});

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'system';
  });

  const isDark = useMemo(() => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return mode === 'dark';
  }, [mode]);

  useEffect(() => {
    if (mode !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handle = () => setModeState('system');
    mq.addEventListener('change', handle);
    return () => mq.removeEventListener('change', handle);
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const theme = useMemo(() => getTheme(isDark), [isDark]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark }}>
      <MuiThemeProvider theme={theme}>
        <GlobalStyles styles={globalStyles(isDark)} />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useThemeMode must be used within ThemeContextProvider');
  return context;
}
