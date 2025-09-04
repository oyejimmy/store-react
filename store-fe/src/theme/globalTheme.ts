// globalTheme.ts
import { createTheme, PaletteColorOptions, PaletteColor } from "@mui/material/styles";
import { keyframes } from '@emotion/react';

// Define the core color variables for the brand
export const brandColors = {
  primary: "#1E1B4B", // Deep navy blue
  secondary: "#94A3B8", // Silver
  background: "#F8FAFC", // Off-white
  backgroundDark: "#1E1B4B", // Deep navy blue background for the dark theme
  text: "#1E1B4B", // Default text color, deep navy
  textLight: "#FFFFFF", // White text for dark backgrounds or primary buttons
};

// Keyframe animation for background
export const backgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Extend the palette to include other standard colors for better type safety
declare module "@mui/material/styles" {
  interface Palette {
    info: PaletteColor;
    success: PaletteColor;
    warning: PaletteColor;
    error: PaletteColor;
    divider: string;
  }
  interface PaletteOptions {
    info?: PaletteColorOptions;
    success?: PaletteColorOptions;
    warning?: PaletteColorOptions;
    error?: PaletteColorOptions;
    divider?: string;
  }
}

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brandColors.primary,
      light: "#4C4A73",
      dark: "#141238",
      contrastText: brandColors.textLight,
    },
    secondary: {
      main: brandColors.secondary,
      light: "#CBD5E1",
      dark: "#64748B",
      contrastText: brandColors.text,
    },
    background: {
      default: brandColors.background,
      paper: "#FFFFFF",
    },
    text: {
      primary: brandColors.text,
      secondary: "#64748B",
    },
    info: {
      main: "#2196F3",
      light: "#64B5F6",
      dark: "#1565C0",
    },
    success: {
      main: "#4CAF50",
      light: "#81C784",
      dark: "#2E7D32",
    },
    warning: {
      main: "#FF9800",
      light: "#FFB74D",
      dark: "#EF6C00",
    },
    error: {
      main: "#F44336",
      light: "#E57373",
      dark: "#D32F2F",
    },
    divider: brandColors.secondary,
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(270deg, ${brandColors.background}, ${brandColors.secondary}, ${brandColors.background})`,
          backgroundSize: '200% 200%',
          animation: `${backgroundAnimation} 15s ease infinite`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          borderBottom: `1px solid ${brandColors.secondary}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          transition: "all 0.3s ease",
        },
        contained: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
          boxShadow: "0 4px 12px rgba(30, 27, 75, 0.3)",
          "&:hover": {
            backgroundColor: "#141238",
            boxShadow: "0 6px 16px rgba(30, 27, 75, 0.4)",
          },
        },
        outlined: {
          borderColor: brandColors.primary,
          color: brandColors.primary,
          "&:hover": {
            backgroundColor: "rgba(30, 27, 75, 0.04)",
          },
        },
        text: {
          color: brandColors.primary,
          "&:hover": {
            backgroundColor: "rgba(30, 27, 75, 0.04)",
          },
        },
      },
    },
  },
});

// Dark theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: brandColors.secondary,
      light: "#CBD5E1",
      dark: "#64748B",
      contrastText: brandColors.primary,
    },
    secondary: {
      main: brandColors.primary,
      light: "#4C4A73",
      dark: "#141238",
      contrastText: brandColors.textLight,
    },
    background: {
      default: brandColors.backgroundDark,
      paper: "#1E293B",
    },
    text: {
      primary: "#E2E8F0",
      secondary: brandColors.secondary,
    },
    info: {
      main: "#2196F3",
      light: "#64B5F6",
      dark: '#1565C0',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#2E7D32',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#EF6C00',
    },
    error: {
      main: '#F44336',
      light: '#E57373',
      dark: '#D32F2F',
    },
    divider: '#3E3E3E',
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.5px",
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(270deg, ${brandColors.backgroundDark}, #0a1929, ${brandColors.backgroundDark})`,
          backgroundSize: '200% 200%',
          animation: `${backgroundAnimation} 15s ease infinite`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
          borderBottom: `1px solid ${brandColors.secondary}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
          transition: "all 0.3s ease",
        },
        contained: {
          backgroundColor: brandColors.secondary,
          color: brandColors.primary,
          boxShadow: "0 4px 12px rgba(148, 163, 184, 0.3)",
          "&:hover": {
            backgroundColor: "#CBD5E1",
            boxShadow: "0 6px 16px rgba(148, 163, 184, 0.4)",
          },
        },
        outlined: {
          borderColor: brandColors.secondary,
          color: brandColors.secondary,
          "&:hover": {
            backgroundColor: "rgba(148, 163, 184, 0.04)",
          },
        },
        text: {
          color: brandColors.secondary,
          "&:hover": {
            backgroundColor: "rgba(148, 163, 184, 0.04)",
          },
        },
      },
    },
  },
});

// Global theme for the entire application (keeping for backward compatibility)
export const globalTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: brandColors.primary,
      light: "#4C4A73",
      dark: "#141238",
      contrastText: brandColors.textLight,
    },
    secondary: {
      main: brandColors.secondary,
      light: "#CBD5E1",
      dark: "#64748B",
      contrastText: brandColors.text,
    },
    background: {
      default: brandColors.background,
      paper: brandColors.background,
    },
    text: {
      primary: brandColors.text,
      secondary: "#333333",
    },
    error: {
      main: "#d32f2f",
      contrastText: brandColors.textLight,
    },
    warning: {
      main: "#ff9800",
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
    divider: brandColors.secondary,
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      color: brandColors.text,
      fontWeight: 800,
      letterSpacing: "-0.5px",
    },
    h2: {
      color: brandColors.text,
      fontWeight: 700,
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `linear-gradient(270deg, ${brandColors.background}, ${brandColors.secondary}, ${brandColors.background})`,
          backgroundSize: '200% 200%',
          animation: `${backgroundAnimation} 15s ease infinite`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          transition: "all 0.3s ease",
        },
        contained: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
          "&:hover": {
            backgroundColor: "#1e4d33",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(30, 27, 75, 0.3)",
          },
        },
        outlined: {
          borderColor: brandColors.primary,
          color: brandColors.primary,
          "&:hover": {
            borderColor: "#1e4d33",
            backgroundColor: "rgba(30, 27, 75, 0.04)",
          },
        },
        text: {
          color: brandColors.primary,
          "&:hover": {
            backgroundColor: "rgba(30, 27, 75, 0.04)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.background,
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(30, 27, 75, 0.1)",
          border: `1px solid rgba(30, 27, 75, 0.1)`,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          color: brandColors.text,
          borderBottom: `1px solid ${brandColors.secondary}`,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.primary,
          "& .MuiTableCell-head": {
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
          "&:hover": {
            backgroundColor: "rgba(30, 27, 75, 0.04)",
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
          color: brandColors.text,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: brandColors.primary,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: brandColors.primary,
            },
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: brandColors.primary,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: brandColors.primary,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: brandColors.primary,
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root.Mui-focused": {
            color: brandColors.primary,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: brandColors.primary,
          color: brandColors.textLight,
          "&:hover": {
            backgroundColor: "#1e4d33",
            transform: "scale(1.1)",
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
          textAlign: "center",
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          "& .MuiAlert-root": {
            borderRadius: 8,
            backgroundColor: brandColors.background,
            color: brandColors.text,
          },
        },
      },
    },
  },
});

export default globalTheme;