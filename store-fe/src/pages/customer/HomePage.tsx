import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Typography,
  Chip,
  Container,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchProducts } from "../../store/slices/productSlice";
import { fetchOffersByType } from "../../store/slices/offerSlice";

const HomePage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);

  // Define color variables based on the current theme mode
  const primaryColor = theme.palette.mode === "light" ? "#1E1B4B" : "#F8FAFC";
  const secondaryColor = theme.palette.mode === "light" ? "#F8FAFC" : "#1E1B4B";
  const accentColor = theme.palette.mode === "light" ? "#1E1B4B" : "#F8FAFC";

  useEffect(() => {
    // Fetch featured products
    dispatch(fetchProducts({ limit: 8 }));

    // Fetch special offers
    dispatch(fetchOffersByType("under_299"));
    dispatch(fetchOffersByType("special_deals"));
    dispatch(fetchOffersByType("deal_of_month"));
  }, [dispatch]);

  const bannerSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200",
      title: "Elegant Jewelry Collection",
      subtitle: "Discover our stunning collection of handcrafted jewelry",
      cta: "Shop Now",
      link: "/shop",
    },
    {
      image:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200",
      title: "Special Offers Under PKR 299",
      subtitle: "Limited time deals on selected jewelry pieces",
      cta: "View Offers",
      link: "/offers/under-299",
    },
    {
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200",
      title: "New Arrivals",
      subtitle: "Latest designs in rings, earrings, and more",
      cta: "Explore",
      link: "/shop",
    },
  ];

  const categories = [
    {
      name: "Rings",
      icon: "💍",
      link: "/shop?category=rings",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      image:
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop",
    },
    {
      name: "Earrings",
      icon: "👂",
      link: "/shop?category=earrings",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=200&fit=crop",
    },
    {
      name: "Bangles",
      icon: "💫",
      link: "/shop?category=bangles",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      image:
        "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=300&h=200&fit=crop",
    },
    {
      name: "Anklets",
      icon: "🦶",
      link: "/shop?category=anklets",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      image:
        "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=300&h=200&fit=crop",
    },
    {
      name: "Bracelets",
      icon: "💎",
      link: "/shop?category=bracelets",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      image:
        "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=300&h=200&fit=crop",
    },
    {
      name: "Pendants",
      icon: "✨",
      link: "/shop?category=pendants",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=200&fit=crop",
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? secondaryColor
            : "linear-gradient(135deg, #1E1B4B 0%, #2A2A57 50%, #1E1B4B 100%)",
      }}
    >
      {/* Banner Section */}
      <Box sx={{ mb: 10 }}>
        <Box
          sx={{
            height: "80vh",
            background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${bannerSlides[0].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            textAlign: "center",
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, #d4af37, transparent)",
            },
          }}
        >
          <Box>
            <Typography
              variant="h1"
              sx={{
                color: "#ffffff",
                mb: 2,
                fontSize: { xs: "2rem", md: "3.5rem" },
                fontWeight: 300,
              }}
            >
              {bannerSlides[0].title}
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "#ffffff",
                mb: 3,
                fontSize: { xs: "1rem", md: "1.25rem" },
              }}
            >
              {bannerSlides[0].subtitle}
            </Typography>
            <Button
              component={Link}
              to={bannerSlides[0].link}
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                backgroundColor: primaryColor,
                color: secondaryColor,
              }}
            >
              {bannerSlides[0].cta}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Categories */}
      <Container maxWidth="lg" sx={{ mb: 12, py: 10 }}>
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
          Shop by Category →
        </Typography>
        <Grid container spacing={4}>
          {categories.slice(0, 6).map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.name}>
              <Box
                component={Link}
                to={category.link}
                sx={{
                  position: "relative",
                  height: "320px",
                  borderRadius: "25px",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.5s ease",
                  display: "block",
                  textDecoration: "none",
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 10px 30px rgba(0, 0, 0, 0.1)"
                      : "0 10px 30px rgba(0, 0, 0, 0.4)",
                  border:
                    theme.palette.mode === "light"
                      ? "2px solid #e8e8e8"
                      : `2px solid ${primaryColor}`,
                  "&:hover": {
                    transform: "translateY(-15px) scale(1.03)",
                    boxShadow: `0 25px 50px ${accentColor}40`,
                    borderColor: accentColor,
                    "& .category-overlay": {
                      background: `linear-gradient(45deg, ${accentColor}d9, ${accentColor}d9)`,
                    },
                    "& .category-title": {
                      transform: "translateY(-15px) scale(1.1)",
                      color: secondaryColor,
                    },
                  },
                }}
              >
                <Box
                  component="img"
                  src={category.image}
                  alt={category.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
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
                    transition: "all 0.4s ease",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 2.5,
                    zIndex: 2,
                  }}
                >
                  <Typography
                    className="category-title"
                    variant="h5"
                    sx={{
                      margin: 0,
                      color: primaryColor,
                      fontWeight: 400,
                      letterSpacing: "1px",
                      transition: "all 0.4s ease",
                    }}
                  >
                    {category.name} →
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Button
            component={Link}
            to="/categories"
            variant="outlined"
            size="large"
            sx={{
              borderRadius: "50px",
              px: 8,
              py: 2,
              fontSize: "16px",
              fontWeight: 400,
              letterSpacing: "1px",
              borderWidth: "2px",
              color: primaryColor,
              borderColor: primaryColor,
              "&:hover": {
                borderWidth: "2px",
                background: primaryColor,
                color: secondaryColor,
              },
            }}
          >
            EXPLORE COLLECTION
          </Button>
        </Box>
      </Container>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 12, py: 10 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 8,
            fontWeight: 300,
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
          Featured Products →
        </Typography>
        <Grid container spacing={4}>
          {products.slice(0, 6).map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                component={Link}
                to={`/product/${product.id}`}
                sx={{
                  height: "100%",
                  borderRadius: "20px",
                  transition: "all 0.4s ease",
                  overflow: "hidden",
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  background:
                    theme.palette.mode === "light"
                      ? `linear-gradient(145deg, ${secondaryColor}, #F3F6F9)`
                      : `linear-gradient(145deg, ${secondaryColor}, #2A2A57)`,
                  border: `1px solid ${primaryColor}`,
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 8px 25px rgba(0, 0, 0, 0.08)"
                      : "0 8px 25px rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    transform: "translateY(-12px) scale(1.02)",
                    boxShadow: `0 20px 40px ${accentColor}30`,
                    borderColor: accentColor,
                    "& .product-image": {
                      transform: "scale(1.05)",
                    },
                  },
                }}
              >
                <CardMedia
                  component="img"
                  className="product-image"
                  height="280"
                  image={
                    product.images[0] ||
                    "https://via.placeholder.com/300x200?text=Product+Image"
                  }
                  alt={product.name}
                  sx={{
                    objectFit: "cover",
                    transition: "transform 0.4s ease",
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: primaryColor,
                      fontWeight: 600,
                      mb: 1.5,
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Box sx={{ mb: 1.5 }}>
                    <Typography
                      variant="h6"
                      component="span"
                      sx={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: primaryColor,
                        letterSpacing: "0.5px",
                      }}
                    >
                      PKR{" "}
                      {product.offer_price ||
                        product.price ||
                        product.retail_price}
                    </Typography>
                    {(product.original_price || product.retail_price) >
                      (product.offer_price ||
                        product.price ||
                        product.retail_price) && (
                      <Typography
                        component="span"
                        sx={{
                          textDecoration: "line-through",
                          ml: 1.5,
                          color: "text.secondary",
                          fontSize: "1rem",
                        }}
                      >
                        PKR {product.original_price || product.retail_price}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label={product.category}
                    sx={{
                      backgroundColor: primaryColor,
                      color: secondaryColor,
                      fontWeight: 500,
                    }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: "25px",
                      mx: "auto",
                      px: 3,
                      color: primaryColor,
                      borderColor: primaryColor,
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Special Offers */}
      <Container maxWidth="lg" sx={{ mb: 12, py: 10 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 8,
            fontWeight: 300,
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
          Special Offers
        </Typography>
        <Grid container spacing={2}>
          {[
            {
              title: "Under PKR 299",
              description: "Beautiful jewelry pieces at unbeatable prices",
              cta: "SHOP NOW ✨",
              link: "/offers/under-299",
              image:
                "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop",
            },
            {
              title: "Special Deals",
              description: "Limited time offers on premium collections",
              cta: "GRAB DEALS 🔥",
              link: "/offers/special-deals",
              image:
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop",
            },
            {
              title: "Deal of the Month",
              description: "Exclusive monthly offers on trending pieces",
              cta: "EXPLORE NOW 💎",
              link: "/offers/deal-of-month",
              image:
                "https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400&h=200&fit=crop",
            },
          ].map((offer, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                component={Link}
                to={offer.link}
                sx={{
                  textAlign: "center",
                  borderRadius: "25px",
                  transition: "all 0.5s ease",
                  overflow: "hidden",
                  textDecoration: "none",
                  background:
                    theme.palette.mode === "light"
                      ? `linear-gradient(145deg, ${secondaryColor}, #F3F6F9)`
                      : `linear-gradient(145deg, ${secondaryColor}, #2A2A57)`,
                  border: `2px solid ${primaryColor}`,
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 10px 30px rgba(0, 0, 0, 0.1)"
                      : "0 10px 30px rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    transform: "translateY(-10px) scale(1.03)",
                    boxShadow: `0 20px 40px ${accentColor}40`,
                  },
                }}
              >
                <Box
                  sx={{
                    height: "200px",
                    backgroundImage: `url(${offer.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(45deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))",
                    },
                  }}
                />
                <CardContent sx={{ p: 5 }}>
                  <Typography variant="h4" sx={{ mb: 2, color: primaryColor }}>
                    {offer.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, color: primaryColor }}
                  >
                    {offer.description}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      borderRadius: "25px",
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      backgroundColor: primaryColor,
                      color: secondaryColor,
                      "&:hover": {
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    {offer.cta}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Social Media Feed */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 8,
            fontWeight: 300,
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
          Follow Us on TikTok →
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {Array.from({ length: 6 }, (_, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  height: 400,
                  width: 180,
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                  background: "#000",
                  position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    background: `url(https://picsum.photos/180/400?random=${index}) center/cover`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.9)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      color: primaryColor,
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    ▶
                  </Box>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    color: secondaryColor,
                    fontSize: 12,
                    background: "rgba(0, 0, 0, 0.5)",
                    p: 0.5,
                    borderRadius: 1,
                  }}
                >
                  @jewelry_store
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
