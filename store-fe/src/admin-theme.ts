import { createTheme, responsiveFontSizes } from "@mui/material";
import { Theme } from "@mui/material/styles";

// This is the key change: Module augmentation to add the `divider` property
// to Material-UI's built-in Palette and PaletteOptions interfaces.
declare module "@mui/material/styles" {
  interface Palette {
    divider: string;
  }
  interface PaletteOptions {
    divider?: string;
  }
}

// A corrected version of the AdminThemeOptions interface
interface AdminThemeOptions {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  mode: "light" | "dark";
}

// The return type of this function has been changed from ThemeOptions to Theme.
const getAdminTheme = (options: AdminThemeOptions): Theme => {
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
        paper: options.mode === "light" ? "#FFFFFF" : "#1e293b",
      },
      divider: options.mode === "light"
        ? "rgba(0, 0, 0, 0.12)"
        : "rgba(255, 255, 255, 0.12)",
    } as const,
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

export const adminLightTheme = responsiveFontSizes(
  getAdminTheme({
    primaryColor: "#1E1B4B", // Deep navy
    secondaryColor: "#94A3B8", // Silver accent
    backgroundColor: "#F8FAFC", // Off-white
    fontFamily: "Inter",
    mode: "light",
  })
);

export const adminDarkTheme = responsiveFontSizes(
  getAdminTheme({
    primaryColor: "#94A3B8", // Silver accent
    secondaryColor: "#1E1B4B", // Deep navy
    backgroundColor: "#0F172A", // Dark background for contrast
    fontFamily: "Inter",
    mode: "dark",
  })
);
