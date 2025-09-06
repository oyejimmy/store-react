import React, { useState, useCallback } from "react";
import {
  Container,
  Box,
  Chip,
  useTheme,
  Fade,
  Grow,
  styled,
  Typography,
} from "@mui/material";
import {
  Info,
  Settings,
  Share,
  Security,
  Cookie,
  AccountBox,
} from "@mui/icons-material";
import Confetti from "react-canvas-confetti";
import PolicyCard from "./PolicyCard";
import { COLORS } from "../../../utils/constant";
import { getSharedStyles, backgroundAnimation } from "../components/styles";

// Styled component for animated background
const AnimatedBox = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  overflow: "hidden",
  background:
    theme.palette.mode === "light"
      ? `linear-gradient(270deg, ${COLORS.offWhite}, ${COLORS.silver}, ${COLORS.offWhite})`
      : `linear-gradient(270deg, ${COLORS.deepNavy}, #0a1929, ${COLORS.deepNavy})`,
  backgroundSize: "200% 200%",
  animation: `${backgroundAnimation} 15s ease infinite`,
}));

const PrivacyPage: React.FC = () => {
  const theme = useTheme();
  const styles = getSharedStyles(theme);
  const [lastUpdated] = useState(new Date().toLocaleDateString());
  const [showConfetti, setShowConfetti] = useState(false);

  // Format date for display
  const formatDate = useCallback((dateStr: string) => {
    return `Last updated: ${dateStr}`;
  }, []);

  // Confetti animation handler
  const handleCelebrate = useCallback(() => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000); // Hide after 3 seconds
  }, []);

  return (
    <AnimatedBox>
      {showConfetti && (
        <Confetti
          style={{
            position: "fixed",
            pointerEvents: "none",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
          }}
        />
      )}

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Grow in={true} timeout={800} style={{ transitionDelay: "200ms" }}>
              <Typography variant="h2" gutterBottom sx={styles.title}>
                Privacy Policy
              </Typography>
            </Grow>

            <Grow in={true} timeout={800} style={{ transitionDelay: "400ms" }}>
              <Chip
                label={formatDate(lastUpdated)}
                color="primary"
                variant="outlined"
                onClick={handleCelebrate}
                sx={{ cursor: "pointer" }}
              />
            </Grow>
          </Box>
        </Fade>

        <Box sx={styles.gridContainer}>
          <Grow in={true} timeout={800} style={{ transitionDelay: "600ms" }}>
            <div>
              <PolicyCard
                icon={Info}
                title="Information We Collect"
                sx={styles.card}
              >
                We collect your name, email, phone number, and shipping address
                when you create an account or place orders.
              </PolicyCard>
            </div>
          </Grow>

          <Grow in={true} timeout={800} style={{ transitionDelay: "800ms" }}>
            <div>
              <PolicyCard
                icon={Settings}
                title="How We Use Information"
                sx={styles.card}
              >
                • Process jewelry orders
                <br />
                • Send order updates
                <br />
                • Provide customer support
                <br />• Send promotional offers
              </PolicyCard>
            </div>
          </Grow>

          <Grow in={true} timeout={800} style={{ transitionDelay: "1000ms" }}>
            <div>
              <PolicyCard
                icon={Share}
                title="Information Sharing"
                sx={styles.card}
              >
                We don&apos;t sell your data. We only share with shipping
                partners, payment processors, and legal authorities when
                required.
              </PolicyCard>
            </div>
          </Grow>

          <Grow in={true} timeout={800} style={{ transitionDelay: "1200ms" }}>
            <div>
              <PolicyCard
                icon={Security}
                title="Data Security"
                sx={styles.card}
              >
                Industry-standard security measures protect your information.
                All transactions are encrypted and secure.
              </PolicyCard>
            </div>
          </Grow>

          <Grow in={true} timeout={800} style={{ transitionDelay: "1400ms" }}>
            <div>
              <PolicyCard
                icon={Cookie}
                title="Cookies & Tracking"
                sx={styles.card}
              >
                We use cookies to enhance your shopping experience and analyze
                website traffic. You can disable them in browser settings.
              </PolicyCard>
            </div>
          </Grow>

          <Grow in={true} timeout={800} style={{ transitionDelay: "1600ms" }}>
            <div>
              <PolicyCard
                icon={AccountBox}
                title="Your Rights"
                sx={styles.card}
              >
                • Access and update your information
                <br />
                • Delete your account
                <br />
                • Opt-out of marketing
                <br />• Request data copy
              </PolicyCard>
            </div>
          </Grow>
        </Box>
      </Container>
    </AnimatedBox>
  );
};

export default PrivacyPage;
