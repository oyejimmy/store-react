// components/AnimatedFooter.tsx
import React from "react";
import {
  Box,
  Grid,
  Typography,
  Link as MuiLink,
  useTheme,
  Container,
  IconButton,
  Theme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Diamond } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import { BrandName, COLORS } from "../../utils/constant";

// Import the Theme type from MUI
import type { Theme as MuiTheme } from "@mui/material/styles";

declare module "@emotion/react" {
  export interface Theme extends MuiTheme {}
}

// Keyframe animation for subtle background movement
const backgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled component for animated footer
const AnimatedFooter = styled(Box, {
  shouldForwardProp: (prop) => prop !== "mode",
})<{ mode: "light" | "dark" }>(({ mode, theme }) => ({
  background:
    mode === "light"
      ? `linear-gradient(270deg, ${COLORS.offWhite}, ${COLORS.silver}, ${COLORS.offWhite})`
      : `linear-gradient(270deg, ${COLORS.deepNavy}, #0a1929, ${COLORS.deepNavy})`,
  backgroundSize: "200% 200%",
  animation: `${backgroundAnimation} 15s ease infinite`,
  color: theme.palette.text.primary,
  marginTop: "auto",
  padding: "32px 0",
  transition: "all 0.3s ease",
}));

const Footer: React.FC = () => {
  const theme = useTheme();

  // Determine colors based on theme
  const textColor = theme.palette.text.primary;
  const borderColor =
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.2)"
      : "rgba(30, 27, 75, 0.2)";
  const iconColor = theme.palette.text.primary;
  const hoverColor = theme.palette.mode === "dark" ? "#FF6B6B" : "#1E1B4B";

  return (
    <AnimatedFooter
      component="footer"
      mode={theme.palette.mode as "light" | "dark"}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Diamond
                sx={{
                  color: iconColor,
                  mr: 1,
                  fontSize: 32,
                  transition: "color 0.3s ease",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  color: textColor,
                  fontWeight: 700,
                  transition: "color 0.3s ease",
                }}
              >
                {BrandName.name}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: textColor,
                opacity: 0.8,
                mb: 3,
                lineHeight: 1.6,
                transition: "color 0.3s ease, opacity 0.3s ease",
              }}
            >
              True treasure handpicked from the most exceptional sources around
              the globe.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                component={MuiLink}
                href="https://instagram.com/gem-heart"
                target="_blank"
                sx={{
                  color: iconColor,
                  opacity: 0.8,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: hoverColor,
                    opacity: 1,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component={MuiLink}
                href="https://facebook.com/gem-heart"
                target="_blank"
                sx={{
                  color: iconColor,
                  opacity: 0.8,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: hoverColor,
                    opacity: 1,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <Facebook />
              </IconButton>
            </Box>
          </Grid>

          {/* Links Sections */}
          <Grid item xs={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: textColor,
                mb: 2,
                fontSize: "1rem",
                transition: "color 0.3s ease",
              }}
            >
              Products
            </Typography>
            {["Rings", "Earrings", "Bangles", "Pendants"].map((item) => (
              <Typography
                key={item}
                component={Link}
                to={`/shop/${item.toLowerCase()}`}
                variant="body2"
                sx={{
                  display: "block",
                  color: textColor,
                  opacity: 0.8,
                  textDecoration: "none",
                  mb: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: hoverColor,
                    opacity: 1,
                    paddingLeft: "4px",
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: textColor,
                mb: 2,
                fontSize: "1rem",
                transition: "color 0.3s ease",
              }}
            >
              Services
            </Typography>
            {["Shop", "Contact", "About Us", "Cart"].map((item) => (
              <Typography
                key={item}
                component={Link}
                to={
                  item === "Shop"
                    ? "/shop"
                    : item === "Contact"
                    ? "/contact"
                    : item === "About Us"
                    ? "/about"
                    : "/cart"
                }
                variant="body2"
                sx={{
                  display: "block",
                  color: textColor,
                  opacity: 0.8,
                  textDecoration: "none",
                  mb: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: hoverColor,
                    opacity: 1,
                    paddingLeft: "4px",
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              sx={{
                color: textColor,
                mb: 2,
                fontSize: "1rem",
                transition: "color 0.3s ease",
              }}
            >
              About Us
            </Typography>
            {[
              "Contact Us",
              "Blogs",
              "Privacy Policy",
              "Terms and Conditions",
            ].map((item) => (
              <Typography
                key={item}
                component={Link}
                to={
                  item === "Contact Us"
                    ? "/contact"
                    : item === "Privacy Policy"
                    ? "/privacy"
                    : item === "Terms and Conditions"
                    ? "/terms"
                    : "/about"
                }
                variant="body2"
                sx={{
                  display: "block",
                  color: textColor,
                  opacity: 0.8,
                  textDecoration: "none",
                  mb: 1,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: hoverColor,
                    opacity: 1,
                    paddingLeft: "4px",
                  },
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: `1px solid ${borderColor}`,
            pt: 3,
            mt: 3,
            textAlign: "center",
            transition: "border-color 0.3s ease",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: textColor,
              opacity: 0.8,
              transition: "color 0.3s ease, opacity 0.3s ease",
            }}
          >
            {new Date().getFullYear()} ©Jamil Ur Rahman. All Rights Reserved
          </Typography>
        </Box>
      </Container>
    </AnimatedFooter>
  );
};

export default Footer;
