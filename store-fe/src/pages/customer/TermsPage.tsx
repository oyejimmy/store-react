import React from 'react';
import { Container, Typography, Box, Card, CardContent, Chip, Divider } from '@mui/material';
import { Gavel, Store, Payment, Autorenew, Verified, Shield, ContactSupport } from '@mui/icons-material';

const TermsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom sx={{ color: 'primary.main', fontWeight: 800 }}>
          Terms and Conditions
        </Typography>
        <Chip label={`Last updated: ${new Date().toLocaleDateString()}`} color="primary" variant="outlined" />
      </Box>

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' } }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Gavel sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Introduction</Typography>
            </Box>
            <Typography variant="body1">
              Welcome to Gem-Heart Jewelry Store. These Terms and Conditions govern your use of our website and services.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Store sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Products & Services</Typography>
            </Box>
            <Typography variant="body1">
              Gem-Heart specializes in premium jewelry including rings, earrings, bangles, anklets, bracelets, pendants, and hair accessories.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Payment sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Orders & Payment</Typography>
            </Box>
            <Typography variant="body1">
              • Orders processed within 1-2 business days<br/>
              • COD and online payments accepted<br/>
              • Free shipping on orders above PKR 2999
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Autorenew sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Return Policy</Typography>
            </Box>
            <Typography variant="body1">
              • 7-day return policy for unused items<br/>
              • Exchange available for size adjustments<br/>
              • Custom orders are non-returnable
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Verified sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Quality Assurance</Typography>
            </Box>
            <Typography variant="body1">
              All jewelry undergoes strict quality checks with authenticity guarantees and certificates for precious materials.
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ContactSupport sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h5" sx={{ fontWeight: 600 }}>Contact Information</Typography>
            </Box>
            <Typography variant="body1">
              For questions, contact us at support@gem-heart.com or through our WhatsApp support channel.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default TermsPage;