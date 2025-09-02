import React from "react";
import {
  Container,
  Grid,
  Typography,
  Card,
  useTheme,
  Box,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

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
    },
    {
      name: "Bangles",
      link: "/shop?category=bangles",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=300&fit=crop",
    },
    {
      name: "Bracelets",
      link: "/shop?category=bracelets",
      image:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=300&fit=crop",
    },
    {
      name: "Combos",
      link: "/shop?category=combos",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    },
    {
      name: "Ear Studs",
      link: "/shop?category=ear-studs",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=300&fit=crop",
    },
    {
      name: "Earrings",
      link: "/shop?category=earrings",
      image:
        "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&h=300&fit=crop",
    },
    {
      name: "Hoops",
      link: "/shop?category=hoops",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop",
    },
    {
      name: "Pendants",
      link: "/shop?category=pendants",
      image:
        "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=400&h=300&fit=crop",
    },
    {
      name: "Rings",
      link: "/shop?category=rings",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    },
    {
      name: "Wall Frame Design",
      link: "/shop?category=wall-frames",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    },
    {
      name: "Under 299",
      link: "/offers/under-299",
      image:
        "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop",
    },
    {
      name: "Special Deals",
      link: "/offers/special-deals",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    },
    {
      name: "Deal of the Month",
      link: "/offers/deal-of-month",
      image:
        "https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400&h=300&fit=crop",
    },
  ];

  // Get colors from theme instead of hardcoded values
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
      <IconButton
        onClick={toggleTheme}
        sx={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 1000,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          boxShadow: theme.shadows[3],
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark" ? "#94A3B8" : "#141238",
            color: theme.palette.mode === "dark" ? "#1E1B4B" : "#F8FAFC",
          },
        }}
      >
        {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>

      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 8,
            fontWeight: "bold",
            textTransform: "uppercase",
            textShadow: `2px 2px 4px ${accentColor}40`,
            fontSize: { xs: "2rem", md: "3rem" },
            letterSpacing: "2px",
            color: primaryColor,
            position: "relative",
            "&::after": {
              content: '""',
              display: "block",
              width: "100px",
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              margin: "20px auto 0",
              boxShadow: `0 2px 10px ${accentColor}40`,
            },
          }}
        >
          All Collections
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.name}>
              <Box
                component={Link}
                to={category.link}
                sx={{
                  textDecoration: "none",
                  display: "block",
                }}
              >
                <Card
                  sx={{
                    position: "relative",
                    height: 280,
                    borderRadius: "20px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.5s ease",
                    boxShadow: theme.shadows[4],
                    border: `2px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.1)"
                        : "rgba(0, 0, 0, 0.1)"
                    }`,
                    "&:hover": {
                      transform: "translateY(-12px) scale(1.02)",
                      boxShadow: theme.shadows[10],
                      borderColor: accentColor,
                      "& .category-overlay": {
                        background: `linear-gradient(45deg, ${accentColor}85, rgba(184, 134, 11, 0.85))`,
                      },
                      "& .category-arrow": {
                        transform: "translateX(8px)",
                        color: accentColor,
                      },
                    },
                  }}
                >
                  <Box
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
                        "linear-gradient(45deg, rgba(0,0,0,0.4), rgba(0,0,0,0.6))",
                      transition: "all 0.4s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "24px",
                      zIndex: 2,
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
                          color: "#ffffff",
                          fontWeight: 600,
                          fontSize: "18px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {category.name}
                      </Typography>
                      <Box
                        className="category-arrow"
                        sx={{
                          color: "#d4af37",
                          fontSize: "24px",
                          fontWeight: "bold",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        →
                      </Box>
                    </Box>
                  </Box>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CategoriesPage;
