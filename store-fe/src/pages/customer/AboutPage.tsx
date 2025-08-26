import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Paper } from '@mui/material';
import { Favorite, Star, Security, Group } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const AboutPage: React.FC = () => {
  const theme = useTheme();

  const FeatureCard = ({ icon, title, description }: any) => (
    <Card sx={{ height: '100%', textAlign: 'center' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ color: theme.palette.primary.main, fontSize: 48, mb: 2 }}>
          {icon}
        </Box>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          About Saiyaara
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Crafting elegance, one piece at a time
        </Typography>
      </Box>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Founded with a passion for creating beautiful jewelry that tells a story, 
              Saiyaara has been at the forefront of jewelry craftsmanship for over a decade. 
              Our journey began with a simple dream: to make elegant, high-quality jewelry 
              accessible to everyone.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Today, we continue to blend traditional craftsmanship with modern design, 
              creating pieces that are not just accessories, but expressions of individuality 
              and style. Every piece in our collection is carefully crafted to ensure the 
              highest quality and timeless beauty.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              At Saiyaara, our mission is to provide our customers with exceptional jewelry 
              that combines contemporary design with traditional craftsmanship. We believe 
              that every piece of jewelry should tell a story and create lasting memories.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              We are committed to:
            </Typography>
            <Box component="ul" sx={{ textAlign: 'left', lineHeight: 1.8 }}>
              <li>Offering the highest quality materials and craftsmanship</li>
              <li>Providing exceptional customer service</li>
              <li>Creating timeless designs that never go out of style</li>
              <li>Making luxury jewelry accessible to everyone</li>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ my: 6 }} />

      <Typography variant="h3" sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
        Why Choose Saiyaara?
      </Typography>

      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <FeatureCard
            icon={<Favorite />}
            title="Quality Craftsmanship"
            description="Every piece is crafted with attention to detail and the finest materials"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <FeatureCard
            icon={<Star />}
            title="Timeless Design"
            description="Our designs are created to be beautiful and relevant for years to come"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <FeatureCard
            icon={<Security />}
            title="Trusted Quality"
            description="We use only the highest quality materials and maintain strict quality standards"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <FeatureCard
            icon={<Group />}
            title="Expert Team"
            description="Our team of skilled artisans and designers bring years of experience"
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 6 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Our Values
            </Typography>
            <Box sx={{ textAlign: 'left' }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="span">Quality:</Typography>
                <Typography variant="body1" display="block">
                  We never compromise on quality, ensuring every piece meets our high standards.
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="span">Integrity:</Typography>
                <Typography variant="body1" display="block">
                  We conduct our business with honesty, transparency, and respect for our customers.
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" component="span">Innovation:</Typography>
                <Typography variant="body1" display="block">
                  We continuously innovate in design and craftsmanship to bring you the best.
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" component="span">Customer Focus:</Typography>
                <Typography variant="body1" display="block">
                  Your satisfaction is our priority, and we strive to exceed your expectations.
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 4, textAlign: 'center', height: '100%' }}>
            <Typography variant="h4" gutterBottom>
              Our Commitment
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              We are committed to providing you with an exceptional shopping experience 
              from the moment you visit our website to the day your jewelry arrives at 
              your doorstep.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Our commitment extends beyond just selling jewelry - we want to be part 
              of your special moments, helping you celebrate life's beautiful occasions 
              with pieces that reflect your unique style and personality.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Thank you for choosing Saiyaara. We look forward to being part of your 
              jewelry journey.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AboutPage;