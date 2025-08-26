import { grey } from "@mui/material/colors";

export const getLightPalette = (primaryColor: string) => ({
  primary: {
    main: primaryColor,
    light: '#a5b4fc',
    dark: '#4338ca',
  },
  secondary: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
  },
  background: {
    default: "#f8fafc",
    paper: "#ffffff",
  },
  text: {
    primary: '#1e293b',
    secondary: '#64748b',
  },
  error: {
    main: '#ef4444',
  },
  warning: {
    main: '#f59e0b',
  },
  success: {
    main: '#10b981',
  },
});

export const getDarkPalette = (primaryColor: string) => ({
  primary: {
    main: primaryColor,
    light: '#c4b5fd',
    dark: '#7c3aed',
  },
  secondary: {
    main: '#06d6a0',
    light: '#4ade80',
    dark: '#047857',
  },
  background: {
    default: "#0f172a",
    paper: "#1e293b",
  },
  text: {
    primary: '#f1f5f9',
    secondary: '#94a3b8',
  },
  error: {
    main: '#f87171',
  },
  warning: {
    main: '#fbbf24',
  },
  success: {
    main: '#34d399',
  },
});