import { createTheme, responsiveFontSizes, PaletteOptions, Components, Shadows } from "@mui/material";
import { ThemeOptions } from "@mui/material/styles";

// A corrected version of the AdminThemeOptions interface
interface AdminThemeOptions {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  mode: 'light' | 'dark';
}

const getAdminTheme = (options: AdminThemeOptions): ThemeOptions => {
  return createTheme({
    palette: {
      mode: options.mode,
      primary: {
        main: options.primaryColor,
      },
      secondary: {
        main: options.secondaryColor,
      },
      background: {
        default: options.backgroundColor,
        paper: options.mode === 'light' ? '#FFFFFF' : '#1e293b',
      },
      // The divider property is correctly added here
      divider: options.mode === 'light' ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    },
    typography: {
      fontFamily: `${options.fontFamily}, sans-serif`,
    },
    shape: {
      borderRadius: 10,
    },
    // Placeholders for shadows and components
    shadows: createTheme().shadows,
    components: {},
  });
};

export const adminLightTheme = responsiveFontSizes(getAdminTheme({
  primaryColor: '#1E1B4B', // Deep navy
  secondaryColor: '#94A3B8', // Silver accent
  backgroundColor: '#F8FAFC', // Off-white
  fontFamily: 'Inter',
  mode: 'light'
}));

export const adminDarkTheme = responsiveFontSizes(getAdminTheme({
  primaryColor: '#94A3B8', // Silver accent
  secondaryColor: '#1E1B4B', // Deep navy
  backgroundColor: '#0F172A', // Dark background for contrast
  fontFamily: 'Inter',
  mode: 'dark'
}));
