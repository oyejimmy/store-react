import React from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  useTheme,
  Box,
  IconButton,
  Fade,
  Slide,
  Grow,
  Chip,
  Zoom,
} from "@mui/material";
import { Link } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  Diamond,
  ArrowForward,
  LocalOffer,
  TrendingUp,
  NewReleases,
} from "@mui/icons-material";

interface CategoriesPageProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const CategoriesPage: React.FC<CategoriesPageProps> = ({
  isDarkMode,
  toggleTheme,
}) => {
  const theme = useTheme();

  const categories = [
    {
      name: "Anklets",
      link: "/shop?category=anklets",
      image:
        "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=400&h=300&fit=crop",
      featured: false,
    },
    {
      name: "Bangles",
      link: "/shop?category=bangles",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=300&fit=crop",
      featured: false,
    },
    {
      name: "Bracelets",
      link: "/shop?category=bracelets",
      image:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop",
      featured: true,
    },
    {
      name: "Combos",
      link: "/shop?category=combos",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      featured: false,
    },
    {
      name: "Ear Studs",
      link: "/shop?category=ear-studs",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
      featured: false,
    },
    {
      name: "Earrings",
      link: "/shop?category=earrings",
      image:
        "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=300&fit=crop",
      featured: true,
    },
    {
      name: "Hoops",
      link: "/shop?category=hoops",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
      featured: false,
    },
    {
      name: "Pendants",
      link: "/shop?category=pendants",
      image:
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop",
      featured: true,
    },
    {
      name: "Rings",
      link: "/shop?category=rings",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
      featured: true,
    },
    {
      name: "Wall Frame Design",
      link: "/shop?category=wall-frames",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      featured: false,
    },
    {
      name: "Under 299",
      link: "/offers/under-299",
      image:
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop",
      featured: false,
      offer: true,
    },
    {
      name: "Special Deals",
      link: "/offers/special-deals",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      featured: false,
      offer: true,
    },
    {
      name: "Deal of the Month",
      link: "/offers/deal-of-month",
      image:
        "https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400&h=300&fit=crop",
      featured: false,
      offer: true,
    },
  ];

  const primaryColor = theme.palette.text.primary;
  const accentColor =
    theme.palette.mode === "dark" ? "#FF6B6B" : theme.palette.primary.main;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        padding: { xs: "80px 20px 40px", md: "100px 40px 60px" },
        transition: "all 0.3s ease",
      }}
    >
      {/* Theme Toggle Button */}
      <Zoom in={true} timeout={800}>
        <IconButton
          onClick={toggleTheme}
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            boxShadow: theme.shadows[4],
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark" ? "#94A3B8" : "#141238",
              color: theme.palette.mode === "dark" ? "#1E1B4B" : "#F8FAFC",
              transform: "scale(1.1)",
            },
            transition: "all 0.3s ease",
          }}
        >
          {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Zoom>

      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
              <Diamond sx={{ fontSize: 48, color: accentColor, mr: 2 }} />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  background:
                    theme.palette.mode === "light"
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #4C4A73 100%)`
                      : `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, #CBD5E1 100%)`,
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  letterSpacing: "3px",
                }}
              >
                All Collections
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: "auto",
                mb: 3,
              }}
            >
              Discover our exquisite jewelry collections crafted with passion
              and precision
            </Typography>
            <Chip
              icon={<Diamond />}
              label={`${categories.length} Collections Available`}
              variant="outlined"
              sx={{
                borderColor: accentColor,
                color: accentColor,
                fontWeight: 500,
              }}
            />
          </Box>
        </Fade>

        <Grid container spacing={4} justifyContent="center">
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={category.name}>
              <Grow
                in={true}
                timeout={1000}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Box
                  component={Link}
                  to={category.link}
                  sx={{
                    textDecoration: "none",
                    display: "block",
                    position: "relative",
                  }}
                >
                  {/* Featured Badge */}
                  {category.featured && (
                    <Chip
                      icon={<TrendingUp />}
                      label="Featured"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 3,
                        backgroundColor: theme.palette.success.main,
                        color: theme.palette.success.contrastText,
                        fontWeight: "bold",
                      }}
                    />
                  )}

                  {/* Offer Badge */}
                  {category.offer && (
                    <Chip
                      icon={<LocalOffer />}
                      label="Special Offer"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        zIndex: 3,
                        backgroundColor: theme.palette.error.main,
                        color: theme.palette.error.contrastText,
                        fontWeight: "bold",
                      }}
                    />
                  )}

                  <Card
                    sx={{
                      position: "relative",
                      height: 320,
                      borderRadius: "24px",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition:
                        "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      background: theme.palette.background.paper,
                      border: `2px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[4],
                      "&:hover": {
                        transform: "translateY(-12px) scale(1.02)",
                        boxShadow: theme.shadows[16],
                        borderColor: accentColor,
                        "& .category-overlay": {
                          background: `linear-gradient(45deg, ${accentColor}99, rgba(184, 134, 11, 0.8))`,
                          opacity: 0.9,
                        },
                        "& .category-arrow": {
                          transform: "translateX(8px) scale(1.2)",
                          color: theme.palette.common.white,
                        },
                        "& .category-image": {
                          transform: "scale(1.1)",
                        },
                      },
                    }}
                  >
                    <Box
                      className="category-image"
                      component="img"
                      alt={category.name}
                      src={category.image}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        transition: "transform 0.6s ease",
                      }}
                    />
                    <Box
                      className="category-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          "linear-gradient(45deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
                        transition: "all 0.4s ease",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "28px",
                        zIndex: 2,
                        background:
                          theme.palette.mode === "dark"
                            ? "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)"
                            : "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            margin: 0,
                            color: theme.palette.common.white,
                            fontWeight: 700,
                            fontSize: "20px",
                            letterSpacing: "0.5px",
                            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                            flex: 1,
                          }}
                        >
                          {category.name}
                        </Typography>
                        <Box
                          className="category-arrow"
                          sx={{
                            color: theme.palette.common.white,
                            fontSize: "28px",
                            fontWeight: "bold",
                            transition: "all 0.3s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: "rgba(255,255,255,0.2)",
                            backdropFilter: "blur(10px)",
                          }}
                        >
                          <ArrowForward sx={{ fontSize: "20px" }} />
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>

        {/* Footer CTA */}
        <Fade in={true} timeout={1000} style={{ transitionDelay: "1400ms" }}>
          <Box sx={{ textAlign: "center", mt: 8, p: 4 }}>
            <Typography
              variant="h5"
              sx={{
                color: theme.palette.text.primary,
                mb: 2,
                fontWeight: 600,
              }}
            >
              Can't find what you're looking for?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
                mb: 3,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Contact our jewelry experts for custom designs and special
              requests
            </Typography>
            <Chip
              icon={<NewReleases />}
              label="Custom Orders Available"
              color="primary"
              variant="filled"
              sx={{
                fontSize: "1rem",
                py: 2,
                px: 3,
              }}
            />
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CategoriesPage;
