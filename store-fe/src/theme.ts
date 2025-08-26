import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#d4af37',
      dark: '#b8860b',
      light: '#ffd700',
    },
    secondary: {
      main: '#333333',
      light: '#666666',
      dark: '#000000',
    },
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(135deg, #d4af37, #b8860b)',
          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #b8860b, #996f0a)',
            boxShadow: '0 6px 16px rgba(212, 175, 55, 0.4)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#d4af37',
      dark: '#b8860b',
      light: '#ffd700',
    },
    secondary: {
      main: '#e0e0e0',
      light: '#ffffff',
      dark: '#bdbdbd',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#e0e0e0',
      secondary: '#bdbdbd',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.5px',
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(135deg, #d4af37, #ffd700)',
          color: '#000',
          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ffd700, #ffed4e)',
            boxShadow: '0 6px 16px rgba(212, 175, 55, 0.5)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(26, 26, 26, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
        },
      },
    },
  },
});