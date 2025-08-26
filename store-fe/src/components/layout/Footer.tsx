import React from "react";
import { Box, Grid, Typography, Link as MuiLink, useTheme, Container, IconButton } from '@mui/material';
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Diamond,
} from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.mode === 'light' ? '#2c3e50' : '#1a1a1a',
        color: 'white',
        mt: 'auto',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="flex-start">
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Diamond sx={{ color: theme.palette.primary.main, mr: 1, fontSize: 32 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                Gem-Heart
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3, lineHeight: 1.6 }}>
              True treasure handpicked from the most exceptional sources around the globe.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                component={MuiLink}
                href="https://instagram.com/gem-heart"
                target="_blank"
                sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component={MuiLink}
                href="https://facebook.com/gem-heart"
                target="_blank"
                sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: 'white' } }}
              >
                <Facebook />
              </IconButton>
            </Box>
          </Grid>

          {/* Links Sections */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontSize: '1rem' }}>
              Products
            </Typography>
            {['Rings', 'Earrings', 'Bangles', 'Pendants'].map((item) => (
              <Typography
                key={item}
                component={Link}
                to={`/shop/${item.toLowerCase()}`}
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  mb: 1,
                  '&:hover': { color: 'white' },
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontSize: '1rem' }}>
              Services
            </Typography>
            {['Shop', 'Contact', 'About Us', 'Cart'].map((item) => (
              <Typography
                key={item}
                component={Link}
                to={item === 'Shop' ? '/shop' : item === 'Contact' ? '/contact' : item === 'About Us' ? '/about' : '/cart'}
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  mb: 1,
                  '&:hover': { color: 'white' },
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontSize: '1rem' }}>
              About Us
            </Typography>
            {['Contact Us', 'Blogs', 'Privacy Policy', 'Terms and Conditions'].map((item) => (
              <Typography
                key={item}
                component={Link}
                to={item === 'Contact Us' ? '/contact' : item === 'Privacy Policy' ? '/privacy' : item === 'Terms and Conditions' ? '/terms' : '/about'}
                variant="body2"
                sx={{
                  display: 'block',
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  mb: 1,
                  '&:hover': { color: 'white' },
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', pt: 3, mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {new Date().getFullYear()} ©Ceylon. All Rights Reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;