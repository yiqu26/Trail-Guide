import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// 統一的設計規範
const designTokens = {
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 24,
  },
  shadows: {
    card: {
      light: '0 2px 8px rgba(0,0,0,0.08)',
      dark: '0 2px 8px rgba(0,0,0,0.3)',
    },
    cardHover: {
      light: '0 8px 24px rgba(0,0,0,0.12)',
      dark: '0 8px 24px rgba(0,0,0,0.4)',
    },
    fab: {
      light: '0 4px 12px rgba(0,0,0,0.15)',
      dark: '0 4px 12px rgba(0,0,0,0.4)',
    },
  },
};

// 基础主题配置
const getTheme = (isDark: boolean) =>
  createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#2e7d32',
        light: '#4caf50',
        dark: '#1b5e20',
      },
      secondary: {
        main: '#ff9800',
        light: '#ffb74d',
        dark: '#f57c00',
      },
      error: {
        main: '#f44336',
      },
      warning: {
        main: '#ff9800',
      },
      success: {
        main: '#4caf50',
      },
      background: isDark
        ? {
            default: '#121212',
            paper: '#1e1e1e',
          }
        : {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
    },
    shape: {
      borderRadius: designTokens.borderRadius.medium,
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
            borderRadius: designTokens.borderRadius.medium,
            boxShadow: isDark
              ? designTokens.shadows.card.dark
              : designTokens.shadows.card.light,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: designTokens.borderRadius.medium,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.small,
            textTransform: 'none',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: isDark
                ? '0 4px 12px rgba(0,0,0,0.3)'
                : '0 4px 12px rgba(46, 125, 50, 0.3)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.small,
          },
        },
      },
      MuiFab: {
        styleOverrides: {
          root: {
            boxShadow: isDark
              ? designTokens.shadows.fab.dark
              : designTokens.shadows.fab.light,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: designTokens.borderRadius.large,
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: designTokens.borderRadius.small,
          },
        },
      },
    },
  });

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'system';
  });

  // 计算实际是否为暗黑模式
  const isDark = useMemo(() => {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return mode === 'dark';
  }, [mode]);

  // 监听系统主题变化
  useEffect(() => {
    if (mode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // 强制重新渲染
      setModeState('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  const theme = useMemo(() => getTheme(isDark), [isDark]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, isDark }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeContextProvider');
  }
  return context;
}
