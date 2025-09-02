import { createTheme, PaletteColor, PaletteColorOptions } from "@mui/material/styles";

// Define the core color variables for clarity
const palette = {
  offWhite: "#F8FAFC",
  deepNavy: "#1E1B4B",
  silver: "#94A3B8",
};

// Extend the palette to include other standard colors for better type safety
declare module '@mui/material/styles' {
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

// Create the Light Theme with the specified palette
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: palette.deepNavy,
      dark: "#141238", // A slightly darker navy
      light: "#4C4A73", // A slightly lighter navy
    },
    secondary: {
      main: palette.silver,
      light: "#CBD5E1", // Lighter silver
      dark: "#64748B", // Darker silver
    },
    background: {
      default: palette.offWhite,
      paper: "#FFFFFF", // Pure white for paper elements to make the navy stand out
    },
    text: {
      primary: palette.deepNavy,
      secondary: palette.silver,
    },
    // --- Added standard palette colors to resolve the error ---
    info: {
      main: '#2196F3',
      light: '#64B5F6',
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
    divider: palette.silver,
    // --- End of added colors ---
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          backgroundColor: palette.deepNavy,
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(30, 27, 75, 0.3)",
          "&:hover": {
            backgroundColor: "#141238",
            boxShadow: "0 6px 16px rgba(30, 27, 75, 0.4)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          borderBottom: `1px solid ${palette.silver}`,
        },
      },
    },
  },
});

// Create the Dark Theme as an inverse of the light theme
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: palette.deepNavy,
      dark: "#64748B",
      light: "#CBD5E1",
    },
    secondary: {
      main: palette.deepNavy,
      light: "#4C4A73",
      dark: "#141238",
    },
    background: {
      default: palette.deepNavy, // Using deepNavy as the main background
      paper: "#25204F", // A slightly lighter shade of deepNavy for paper elements
    },
    text: {
      primary: palette.offWhite,
      secondary: palette.silver,
    },
    // --- Added standard palette colors to resolve the error ---
    info: {
      main: '#2196F3',
      light: '#64B5F6',
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
    // --- End of added colors ---
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
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          backgroundColor: palette.silver,
          color: palette.deepNavy,
          boxShadow: "0 4px 12px rgba(148, 163, 184, 0.3)",
          "&:hover": {
            backgroundColor: "#CBD5E1",
            boxShadow: "0 6px 16px rgba(148, 163, 184, 0.4)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.6)",
          borderBottom: `1px solid ${palette.silver}`,
        },
      },
    },
  },
});
