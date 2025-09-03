import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper,
  Chip,
  Container,
  Fade,
  Slide,
  Grow,
} from "@mui/material";
import {
  Favorite,
  Star,
  Security,
  Group,
  Diamond,
  History,
  TrackChanges as TargetIcon,
  Palette as EcoIcon,
  EmojiEvents,
  Brush,
  LocalShipping,
  SupportAgent,
  Palette,
  Handshake,
  TrendingUp,
  Psychology,
  Celebration,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { COLORS } from "../../utils/contstant";

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const accentColor =
    theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;

  const FeatureCard = ({ icon, title, description, delay }: any) => (
    <Grow in={true} timeout={1000} style={{ transitionDelay: `${delay}ms` }}>
      <Card
        sx={{
          height: "100%",
          textAlign: "center",
          borderRadius: 3,
          transition: "all 0.3s ease",
          background:
            theme.palette.mode === "light"
              ? "linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)"
              : "linear-gradient(145deg, #1E293B 0%, #0F172A 100%)",
          boxShadow: theme.shadows[4],
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: theme.shadows[8],
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              color: theme.palette.primary.main,
              fontSize: 48,
              mb: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.6 }}
          >
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Grow>
  );

  const ValueItem = ({ icon, title, description }: any) => (
    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
      <Box
        sx={{
          color: theme.palette.primary.main,
          mr: 2,
          mt: 0.5,
          fontSize: 24,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="h6"
          component="span"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          {title}:
        </Typography>
        <Typography
          variant="body1"
          display="block"
          sx={{ color: theme.palette.text.secondary, mt: 0.5 }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        pt: 12,
        pb: 8,
        transition: "background-color 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Diamond
                sx={{ fontSize: 60, color: theme.palette.primary.main }}
              />
            </Box>
            <Typography
              variant="h1"
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
              About Gem Heart
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: "auto",
                mb: 3,
              }}
            >
              Crafting elegance, one piece at a time
            </Typography>
            <Chip
              icon={<History />}
              label={`Established ${new Date().getFullYear() - 10}`}
              variant="outlined"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              }}
            />
          </Box>
        </Fade>

        {/* Story & Mission Section */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} lg={6}>
            <Slide direction="right" in={true} timeout={800}>
              <Paper
                sx={{
                  p: 5,
                  height: "100%",
                  borderRadius: 4,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Brush
                    sx={{
                      mr: 2,
                      color: theme.palette.primary.main,
                      fontSize: 32,
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    Our Story
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}
                >
                  Founded with a passion for creating beautiful jewelry that
                  tells a story, Saiyaara has been at the forefront of jewelry
                  craftsmanship for over a decade. Our journey began with a
                  simple dream: to make elegant, high-quality jewelry accessible
                  to everyone.
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}
                >
                  Today, we continue to blend traditional craftsmanship with
                  modern design, creating pieces that are not just accessories,
                  but expressions of individuality and style. Every piece in our
                  collection is carefully crafted to ensure the highest quality
                  and timeless beauty.
                </Typography>
              </Paper>
            </Slide>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Slide direction="left" in={true} timeout={800}>
              <Paper
                sx={{
                  p: 5,
                  height: "100%",
                  borderRadius: 4,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <TargetIcon
                    sx={{
                      mr: 2,
                      color: theme.palette.primary.main,
                      fontSize: 32,
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    Our Mission
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}
                >
                  At Saiyaara, our mission is to provide exceptional jewelry
                  that combines contemporary design with traditional
                  craftsmanship. We believe that every piece should tell a story
                  and create lasting memories.
                </Typography>
                <Box sx={{ mt: 3 }}>
                  {[
                    {
                      icon: <EmojiEvents />,
                      text: "Highest quality materials and craftsmanship",
                    },
                    {
                      icon: <SupportAgent />,
                      text: "Exceptional customer service",
                    },
                    {
                      icon: <TrendingUp />,
                      text: "Timeless designs that never go out of style",
                    },
                    {
                      icon: <EcoIcon />,
                      text: "Sustainable and ethical practices",
                    },
                  ].map((item, index) => (
                    <Box
                      key={index}
                      sx={{ display: "flex", alignItems: "center", mb: 2 }}
                    >
                      <Box sx={{ color: theme.palette.primary.main, mr: 2 }}>
                        {item.icon}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Slide>
          </Grid>
        </Grid>

        <Divider sx={{ my: 8 }}>
          <Diamond sx={{ color: theme.palette.primary.main, mx: 2 }} />
        </Divider>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Fade in={true} timeout={1000}>
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                fontWeight: 700,
                mb: 6,
                background:
                  theme.palette.mode === "light"
                    ? `linear-gradient(135deg, ${COLORS.deepNavy} 0%, #4C4A73 100%)`
                    : `linear-gradient(135deg, ${COLORS.offWhite} 0%, ${COLORS.silver} 100%)`,
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Why Choose Saiyaara?
            </Typography>
          </Fade>

          <Grid container spacing={3}>
            {[
              {
                icon: <Favorite />,
                title: "Quality Craftsmanship",
                description:
                  "Every piece is crafted with meticulous attention to detail using the finest materials available",
              },
              {
                icon: <Star />,
                title: "Timeless Design",
                description:
                  "Our designs transcend trends to create pieces that remain beautiful for generations",
              },
              {
                icon: <Security />,
                title: "Trusted Quality",
                description:
                  "Rigorous quality standards ensure every piece meets our exacting requirements",
              },
              {
                icon: <Group />,
                title: "Expert Artisans",
                description:
                  "Master craftsmen with decades of experience bring each design to life",
              },
              {
                icon: <LocalShipping />,
                title: "Fast Delivery",
                description:
                  "Quick and reliable shipping with careful packaging to protect your jewelry",
              },
              {
                icon: <Psychology />,
                title: "Innovative Design",
                description:
                  "Continuous innovation in techniques and styles to bring you unique pieces",
              },
              {
                icon: <Celebration />,
                title: "Celebration Ready",
                description:
                  "Perfect pieces for every special occasion and milestone in life",
              },
              {
                icon: <Palette />,
                title: "Diverse Collection",
                description:
                  "Wide range of styles to suit every taste and personality",
              },
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <FeatureCard {...feature} delay={index * 100} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider sx={{ my: 8 }}>
          <Diamond sx={{ color: theme.palette.primary.main, mx: 2 }} />
        </Divider>

        {/* Values & Commitment Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} lg={6}>
            <Fade in={true} timeout={1000}>
              <Paper
                sx={{
                  p: 5,
                  borderRadius: 4,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <Handshake
                    sx={{
                      mr: 2,
                      color: theme.palette.primary.main,
                      fontSize: 32,
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    Our Values
                  </Typography>
                </Box>
                {[
                  {
                    icon: <Favorite />,
                    title: "Quality",
                    description:
                      "We never compromise on quality, ensuring every piece meets our exacting standards",
                  },
                  {
                    icon: <Security />,
                    title: "Integrity",
                    description:
                      "Honest, transparent business practices with respect for our customers and artisans",
                  },
                  {
                    icon: <Psychology />,
                    title: "Innovation",
                    description:
                      "Continuous improvement in design and craftsmanship to bring you the best",
                  },
                  {
                    icon: <Group />,
                    title: "Community",
                    description:
                      "Building lasting relationships with our customers and supporting our artisan communities",
                  },
                ].map((value, index) => (
                  <ValueItem key={index} {...value} />
                ))}
              </Paper>
            </Fade>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Fade in={true} timeout={1000}>
              <Paper
                sx={{
                  p: 5,
                  borderRadius: 4,
                  background: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                  <TargetIcon
                    sx={{
                      mr: 2,
                      color: theme.palette.primary.main,
                      fontSize: 32,
                    }}
                  />
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                  >
                    Our Commitment
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}
                >
                  We are committed to providing an exceptional experience from
                  browsing to unboxing. Your satisfaction is our priority, and
                  we strive to exceed expectations at every step.
                </Typography>
                <Typography
                  variant="body1"
                  paragraph
                  sx={{ lineHeight: 1.8, color: theme.palette.text.secondary }}
                >
                  Our commitment extends beyond transactions - we want to be
                  part of your special moments, helping you celebrate life's
                  beautiful occasions with pieces that reflect your unique
                  style.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.8,
                    color: theme.palette.text.secondary,
                    fontStyle: "italic",
                  }}
                >
                  Thank you for choosing Saiyaara. We're honored to be part of
                  your jewelry journey.
                </Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutPage;
