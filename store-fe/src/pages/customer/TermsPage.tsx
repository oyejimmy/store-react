import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  useTheme,
} from "@mui/material";
import {
  Gavel,
  Store,
  Payment,
  Autorenew,
  Verified,
  ContactSupport,
} from "@mui/icons-material";
import { COLORS } from "../../utils/contstant";

const TermsPage: React.FC = () => {
  const theme = useTheme();
  const accentColor =
    theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        p: 3,
        overflow: "hidden",
        transition: "background-color 0.3s ease",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              textAlign: "center",
              color: theme.palette.text.primary,
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
            }}
          >
            Terms and Conditions
          </Typography>
          <Chip
            label={`Last updated: ${new Date().toLocaleDateString()}`}
            color="primary"
            variant="outlined"
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              transition: "all 0.3s ease",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gap: 3,
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          }}
        >
          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              transition: "background-color 0.3s ease, border-color 0.3s ease",
              "&:hover": {
                boxShadow: theme.shadows[4],
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Gavel sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  Introduction
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  transition: "color 0.3s ease",
                }}
              >
                Welcome to Gem-Heart Jewelry Store. These Terms and Conditions
                govern your use of our website and services.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              transition: "background-color 0.3s ease, border-color 0.3s ease",
              "&:hover": {
                boxShadow: theme.shadows[4],
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Store sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  Products & Services
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  transition: "color 0.3s ease",
                }}
              >
                Gem-Heart specializes in premium jewelry including rings,
                earrings, bangles, anklets, bracelets, pendants, and hair
                accessories.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              transition: "background-color 0.3s ease, border-color 0.3s ease",
              "&:hover": {
                boxShadow: theme.shadows[4],
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Payment sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  Orders & Payment
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  transition: "color 0.3s ease",
                }}
              >
                • Orders processed within 1-2 business days
                <br />
                • COD and online payments accepted
                <br />• Free shipping on orders above PKR 2999
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              transition: "background-color 0.3s ease, border-color 0.3s ease",
              "&:hover": {
                boxShadow: theme.shadows[4],
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Autorenew sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  Return Policy
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  transition: "color 0.3s ease",
                }}
              >
                • 7-day return policy for unused items
                <br />
                • Exchange available for size adjustments
                <br />• Custom orders are non-returnable
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              transition: "background-color 0.3s ease, border-color 0.3s ease",
              "&:hover": {
                boxShadow: theme.shadows[4],
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Verified sx={{ mr: 2, color: theme.palette.primary.main }} />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  Quality Assurance
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  transition: "color 0.3s ease",
                }}
              >
                All jewelry undergoes strict quality checks with authenticity
                guarantees and certificates for precious materials.
              </Typography>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              transition: "background-color 0.3s ease, border-color 0.3s ease",
              "&:hover": {
                boxShadow: theme.shadows[4],
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ContactSupport
                  sx={{ mr: 2, color: theme.palette.primary.main }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  Contact Information
                </Typography>
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  transition: "color 0.3s ease",
                }}
              >
                For questions, contact us at support@gem-heart.com or through
                our WhatsApp support channel.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsPage;
