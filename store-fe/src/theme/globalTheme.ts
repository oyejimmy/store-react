import { createTheme } from '@mui/material/styles';

// Global brand colors
export const brandColors = {
  primary: '#2c6e49',      // Green
  secondary: '#6E2C51',    // Purple/Burgundy
  background: '#ffffff',   // White background
  backgroundDark: '#1a1a1a', // Dark background
  text: '#000000',         // Black text
  textLight: '#ffffff',    // White text for dark backgrounds
};

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.primary,
      light: '#4a8b6a',
      dark: '#1e4d33',
      contrastText: brandColors.textLight,
    },
    secondary: {
      main: brandColors.secondary,
      light: '#8b4a73',
      dark: '#4d1e38',
      contrastText: brandColors.textLight,
    },
    background: {
      default: brandColors.background,
      paper: brandColors.background,
    },
    text: {
      primary: brandColors.text,
      secondary: '#333333',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: brandColors.textLight,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: brandColors.primary,
      light: '#4a8b6a',
      dark: '#1e4d33',
      contrastText: brandColors.textLight,
    },
    secondary: {
      main: brandColors.secondary,
      light: '#8b4a73',
      dark: '#4d1e38',
      contrastText: brandColors.textLight,
    },
    background: {
      default: brandColors.backgroundDark,
      paper: '#2d2d2d',
    },
    text: {
      primary: brandColors.textLight,
      secondary: '#cccccc',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: brandColors.textLight,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        },
      },
    },
  },
});

// Global theme for the entire application (keeping for backward compatibility)
export const globalTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: brandColors.primary,
      light: '#4a8b6a',
      dark: '#1e4d33',
      contrastText: brandColors.textLight,
    },
    secondary: {
      main: brandColors.secondary,
      light: '#8b4a73',
      dark: '#4d1e38',
      contrastText: brandColors.textLight,
    },
    background: {
      default: brandColors.background,
      paper: brandColors.background,
    },
    text: {
      primary: brandColors.text,
      secondary: '#333333',
    },
    error: {
      main: '#d32f2f',
      contrastText: brandColors.textLight,
    },
    warning: {
      main: '#ff9800',
      contrastText: brandColors.text,
    },
    info: {
      main: brandColors.primary,
      contrastText: brandColors.textLight,
    },
    success: {
      main: brandColors.primary,
      contrastText: brandColors.textLight,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      color: brandColors.text,
      fontWeight: 700,
    },
    h2: {
      color: brandColors.text,
      fontWeight: 600,
    },
    h3: {
      color: brandColors.text,
      fontWeight: 600,
    },
    h4: {
      color: brandColors.text,
      fontWeight: 600,
    },
    h5: {
      color: brandColors.text,
      fontWeight: 500,
    },
    h6: {
      color: brandColors.text,
      fontWeight: 500,
    },
    body1: {
      color: brandColors.text,
    },
    body2: {
      color: brandColors.text,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        },
        contained: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
          '&:hover': {
            backgroundColor: '#1e4d33',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(44, 110, 73, 0.3)',
          },
        },
        outlined: {
          borderColor: brandColors.primary,
          color: brandColors.primary,
          '&:hover': {
            borderColor: '#1e4d33',
            backgroundColor: 'rgba(44, 110, 73, 0.04)',
          },
        },
        text: {
          color: brandColors.primary,
          '&:hover': {
            backgroundColor: 'rgba(44, 110, 73, 0.04)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.background,
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(44, 110, 73, 0.1)',
          border: '1px solid rgba(44, 110, 73, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.primary,
          '& .MuiTableCell-head': {
            backgroundColor: brandColors.primary,
            color: brandColors.textLight,
            fontWeight: 600,
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(44, 110, 73, 0.04)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          color: brandColors.text,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },
        colorPrimary: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
        },
        colorSecondary: {
          backgroundColor: brandColors.secondary,
          color: brandColors.textLight,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.primary,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: brandColors.primary,
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: brandColors.primary,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: brandColors.primary,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: brandColors.primary,
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root.Mui-focused': {
            color: brandColors.primary,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
          '&:hover': {
            backgroundColor: '#1e4d33',
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: brandColors.background,
          border: `1px solid ${brandColors.primary}`,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
          fontWeight: 600,
          textAlign: 'center',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiAlert-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

export default globalTheme;
