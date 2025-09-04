import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

// Keyframe animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(30, 27, 75, 0.5); }
  50% { box-shadow: 0 0 20px rgba(30, 27, 75, 0.8); }
  100% { box-shadow: 0 0 5px rgba(30, 27, 75, 0.5); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Styled components for animations
const AnimatedContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.8s ease-out;
`;

interface FloatingNumberProps {
  delay?: string;
  component?: React.ElementType;
}

const FloatingNumber = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'delay',
})<FloatingNumberProps>`
  animation: ${floatAnimation} 3s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const GlowingButton = styled(Button)`
  animation: ${glowAnimation} 2s ease-in-out infinite;
`;

// Floating decorative element component
const FloatingDot: React.FC<{
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  size: number;
  color: string;
  animationDelay: string;
}> = ({ top, right, bottom, left, size, color, animationDelay }) => (
  <Box
    sx={{
      position: "absolute",
      top,
      right,
      bottom,
      left,
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
      animation: `${floatAnimation} 4s ease-in-out ${animationDelay} infinite`,
    }}
  />
);

const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  // Check if the current theme is dark mode
  const isDarkMode = theme.palette.mode === "dark";
  
  // Colors for light and dark modes
  const colors = {
    background: theme.palette.background.default,
    text: theme.palette.text.primary,
    accent: isDarkMode ? theme.palette.common.white : theme.palette.primary.main,
    buttonText: isDarkMode ? theme.palette.primary.main : theme.palette.common.white,
  };

  // Handle navigation with error handling
  const handleNavigateHome = () => {
    try {
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback: redirect using window.location if routing fails
      window.location.href = "/";
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.background,
        overflow: "hidden",
        transition: "background-color 0.3s ease",
      }}
    >
      <AnimatedContainer maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "center",
            justifyContent: "center",
            gap: isMobile ? 3 : 8,
            py: 4,
          }}
        >
          {/* Animated 404 numbers */}
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box sx={{ display: "flex" }}>
              <FloatingNumber
                variant="h1"
                delay="0s"
                sx={{
                  fontSize: isMobile ? "6rem" : "10rem",
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                  lineHeight: 1,
                }}
              >
                4
              </FloatingNumber>
              <FloatingNumber
                variant="h1"
                delay="0.3s"
                sx={{
                  fontSize: isMobile ? "6rem" : "10rem",
                  fontWeight: "bold",
                  color: isDarkMode ? "#94A3B8" : theme.palette.secondary.main,
                  lineHeight: 1,
                }}
              >
                0
              </FloatingNumber>
              <FloatingNumber
                variant="h1"
                delay="0.6s"
                sx={{
                  fontSize: isMobile ? "6rem" : "10rem",
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                  lineHeight: 1,
                }}
              >
                4
              </FloatingNumber>
            </Box>

            {/* Decorative elements */}
            <FloatingDot
              top={-15}
              right={-15}
              size={30}
              color={isDarkMode ? "#94A3B8" : theme.palette.secondary.main}
              animationDelay="0.5s"
            />
            <FloatingDot
              bottom={-10}
              left={-20}
              size={20}
              color={theme.palette.primary.light}
              animationDelay="1s"
            />
          </Box>

          <Box
            sx={{
              animation: `${fadeIn} 0.8s ease-out 0.3s both`,
              textAlign: isMobile ? "center" : "left",
              maxWidth: 400,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: "medium",
                mb: 2,
                color: colors.text,
              }}
            >
              Oops! Page Not Found
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mb: 3,
              }}
            >
              Sorry, the page you're looking for doesn't exist or has been
              moved. Please check the URL or navigate back to the homepage.
            </Typography>

            <Box sx={{ animation: `${fadeIn} 0.8s ease-out 0.7s both` }}>
              <GlowingButton
                variant={isDarkMode ? "outlined" : "contained"}
                size="large"
                onClick={handleNavigateHome}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontWeight: "bold",
                  borderRadius: 2,
                  // Light mode styles
                  ...(!isDarkMode && {
                    background: colors.accent,
                    color: colors.buttonText,
                    "&:hover": {
                      background: "#2d2a6b", // darker navy
                      transform: "scale(1.05)",
                    },
                  }),
                  // Dark mode styles
                  ...(isDarkMode && {
                    border: `2px solid ${colors.accent}`,
                    color: colors.accent,
                    background: "transparent",
                    "&:hover": {
                      background: colors.accent,
                      color: colors.buttonText,
                      border: `2px solid ${colors.accent}`,
                      transform: "scale(1.05)",
                    },
                  }),
                  transition: "all 0.3s ease",
                }}
              >
                Back to Home
              </GlowingButton>
            </Box>
          </Box>
        </Box>
      </AnimatedContainer>
    </Box>
  );
};

export default NotFound;