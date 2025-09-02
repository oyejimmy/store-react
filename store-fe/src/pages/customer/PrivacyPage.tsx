import React from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Info,
  Settings,
  Share,
  Security,
  Cookie,
  AccountBox,
} from "@mui/icons-material";

const PrivacyPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          gutterBottom
          sx={{ color: "primary.main", fontWeight: 800 }}
        >
          Privacy Policy
        </Typography>
        <Chip
          label={`Last updated: ${new Date().toLocaleDateString()}`}
          color="primary"
          variant="outlined"
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
        }}
      >
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Info sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Information We Collect
              </Typography>
            </Box>
            <Typography variant="body1">
              We collect your name, email, phone number, and shipping address
              when you create an account or place orders.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Settings sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                How We Use Information
              </Typography>
            </Box>
            <Typography variant="body1">
              • Process jewelry orders
              <br />
              • Send order updates
              <br />
              • Provide customer support
              <br />• Send promotional offers
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Share sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Information Sharing
              </Typography>
            </Box>
            <Typography variant="body1">
              We don&apos;t sell your data. We only share with shipping
              partners, payment processors, and legal authorities when required.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Security sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Data Security
              </Typography>
            </Box>
            <Typography variant="body1">
              Industry-standard security measures protect your information. All
              transactions are encrypted and secure.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Cookie sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Cookies & Tracking
              </Typography>
            </Box>
            <Typography variant="body1">
              We use cookies to enhance your shopping experience and analyze
              website traffic. You can disable them in browser settings.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <AccountBox sx={{ mr: 2, color: "primary.main" }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Your Rights
              </Typography>
            </Box>
            <Typography variant="body1">
              • Access and update your information
              <br />
              • Delete your account
              <br />
              • Opt-out of marketing
              <br />• Request data copy
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default PrivacyPage;
