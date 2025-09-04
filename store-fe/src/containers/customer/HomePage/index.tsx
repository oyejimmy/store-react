import { useEffect, useState } from "react";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import SwipeableViews, { SwipeableViewsProps } from "react-swipeable-views";
import { autoPlay, AutoPlayProps } from "react-swipeable-views-utils";

interface AutoPlaySwipeableViewsProps extends SwipeableViewsProps, AutoPlayProps {}

const AutoPlaySwipeableViews = autoPlay(
  ({ children, ...props }: AutoPlaySwipeableViewsProps) => (
    <SwipeableViews {...props}>
      {children}
    </SwipeableViews>
  )
);
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
  IconButton,
  Rating,
  Skeleton,
  Fade,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
// import { AppDispatch, RootState } from "../../store";
import { fetchProducts } from "../../../store/slices/productSlice";
import { fetchOffersByType } from "../../../store/slices/offerSlice";
import { ShoppingCart, FavoriteBorder, Visibility } from "@mui/icons-material";
import { COLORS } from "../../../utils/constant";

const HomePage = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  // Banner slides data - Jewelry Collection
  const bannerSlides = [
    {
      title: "Elegant Rings",
      subtitle: "Discover our exquisite collection of rings",
      cta: "Shop Rings",
      link: "/shop?category=rings",
      image:
        "https://images.unsplash.com/photo-1700062409662-756e8c4bcc73?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonStyle: {
        bg: "rgba(0, 0, 0, 0.8)",
        text: "#ffffff",
      },
    },
    {
      title: "Chic Earrings",
      subtitle: "Enhance your beauty with our earrings",
      cta: "View Earrings",
      link: "/shop?category=earrings",
      image:
        "https://images.unsplash.com/photo-1608613381851-6a058de0dc11?q=80&w=1211&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonStyle: {
        bg: "rgba(255, 255, 255, 0.9)",
        text: "#000000",
      },
    },
    {
      title: "Luxury Bangles",
      subtitle: "Adorn your wrists with elegance",
      cta: "Explore Bangles",
      link: "/shop?category=bangles",
      image:
        "https://images.unsplash.com/photo-1724720790533-160d6280fd81?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonStyle: {
        bg: "rgba(0, 0, 0, 0.8)",
        text: "#ffffff",
      },
    },
    {
      title: "Delicate Anklets",
      subtitle: "Subtle beauty for your feet",
      cta: "Discover Anklets",
      link: "/shop?category=anklets",
      image:
        "https://images.unsplash.com/photo-1588658163621-f853df4bbe86?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonStyle: {
        bg: "rgba(255, 255, 255, 0.9)",
        text: "#000000",
      },
    },
    {
      title: "Stylish Bracelets",
      subtitle: "Timeless pieces for every occasion",
      cta: "View Bracelets",
      link: "/shop?category=bracelets",
      image:
        "https://images.unsplash.com/photo-1663243821443-2b8cb9e48265?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonStyle: {
        bg: "rgba(0, 0, 0, 0.8)",
        text: "#ffffff",
      },
    },
    {
      title: "Elegant Pendants",
      subtitle: "Make a statement with our pendants",
      cta: "Shop Pendants",
      link: "/shop?category=pendants",
      image:
        "https://images.unsplash.com/photo-1718903540435-82dc0fb4138d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonStyle: {
        bg: "rgba(255, 255, 255, 0.9)",
        text: "#000000",
      },
    },
    {
      title: "Chic Hoops",
      subtitle: "Classic hoops for every style",
      cta: "View Hoops",
      link: "/shop?category=hoops",
      image:
        "https://images.unsplash.com/photo-1710552524021-a8dc68c2a8dc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonStyle: {
        bg: "rgba(0, 0, 0, 0.8)",
        text: "#ffffff",
      },
    },
    {
      title: "Dainty Ear Studs",
      subtitle: "Subtle sparkle for everyday wear",
      cta: "Shop Studs",
      link: "/shop?category=ear-studs",
      image:
        "https://images.unsplash.com/photo-1677737774935-4b849e887bc2?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      buttonStyle: {
        bg: "rgba(255, 255, 255, 0.9)",
        text: "#000000",
      },
    },
  ];

  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = bannerSlides.length;

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + maxSteps) % maxSteps);
  };

  const handleStepChange = (step: number) => {
    setActiveStep(step);
  };

  // Define color variables based on the current theme mode
  const primaryColor =
    theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;
  const secondaryColor =
    theme.palette.mode === "light" ? COLORS.offWhite : COLORS.deepNavy;
  const accentColor =
    theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;
  const textColor =
    theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;

  useEffect(() => {
    // Fetch products using Redux thunk
    const fetchInitialData = async () => {
      try {
        // Fetch products with a limit of 8 items
        await dispatch(fetchProducts({ limit: 8 }));

        // Fetch special offers
        await Promise.all([
          dispatch(fetchOffersByType("under_299")),
          dispatch(fetchOffersByType("special_deals")),
          dispatch(fetchOffersByType("deal_of_month")),
        ]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // const retryFetch = () => {
  //   dispatch(fetchProducts({ limit: 8 }));
  // };

  // Keep the bannerSlides array with the first declaration only
  //     title: "Elegant Jewelry Collection",
  //     subtitle: "Discover our stunning collection of handcrafted jewelry",
  //     cta: "Shop Now",
  //     link: "/shop",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200",
  //     title: "Special Offers Under PKR 299",
  //     subtitle: "Limited time deals on selected jewelry pieces",
  //     cta: "View Offers",
  //     link: "/offers/under-299",
  //   },
  //   {
  //     image:
  //       "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200",
  //     title: "New Arrivals",
  //     subtitle: "Latest designs in rings, earrings, and more",
  //     cta: "Explore",
  //     link: "/shop",
  //   },
  // ];

  const categories = [
    {
      name: "Rings",
      icon: "💍",
      link: "/shop?category=rings",
      gradient: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      image:
        "https://images.unsplash.com/photo-1572635149010-ffd9c657c5f9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&fit=crop",
    },
    {
      name: "Earrings",
      icon: "👂",
      link: "/shop?category=earrings",
      gradient: "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
      image:
        "https://images.unsplash.com/photo-1602173576902-6bc1c0155b7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&fit=crop",
    },
    {
      name: "Bangles",
      icon: "💫",
      link: "/shop?category=bangles",
      gradient: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
      image:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&fit=crop",
    },
    {
      name: "Anklets",
      icon: "🦶",
      link: "/shop?category=anklets",
      gradient: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      image:
        "https://images.unsplash.com/photo-1611591437281-4608be1ad011?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&fit=crop",
    },
    {
      name: "Bracelets",
      icon: "💎",
      link: "/shop?category=bracelets",
      gradient: "linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)",
      image:
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&fit=crop",
    },
    {
      name: "Pendants",
      icon: "✨",
      link: "/shop?category=pendants",
      gradient: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
      image:
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&fit=crop",
    },
  ];

  // Calculate discount percentage
  const calculateDiscount = (product: any) => {
    const originalPrice = product.original_price || product.retail_price;
    const currentPrice =
      product.offer_price || product.price || product.retail_price;
    if (originalPrice > currentPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return 0;
  };

  // Render featured products section with loading states
  const renderFeaturedProducts = () => {
    if (loading) {
      return (
        <Grid container spacing={4}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                <Skeleton variant="rectangular" height={280} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={24} width="60%" />
                  <Skeleton variant="text" height={20} width="40%" />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" width={120} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (products.length === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No featured products available
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Check back later for new arrivals
          </Typography>
        </Box>
      );
    }

    return (
      <Grid container spacing={4}>
        {products.slice(0, 6).map((product: any) => {
          const discount = calculateDiscount(product);
          const isOutOfStock =
            (product.stock_quantity || product.stock || 0) === 0;

          return (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Fade in={true} timeout={800}>
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
                        ? COLORS.offWhite
                        : `linear-gradient(145deg, ${COLORS.deepNavy}20, ${COLORS.deepNavy}40)`,
                    border: `1px solid ${COLORS.silver}30`,
                    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
                    position: "relative",
                    "&:hover": {
                      transform: "translateY(-12px) scale(1.02)",
                      boxShadow: `0 20px 40px ${COLORS.deepNavy}20`,
                      borderColor: COLORS.deepNavy,
                      "& .product-image": {
                        transform: "scale(1.05)",
                      },
                    },
                  }}
                >
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <Chip
                      label={`${discount}% OFF`}
                      sx={{
                        position: "absolute",
                        top: 12,
                        left: 12,
                        backgroundColor: COLORS.accent,
                        color: "white",
                        fontWeight: "bold",
                        zIndex: 2,
                      }}
                    />
                  )}

                  {/* Out of Stock Overlay */}
                  {isOutOfStock && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 3,
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: COLORS.accent,
                          padding: "16px",
                          borderRadius: "50px",
                          border: `2px solid ${COLORS.deepNavy}`,
                          transform: "rotate(-5deg)",
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: "white",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          Out of Stock
                        </Typography>
                      </Box>
                    </Box>
                  )}

                  <CardMedia
                    component="img"
                    className="product-image"
                    height="280"
                    image={
                      product.images?.[0] ||
                      "https://via.placeholder.com/300x200?text=Product+Image"
                    }
                    alt={product.name}
                    sx={{
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                      filter: isOutOfStock ? "blur(2px)" : "none",
                    }}
                  />

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: textColor,
                          fontWeight: 600,
                          mb: 1.5,
                          flex: 1,
                        }}
                      >
                        {product.name}
                      </Typography>
                      <IconButton
                        size="small"
                        sx={{ color: COLORS.accent }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // Add to wishlist functionality
                        }}
                      >
                        <FavoriteBorder />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Rating
                        value={4.5}
                        precision={0.5}
                        readOnly
                        size="small"
                        sx={{ color: COLORS.warning, mb: 1 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: COLORS.silver, mb: 2 }}
                      >
                        {product.sold || 0} sold •{" "}
                        {product.stock_quantity || product.stock || 0} in stock
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{
                          fontSize: "1.25rem",
                          fontWeight: 600,
                          color: textColor,
                          letterSpacing: "0.5px",
                        }}
                      >
                        PKR{" "}
                        {product.offer_price ||
                          product.price ||
                          product.retail_price}
                      </Typography>
                      {discount > 0 && (
                        <Typography
                          component="span"
                          sx={{
                            textDecoration: "line-through",
                            ml: 1.5,
                            color: COLORS.silver,
                            fontSize: "1rem",
                          }}
                        >
                          PKR {product.original_price || product.retail_price}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label={product.category || product.type || "Jewelry"}
                        size="small"
                        sx={{
                          backgroundColor: COLORS.deepNavy,
                          color: COLORS.offWhite,
                          fontWeight: 500,
                        }}
                      />
                      {product.delivery_charges === 0 && (
                        <Chip
                          label="Free Delivery"
                          size="small"
                          sx={{
                            backgroundColor: COLORS.success,
                            color: "white",
                          }}
                        />
                      )}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCart />}
                      disabled={isOutOfStock}
                      sx={{
                        borderRadius: "25px",
                        px: 3,
                        borderColor: COLORS.offWhite,
                        backgroundColor: COLORS.deepNavy,
                        color: COLORS.offWhite,
                        "&:hover": {
                          backgroundColor: COLORS.offWhite,
                          color: COLORS.deepNavy,
                          opacity: 0.9,
                        },
                        "&:disabled": {
                          backgroundColor: COLORS.silver,
                        },
                      }}
                    >
                      Add to Cart
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Visibility />}
                      sx={{
                        borderRadius: "25px",
                        px: 3,
                        borderColor: COLORS.offWhite,
                        color: COLORS.offWhite,
                        "&:hover": {
                          backgroundColor: COLORS.offWhite,
                          color: COLORS.deepNavy,
                        },
                      }}
                    >
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          theme.palette.mode === "light"
            ? COLORS.offWhite
            : `linear-gradient(135deg, ${COLORS.deepNavy} 0%, #2A2A57 50%, ${COLORS.deepNavy} 100%)`,
      }}
    >
      {/* Banner Section */}
      <Box sx={{ mb: 10, position: "relative" }}>
        <Box sx={{ position: "relative" }}>
          <AutoPlaySwipeableViews
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
            autoplay
            interval={5000}
            springConfig={{
              duration: '0.7s',
              easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)',
              delay: '0s'
            }}
            style={{ height: "80vh" }}
          >
            {bannerSlides.map((slide, index) => (
              <Box
                key={index}
                sx={{
                  height: "80vh",
                  background: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${slide.image})`,
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
                      fontWeight: 700,
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                      opacity: 0,
                      transform: "translateY(20px)",
                      animation: "fadeInUp 0.8s ease forwards",
                      animationDelay: "0.3s",
                      "@keyframes fadeInUp": {
                        to: {
                          opacity: 1,
                          transform: "translateY(0)",
                        },
                      },
                    }}
                  >
                    {slide.title}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ffffff",
                      mb: 3,
                      fontSize: { xs: "1rem", md: "1.25rem" },
                      textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                      opacity: 0,
                      transform: "translateY(20px)",
                      animation: "fadeInUp 0.8s ease forwards",
                      animationDelay: "0.5s",
                    }}
                  >
                    {slide.subtitle}
                  </Typography>
                  <Button
                    component={Link}
                    to={slide.link}
                    variant="contained"
                    size="large"
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: "1.1rem",
                      backgroundColor: primaryColor,
                      color: secondaryColor,
                      opacity: 0,
                      transform: "translateY(20px)",
                      animation: "fadeInUp 0.8s ease forwards",
                      animationDelay: "0.7s",
                    }}
                  >
                    {slide.cta}
                  </Button>
                </Box>
              </Box>
            ))}
          </AutoPlaySwipeableViews>

          {/* Navigation Arrows */}
          <IconButton
            onClick={handleBack}
            sx={{
              position: "absolute",
              left: 20,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
              zIndex: 2,
            }}
          >
            <KeyboardArrowLeft fontSize="large" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              backgroundColor: "rgba(0,0,0,0.3)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.5)",
              },
              zIndex: 2,
            }}
          >
            <KeyboardArrowRight fontSize="large" />
          </IconButton>

          {/* Dots Indicator */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 1,
              zIndex: 2,
            }}
          >
            {bannerSlides.map((_, index) => (
              <Box
                key={index}
                onClick={() => handleStepChange(index)}
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor:
                    activeStep === index
                      ? primaryColor
                      : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Categories Section */}
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
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                  border: `2px solid ${COLORS.silver}30`,
                  "&:hover": {
                    transform: "translateY(-15px) scale(1.03)",
                    boxShadow: `0 25px 50px ${COLORS.deepNavy}20`,
                    borderColor: COLORS.deepNavy,
                    "& .category-title": {
                      transform: "translateY(-15px) scale(1.1)",
                      color: "white",
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
                    background: `linear-gradient(45deg, ${COLORS.deepNavy}80, ${COLORS.deepNavy}80)`,
                    transition: "all 0.4s ease",
                    opacity: 0,
                    "&:hover": {
                      opacity: 1,
                    },
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
                      color: COLORS.offWhite,
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

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ mb: 12, py: 10 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 8,
            fontWeight: "bold",
            textTransform: "uppercase",
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

        {renderFeaturedProducts()}

        {!loading && products.length > 0 && (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <Button
              component={Link}
              to="/shop"
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
              VIEW ALL PRODUCTS
            </Button>
          </Box>
        )}
      </Container>

      {/* Special Offers */}
      <Container maxWidth="lg" sx={{ mb: 12, py: 10 }}>
        <Typography
          variant="h2"
          sx={{
            textAlign: "center",
            mb: 8,
            fontWeight: 700,
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            letterSpacing: "1px",
            color: primaryColor,
            position: "relative",
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              top: "50%",
              width: { xs: "30px", md: "60px" },
              height: "2px",
              background: `linear-gradient(90deg, transparent, ${accentColor})`,
            },
            "&::before": {
              left: { xs: "10%", md: "20%" },
            },
            "&::after": {
              right: { xs: "10%", md: "20%" },
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
            },
          }}
        >
          Special Offers
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "Under PKR 299",
              description: "Beautiful jewelry pieces at unbeatable prices",
              cta: "SHOP NOW",
              link: "/offers/under-299",
              image:
                "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=300&fit=crop",
              icon: "✨",
              gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            },
            {
              title: "Special Deals",
              description: "Limited time offers on premium collections",
              cta: "GRAB DEALS",
              link: "/offers/special-deals",
              image:
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
              icon: "🔥",
              gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            },
            {
              title: "Deal of the Month",
              description: "Exclusive monthly offers on trending pieces",
              cta: "EXPLORE NOW",
              link: "/offers/deal-of-month",
              image:
                "https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400&h=300&fit=crop",
              icon: "💎",
              gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            },
          ].map((offer, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                component={Link}
                to={offer.link}
                sx={{
                  textAlign: "center",
                  borderRadius: "25px",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  overflow: "hidden",
                  textDecoration: "none",
                  background:
                    theme.palette.mode === "light"
                      ? "#fff"
                      : `linear-gradient(145deg, ${COLORS.deepNavy}20, ${COLORS.deepNavy}40)`,
                  border: "none",
                  boxShadow:
                    theme.palette.mode === "light"
                      ? "0 15px 35px rgba(0, 0, 0, 0.1)"
                      : "0 15px 35px rgba(0, 0, 0, 0.25)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  "&:hover": {
                    transform: "translateY(-15px)",
                    boxShadow: `0 25px 50px ${accentColor}30`,
                    "& .offer-image": {
                      transform: "scale(1.1)",
                    },
                    "& .offer-button": {
                      background: primaryColor,
                      color: secondaryColor,
                      boxShadow: `0 10px 20px ${primaryColor}40`,
                    },
                  },
                }}
              >
                {/* Ribbon for special badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 20,
                    right: -30,
                    background: accentColor,
                    color: "white",
                    padding: "5px 40px",
                    transform: "rotate(45deg)",
                    fontSize: "14px",
                    fontWeight: "bold",
                    zIndex: 1,
                    boxShadow: `0 2px 10px ${accentColor}80`,
                  }}
                >
                  SALE
                </Box>

                <Box
                  className="offer-image"
                  sx={{
                    height: "220px",
                    background: `url(${offer.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "relative",
                    transition: "transform 0.5s ease",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: offer.gradient,
                      opacity: 0.7,
                      mixBlendMode: "multiply",
                    },
                  }}
                />

                <CardContent
                  sx={{
                    p: 4,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: offer.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      fontSize: "24px",
                      boxShadow: `0 5px 15px ${accentColor}40`,
                    }}
                  >
                    {offer.icon}
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      mb: 2,
                      color: primaryColor,
                      fontWeight: 700,
                      fontSize: "1.75rem",
                    }}
                  >
                    {offer.title}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color:
                        theme.palette.mode === "light"
                          ? COLORS.silver
                          : COLORS.offWhite,
                      flexGrow: 1,
                    }}
                  >
                    {offer.description}
                  </Typography>

                  <Button
                    className="offer-button"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderRadius: "50px",
                      fontWeight: "bold",
                      px: 4,
                      py: 1.5,
                      borderWidth: "2px",
                      borderColor: primaryColor,
                      color: primaryColor,
                      background: "transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: primaryColor,
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
