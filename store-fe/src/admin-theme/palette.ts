import { grey } from "@mui/material/colors";

export const getLightPalette = (primaryColor: string) => ({
  primary: {
    main: primaryColor,
    light: '#4a8b6a',
    dark: '#1e4d33',
  },
  secondary: {
    main: '#6E2C51',
    light: '#8b4a73',
    dark: '#4d1e38',
  },
  background: {
    default: "#ffffff",
    paper: "#ffffff",
  },
  text: {
    primary: '#000000',
    secondary: '#333333',
  },
  error: {
    main: '#6E2C51',
  },
  warning: {
    main: '#6E2C51',
  },
  success: {
    main: '#2c6e49',
  },
});

export const getDarkPalette = (primaryColor: string) => ({
  primary: {
    main: primaryColor,
    light: '#4a8b6a',
    dark: '#1e4d33',
  },
  secondary: {
    main: '#6E2C51',
    light: '#8b4a73',
    dark: '#4d1e38',
  },
  background: {
    default: "#1a1a1a",
    paper: "#2d2d2d",
  },
  text: {
    primary: '#ffffff',
    secondary: '#cccccc',
  },
  error: {
    main: '#6E2C51',
  },
  warning: {
    main: '#6E2C51',
  },
  success: {
    main: '#2c6e49',
  },
});