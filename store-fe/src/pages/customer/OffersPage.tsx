import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchOffersByType } from "../../store/slices/offerSlice";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Box,
  useTheme,
  CircularProgress,
  Fade,
  Slide,
  Grow,
  Divider,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart,
  FavoriteBorder,
  LocalFireDepartment,
  Visibility,
  ArrowForward,
  LocalOffer,
  AccessTime,
} from "@mui/icons-material";
import { accentColor } from "../../utils/helpers";

const OffersPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { offers, loading } = useSelector((state: RootState) => state.offers);
  const theme = useTheme();

  useEffect(() => {
    if (type) {
      dispatch(fetchOffersByType(type));
    }
  }, [dispatch, type]);

  const getOfferTitle = (type: string) => {
    switch (type) {
      case "under-299":
        return "Under 299PKR";
      case "special-deals":
        return "Special Deals";
      case "deal-of-month":
        return "Deal of the Month";
      default:
        return "Special Offers";
    }
  };

  const getOfferDescription = (type: string) => {
    switch (type) {
      case "under-299":
        return "Amazing jewelry pieces under 299PKR. Perfect for gifting or treating yourself!";
      case "special-deals":
        return "Limited time offers on our premium jewelry collection. Don't miss out!";
      case "deal-of-month":
        return "This month's featured deals on our most popular jewelry items.";
      default:
        return "Discover amazing offers on our jewelry collection.";
    }
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    if (originalPrice > currentPrice) {
      return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        py: 6,
        transition: "background-color 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Fade in={true} timeout={800}>
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
                p: 3,
                mx: "auto",
                backgroundColor: theme.palette.background.default,
              }}
            >
              <Typography
                variant="h2"
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
                {getOfferTitle(type || "")}
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                margin: "0 auto",
                mb: 3,
              }}
            >
              {getOfferDescription(type || "")}
            </Typography>
            <Chip
              icon={<LocalOffer />}
              label={`${offers.length} Offers Available`}
              variant="outlined"
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                fontWeight: 500,
              }}
            />
          </Box>
        </Fade>

        {offers.length === 0 ? (
          <Fade in={true} timeout={800}>
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                color: theme.palette.text.secondary,
              }}
            >
              <LocalFireDepartment sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h5" gutterBottom>
                No offers available at the moment
              </Typography>
              <Typography variant="body1">
                Check back later for new offers and promotions
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Grid container spacing={4}>
            {offers.map((offer: any, index: number) => {
              const discount = calculateDiscount(
                offer.original_price,
                offer.price
              );

              return (
                <Grid item xs={12} sm={6} md={4} key={offer.id}>
                  <Grow
                    in={true}
                    timeout={1000}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 3,
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: theme.shadows[8],
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      {/* Discount Badge */}
                      {discount > 0 && (
                        <Chip
                          label={`${discount}% OFF`}
                          color="error"
                          sx={{
                            position: "absolute",
                            top: 12,
                            left: 12,
                            zIndex: 2,
                            fontWeight: "bold",
                          }}
                        />
                      )}

                      {/* Favorite Button */}
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          zIndex: 2,
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                          },
                        }}
                      >
                        <FavoriteBorder />
                      </IconButton>

                      <CardMedia
                        component="img"
                        height="240"
                        image={
                          offer.image_url ||
                          "https://via.placeholder.com/300x200?text=Product+Image"
                        }
                        alt={offer.title}
                        sx={{
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 1,
                            minHeight: 64,
                          }}
                        >
                          {offer.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.text.secondary,
                            mb: 2,
                            minHeight: 40,
                          }}
                        >
                          {offer.description}
                        </Typography>

                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 2 }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: "bold",
                              color: theme.palette.primary.main,
                            }}
                          >
                            ₹{offer.price}
                          </Typography>
                          {offer.original_price > offer.price && (
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: "line-through",
                                color: theme.palette.text.secondary,
                                ml: 1,
                              }}
                            >
                              ₹{offer.original_price}
                            </Typography>
                          )}
                        </Box>

                        {offer.valid_until && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 2,
                              p: 1,
                              backgroundColor:
                                theme.palette.mode === "dark"
                                  ? "rgba(255, 255, 255, 0.05)"
                                  : "rgba(0, 0, 0, 0.02)",
                              borderRadius: 1,
                            }}
                          >
                            <AccessTime
                              sx={{
                                fontSize: 16,
                                color: theme.palette.text.secondary,
                                mr: 1,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: theme.palette.text.secondary }}
                            >
                              Valid until:{" "}
                              {new Date(offer.valid_until).toLocaleDateString()}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      <Divider />

                      <CardActions
                        sx={{ p: 2, justifyContent: "space-between" }}
                      >
                        <Button
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          size="small"
                          sx={{
                            borderRadius: 2,
                            px: 2,
                            backgroundColor: theme.palette.primary.main,
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            },
                          }}
                        >
                          Add to Cart
                        </Button>
                        <Button
                          variant="outlined"
                          endIcon={<Visibility />}
                          size="small"
                          sx={{
                            borderRadius: 2,
                            px: 2,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            "&:hover": {
                              backgroundColor: theme.palette.primary.main,
                              color: theme.palette.primary.contrastText,
                            },
                          }}
                        >
                          Details
                        </Button>
                      </CardActions>
                    </Card>
                  </Grow>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Quick Navigation */}
        {offers.length > 0 && (
          <Fade in={true} timeout={1000} style={{ transitionDelay: "500ms" }}>
            <Box sx={{ textAlign: "center", mt: 8, p: 4 }}>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary, mb: 2 }}
              >
                Explore More Collections
              </Typography>
              <Button
                variant="outlined"
                endIcon={<ArrowForward />}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  py: 1,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                }}
              >
                View All Products
              </Button>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default OffersPage;
