import { Theme } from "@mui/material/styles";
import { keyframes } from "@emotion/react";
import { COLORS } from "../../../utils/constant";

// Keyframe animations
export const backgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export const cardHoverAnimation = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-5px); }
`;

export const getSharedStyles = (theme: Theme) => {
  const accentColor = theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;
  
  return {
    // Page container styles
    pageContainer: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 3,
      overflow: "hidden",
      background: theme.palette.mode === 'light' 
        ? `linear-gradient(270deg, ${COLORS.offWhite}, ${COLORS.silver}, ${COLORS.offWhite})` 
        : `linear-gradient(270deg, ${COLORS.deepNavy}, #0a1929, ${COLORS.deepNavy})`,
      backgroundSize: "200% 200%",
      animation: `${backgroundAnimation} 15s ease infinite`,
      backgroundColor: theme.palette.background.default,
    },
    // Title styles
    title: {
      textAlign: "center",
      color: theme.palette.text.primary,
      mb: 5,
      fontWeight: "bold",
      textTransform: "uppercase",
      textShadow: `2px 2px 4px ${accentColor}40`,
      fontSize: { xs: "2rem", md: "3rem" },
      letterSpacing: "2px",
      position: "relative" as const,
      "&::after": {
        content: '""',
        display: "block",
        width: "100px",
        height: "2px",
        background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
        margin: "10px auto 0",
        boxShadow: `0 2px 10px ${accentColor}40`,
      },
    },
    // Card styles
    card: {
      borderRadius: 2,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${theme.palette.divider}`,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: theme.shadows[4],
        animation: `${cardHoverAnimation} 0.3s ease forwards`,
      },
    },
    // Card content styles
    cardContent: {
      p: 3,
    },
    // Card header styles
    cardHeader: {
      display: "flex",
      alignItems: "center",
      mb: 2,
    },
    // Icon styles
    icon: {
      mr: 2,
      color: theme.palette.primary.main,
    },
    // Grid container styles
    gridContainer: {
      display: "grid",
      gap: 3,
      gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
    },
    // Chip styles
    chip: {
      borderColor: "primary.main",
      color: "primary.main",
      transition: "all 0.3s ease",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "primary.main",
        color: "white",
        transform: "scale(1.05)",
      },
    },
  };
};

// Export the animations for direct use
export { keyframes };
