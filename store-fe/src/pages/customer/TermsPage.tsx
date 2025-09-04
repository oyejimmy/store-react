import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  useTheme,
  Theme,
  SxProps,
} from "@mui/material";
import {
  Gavel,
  Store,
  Payment,
  Autorenew,
  Verified,
  ContactSupport,
} from "@mui/icons-material";
import { COLORS } from "../../utils/constant";

// ========== TYPES ==========
type TermCardProps = {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

type TermItem = {
  id: number;
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
};

// ========== STYLE CONSTANTS ==========
// Reusable style objects extracted as constants
const PAGE_CONTAINER_STYLES: SxProps<Theme> = (theme: Theme) => ({
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.background.default,
  p: 3,
  overflow: "hidden",
  transition: "background-color 0.3s ease",
});

const CONTAINER_STYLES: SxProps<Theme> = {
  py: 6,
};

const HEADER_CONTAINER_STYLES: SxProps<Theme> = {
  textAlign: "center",
  mb: 6,
};

const CHIP_STYLES: SxProps<Theme> = (theme: Theme) => ({
  borderColor: "primary.main",
  color: "primary.main",
  transition: "all 0.3s ease",
});

const GRID_CONTAINER_STYLES: SxProps<Theme> = {
  display: "grid",
  gap: 3,
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
};

const CARD_STYLES: SxProps<Theme> = (theme: Theme) => ({
  borderRadius: 2,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[4],
    transform: "translateY(-2px)",
  },
});

const CARD_CONTENT_STYLES: SxProps<Theme> = {
  p: 3,
};

const CARD_HEADER_STYLES: SxProps<Theme> = {
  display: "flex",
  alignItems: "center",
  mb: 2,
};

const CARD_TITLE_STYLES: SxProps<Theme> = {
  fontWeight: 600,
  color: "text.primary",
  transition: "color 0.3s ease",
};

const CARD_BODY_STYLES: SxProps<Theme> = {
  color: "text.secondary",
  transition: "color 0.3s ease",
};

const ICON_STYLES: SxProps<Theme> = (theme: Theme) => ({
  mr: 2,
  color: theme.palette.primary.main,
});

// Helper function to create title styles with accent color
const createTitleStyles = (accentColor: string): SxProps<Theme> => ({
  textAlign: "center",
  color: "text.primary",
  mb: 5,
  fontWeight: "bold",
  textTransform: "uppercase",
  textShadow: `2px 2px 4px ${accentColor}40`,
  fontSize: { xs: "2rem", md: "3rem" },
  letterSpacing: "2px",
  position: "relative",
  "&::after": {
    content: '""',
    display: "block",
    width: "100px",
    height: "2px",
    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
    margin: "10px auto 0",
    boxShadow: `0 2px 10px ${accentColor}40`,
  },
});

// ========== COMPONENTS ==========
/**
 * Reusable TermCard component for displaying individual terms and conditions
 * @param icon - Icon to display
 * @param title - Title of the term card
 * @param children - Content of the term card
 */
const TermCard: React.FC<TermCardProps> = ({ icon, title, children }) => {
  const theme = useTheme();

  return (
    <Card sx={CARD_STYLES(theme)}>
      <CardContent sx={CARD_CONTENT_STYLES}>
        <Box sx={CARD_HEADER_STYLES}>
          {icon}
          <Typography variant="h5" sx={CARD_TITLE_STYLES}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body1" sx={CARD_BODY_STYLES}>
          {children}
        </Typography>
      </CardContent>
    </Card>
  );
};

const TermsPage: React.FC = () => {
  const theme = useTheme();
  const accentColor =
    theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;

  /**
   * Format the current date as a localized string
   * @returns Formatted date string
   */
  const getFormattedDate = (): string => {
    return new Date().toLocaleDateString();
  };

  /**
   * Array of term items to render, making it easier to add/remove items
   */
  const termItems: TermItem[] = [
    {
      id: 1,
      icon: <Gavel sx={ICON_STYLES(theme)} />,
      title: "Introduction",
      content:
        "Welcome to Gem-Heart Jewelry Store. These Terms and Conditions govern your use of our website and services.",
    },
    {
      id: 2,
      icon: <Store sx={ICON_STYLES(theme)} />,
      title: "Products & Services",
      content:
        "Gem-Heart specializes in premium jewelry including rings, earrings, bangles, anklets, bracelets, pendants, and hair accessories.",
    },
    {
      id: 3,
      icon: <Payment sx={ICON_STYLES(theme)} />,
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
      icon: <Autorenew sx={ICON_STYLES(theme)} />,
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
      icon: <Verified sx={ICON_STYLES(theme)} />,
      title: "Quality Assurance",
      content:
        "All jewelry undergoes strict quality checks with authenticity guarantees and certificates for precious materials.",
    },
    {
      id: 6,
      icon: <ContactSupport sx={ICON_STYLES(theme)} />,
      title: "Contact Information",
      content:
        "For questions, contact us at support@gem-heart.com or through our WhatsApp support channel.",
    },
  ];

  /**
   * Render all term cards from the termItems array
   */
  const renderTermCards = (): JSX.Element[] => {
    return termItems.map((item) => (
      <TermCard key={item.id} icon={item.icon} title={item.title}>
        {item.content}
      </TermCard>
    ));
  };

  return (
    <Box sx={PAGE_CONTAINER_STYLES(theme)}>
      <Container maxWidth="lg" sx={CONTAINER_STYLES}>
        {/* Page Header */}
        <Box sx={HEADER_CONTAINER_STYLES}>
          <Typography
            variant="h2"
            gutterBottom
            sx={createTitleStyles(accentColor)}
          >
            Terms and Conditions
          </Typography>
          <Chip
            label={`Last updated: ${getFormattedDate()}`}
            color="primary"
            variant="outlined"
            sx={CHIP_STYLES(theme)}
          />
        </Box>

        {/* Terms Grid */}
        <Box sx={GRID_CONTAINER_STYLES}>{renderTermCards()}</Box>
      </Container>
    </Box>
  );
};

export default TermsPage;
