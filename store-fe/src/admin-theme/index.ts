import { createTheme, responsiveFontSizes, PaletteOptions, Components, Shadows, alpha } from "@mui/material";

// --- Placeholder Palettes ---
// You will need to replace these with your actual palette logic.
const getLightPalette = (primaryColor: string): PaletteOptions => ({
  mode: 'light',
  primary: {
    main: primaryColor,
  },
  secondary: {
    main: '#94A3B8',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
});

const getDarkPalette = (primaryColor: string): PaletteOptions => ({
  mode: 'dark',
  primary: {
    main: primaryColor,
  },
  secondary: {
    main: '#1E1B4B',
  },
  background: {
    default: '#0F172A',
    paper: '#1e293b',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
});

// --- Placeholder Shadows ---
// You will need to replace this with your actual shadow configuration.
const shadows = (primaryColor: string): Shadows => {
  return createTheme().shadows; // Returning default shadows for now.
};

// --- Placeholder Components ---
// You will need to replace this with your actual component overrides.
const components: Components = {};

// --- Placeholder Typography ---
// You will need to replace this with your actual typography configuration.
const typography = {
  fontFamily: 'Inter, sans-serif',
};

// --- Main Theme Function ---
interface AdminThemeOptions {
  primaryColor: string;
  fontFamily: string;
  mode?: 'light' | 'dark';
}

const getAdminTheme = ({ primaryColor, fontFamily, mode = 'light' }: AdminThemeOptions) =>
  responsiveFontSizes(
    createTheme({
      palette: mode === 'light' ? getLightPalette(primaryColor) : getDarkPalette(primaryColor),
      typography: {
        ...typography,
        fontFamily: `${fontFamily}, sans-serif`,
      },
      shape: {
        borderRadius: 10,
      },
      shadows: shadows(primaryColor),
      components,
    })
  );

export { getAdminTheme };
