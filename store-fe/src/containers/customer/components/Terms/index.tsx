import React, { useState, useCallback, useRef } from "react";
import {
  Container,
  Typography,
  Box,
  Chip,
  useTheme,
  Fade,
  Grow,
} from "@mui/material";
import {
  Gavel,
  Store,
  Payment,
  Autorenew,
  Verified,
  ContactSupport,
} from "@mui/icons-material";
import { BrandName, COLORS } from "../../../../utils/constant";
import { getSharedStyles, backgroundAnimation } from "../styles";
import ReactCanvasConfetti from "react-canvas-confetti";
import type { CreateTypes } from "canvas-confetti";

// Create a typed version of Confetti with forwardRef
const Confetti = React.forwardRef<CreateTypes>((props, ref) => (
  <div
    style={{
      position: "fixed",
      pointerEvents: "none",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 9999,
    }}
  >
    <ReactCanvasConfetti
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: 0,
        left: 0,
      }}
      {...props}
    />
  </div>
));

// Add display name for better debugging
Confetti.displayName = "Confetti";
import { styled } from "@mui/material/styles";
import TermCard from "./TermCard";

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

const TermsPage: React.FC = () => {
  const theme = useTheme();
  const styles = getSharedStyles(theme);
  const confettiRef = useRef<CreateTypes | null>(null);
  const [lastUpdated] = useState(new Date().toLocaleDateString());

  // Confetti animation handler
  const handleCelebrate = useCallback(() => {
    if (confettiRef.current) {
      confettiRef.current({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [COLORS.accent, COLORS.success, COLORS.warning],
      });
    }
  }, []);

  // Format date for display
  const formatDate = useCallback((dateStr: string) => {
    return `Last updated: ${dateStr}`;
  }, []);

  /**
   * Array of term items to render, making it easier to add/remove items
   */
  const termItems = [
    {
      id: 1,
      icon: <Gavel sx={styles.icon} />,
      title: "Introduction",
      content: `Welcome to ${BrandName.name} Jewelry Store. These Terms and Conditions govern your use of our website and services.`,
    },
    {
      id: 2,
      icon: <Store sx={styles.icon} />,
      title: "Products & Services",
      content: `${BrandName.name} specializes in premium jewelry including rings, earrings, bangles, anklets, bracelets, pendants, and hair accessories.`,
    },
    {
      id: 3,
      icon: <Payment sx={styles.icon} />,
      title: "Orders & Payment",
      content: (
        <>
          • Orders processed within 1-2 business days
          <br />
          • COD and online payments accepted
          <br />• Free shipping on orders above PKR 2999
        </>
      ),
    },
    {
      id: 4,
      icon: <Autorenew sx={styles.icon} />,
      title: "Return Policy",
      content: (
        <>
          • 7-day return policy for unused items
          <br />
          • Exchange available for size adjustments
          <br />• Custom orders are non-returnable
        </>
      ),
    },
    {
      id: 5,
      icon: <Verified sx={styles.icon} />,
      title: "Quality Assurance",
      content:
        "All jewelry undergoes strict quality checks with authenticity guarantees and certificates for precious materials.",
    },
    {
      id: 6,
      icon: <ContactSupport sx={styles.icon} />,
      title: "Contact Information",
      content:
        "For questions, contact us at support@gem-heart.com or through our WhatsApp support channel.",
    },
  ];

  /**
   * Render all term cards from the termItems array
   */
  const renderTermCards = useCallback((): JSX.Element[] => {
    return termItems.map((item, index) => (
      <Grow
        key={item.id}
        in={true}
        timeout={800}
        style={{ transitionDelay: `${(index + 1) * 200}ms` }}
      >
        <div>
          <TermCard icon={item.icon} title={item.title} sx={styles.card}>
            {item.content}
          </TermCard>
        </div>
      </Grow>
    ));
  }, [termItems, styles.card, styles.icon]);

  return (
    <AnimatedBox>
      <Confetti ref={confettiRef} />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Grow in={true} timeout={800} style={{ transitionDelay: "200ms" }}>
              <Typography variant="h2" gutterBottom sx={styles.title}>
                Terms and Conditions
              </Typography>
            </Grow>

            <Grow in={true} timeout={800} style={{ transitionDelay: "400ms" }}>
              <Chip
                label={formatDate(lastUpdated)}
                color="primary"
                variant="outlined"
                onClick={handleCelebrate}
                sx={styles.chip}
              />
            </Grow>
          </Box>
        </Fade>

        <Box sx={styles.gridContainer}>{renderTermCards()}</Box>
      </Container>
    </AnimatedBox>
  );
};

export default TermsPage;
