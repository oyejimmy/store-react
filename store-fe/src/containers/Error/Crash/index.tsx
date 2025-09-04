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

// ========== ANIMATIONS ==========
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.4); }
  50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.8); }
  100% { box-shadow: 0 0 5px rgba(255, 0, 0, 0.4); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const backgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ========== STYLED COMPONENTS ==========

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
  shouldForwardProp: (prop) => prop !== "delay",
})<FloatingNumberProps>`
  animation: ${floatAnimation} 3s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
`;

const GlowingButton = styled(Button)`
  animation: ${glowAnimation} 2s ease-in-out infinite;
`;

const AnimatedBackground = styled(Box)`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(270deg, #4e0000, #ff0000, #4e0000);
  background-size: 200% 200%;
  animation: ${backgroundAnimation} 15s ease infinite;
  overflow: hidden;
`;

const CrashPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));

  const handleNavigateHome = () => {
    try {
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/";
    }
  };

  const getResponsiveFontSize = (mobileSize: string, desktopSize: string) => {
    if (isMobile) return mobileSize;
    if (isTablet) return `calc(${mobileSize} + 1rem)`;
    return desktopSize;
  };

  return (
    <AnimatedBackground>
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
          {/* Crash Code Numbers */}
          <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box sx={{ display: "flex" }}>
              <FloatingNumber
                variant="h1"
                delay="0s"
                sx={{
                  fontSize: getResponsiveFontSize("5rem", "10rem"),
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                5
              </FloatingNumber>
              <FloatingNumber
                variant="h1"
                delay="0.3s"
                sx={{
                  fontSize: getResponsiveFontSize("5rem", "10rem"),
                  fontWeight: "bold",
                  color: "#ffbaba",
                }}
              >
                0
              </FloatingNumber>
              <FloatingNumber
                variant="h1"
                delay="0.6s"
                sx={{
                  fontSize: getResponsiveFontSize("5rem", "10rem"),
                  fontWeight: "bold",
                  color: "#ffffff",
                }}
              >
                0
              </FloatingNumber>
            </Box>
          </Box>

          <Box
            sx={{
              animation: `${fadeIn} 0.8s ease-out 0.3s both`,
              textAlign: isMobile ? "center" : "left",
              maxWidth: 400,
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h2"
              gutterBottom
              sx={{
                fontWeight: "medium",
                mb: 2,
                color: "#fff",
              }}
            >
              Something Broke 😵‍💫
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                color: "#ffdede",
                fontSize: isMobile ? "0.9rem" : "1rem",
              }}
            >
              Uh-oh! This screen shows up when something critical fails —
              possibly a recent code change or a linting issue caused the app to
              crash. Please contact the development team.
            </Typography>

            <Box sx={{ animation: `${fadeIn} 0.8s ease-out 0.7s both` }}>
              <GlowingButton
                variant="contained"
                size="large"
                onClick={handleNavigateHome}
                sx={{
                  backgroundColor: "#ffffff",
                  color: "#ff0000",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: "#ff4c4c",
                    color: "#fff",
                  },
                }}
                fullWidth={isMobile}
              >
                Go Back Home
              </GlowingButton>
            </Box>
          </Box>
        </Box>
      </AnimatedContainer>
    </AnimatedBackground>
  );
};

export default CrashPage;
