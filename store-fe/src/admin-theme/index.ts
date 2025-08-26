import { createTheme, responsiveFontSizes } from "@mui/material";
import { shadows } from "./shadows";
import { components } from "./components";
import { getLightPalette, getDarkPalette } from "./palette";
import { typography } from "./typography";

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