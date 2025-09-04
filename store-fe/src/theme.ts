// theme.ts
import {
  createTheme,
  PaletteColor,
  PaletteColorOptions,
} from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { COLORS } from "./utils/constant";

// Define the core color variables for clarity
const palette = {
  offWhite: "#F8FAFC",
  deepNavy: "#1E1B4B",
  silver: "#94A3B8",
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
    mode: "light" | "dark";
  }
  interface PaletteOptions {
    info?: PaletteColorOptions;
    success?: PaletteColorOptions;
    warning?: PaletteColorOptions;
    error?: PaletteColorOptions;
    divider?: string;
    mode?: "light" | "dark";
  }
}

// Create the Light Theme with the specified palette
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: palette.deepNavy,
      dark: "#141238",
      light: "#4C4A73",
    },
    secondary: {
      main: palette.silver,
      light: "#CBD5E1",
      dark: "#64748B",
    },
    background: {
      default: palette.offWhite,
      paper: "#FFFFFF",
    },
    text: {
      primary: palette.deepNavy,
      secondary: palette.silver,
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
    divider: palette.silver,
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
          background: `linear-gradient(270deg, ${palette.offWhite}, ${palette.silver}, ${palette.offWhite})`,
          backgroundSize: "200% 200%",
          animation: `${backgroundAnimation} 15s ease infinite`,
        },
      },
    },
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
      default: palette.deepNavy,
      paper: "#25204F",
    },
    text: {
      primary: palette.offWhite,
      secondary: palette.silver,
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
    divider: "#3E3E3E",
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
          background: `linear-gradient(270deg, ${palette.deepNavy}, #0a1929, ${palette.deepNavy})`,
          backgroundSize: "200% 200%",
          animation: `${backgroundAnimation} 15s ease infinite`,
        },
      },
    },
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
