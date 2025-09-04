import { COLORS } from "./constant";
import { useTheme } from "@mui/material";

export const accentColor = () => {
  const theme = useTheme();
  return theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;
};
