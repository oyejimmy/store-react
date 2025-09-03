import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../../store/slices/cartSlice";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Typography,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  useTheme,
  Chip,
  Fade,
  Slide,
  Grow,
  Zoom,
  Container,
  Badge,
  Avatar,
  Tooltip,
} from "@mui/material";
import {
  Delete,
  ShoppingBag,
  ArrowBack,
  Add,
  Remove,
  LocalShipping,
  Security,
  Diamond,
  ShoppingCartCheckout,
  FavoriteBorder,
  CompareArrows,
  Visibility,
  Inventory,
  Discount,
} from "@mui/icons-material";
import { COLORS } from "../../utils/contstant";

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { items } = useSelector((state: RootState) => state.cart);
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
  const [itemToRemove, setItemToRemove] = React.useState<number | null>(null);

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0 && quantity <= 99) {
      dispatch(updateQuantity({ itemId: productId, quantity }));
    }
  };

  const handleIncrement = (productId: number, currentQuantity: number) => {
    if (currentQuantity < 99) {
      dispatch(
        updateQuantity({ itemId: productId, quantity: currentQuantity + 1 })
      );
    }
  };

  const handleDecrement = (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(
        updateQuantity({ itemId: productId, quantity: currentQuantity - 1 })
      );
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
    setRemoveDialogOpen(false);
    setItemToRemove(null);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setClearDialogOpen(false);
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate("/checkout");
    }
  };

  const handleQuickView = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  // Calculate subtotal, savings, and total
  const { subtotal, totalSavings } = items.reduce(
    (acc, item) => {
      const itemTotal = item.offer_price 
        ? item.offer_price * item.quantity 
        : item.price * item.quantity;
      const originalTotal = item.price * item.quantity;
      const itemSavings = item.offer_price 
        ? (item.price - item.offer_price) * item.quantity 
        : 0;
      
      return {
        subtotal: acc.subtotal + itemTotal,
        totalSavings: acc.totalSavings + itemSavings
      };
    },
    { subtotal: 0, totalSavings: 0 }
  );
  
  const shipping = subtotal > 2999 ? 0 : 150;
  const total = subtotal + shipping;

  if (items.length === 0) {
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
        <Container maxWidth="md">
          <Fade in={true} timeout={800}>
            <Box sx={{ textAlign: "center", py: 10, px: 3 }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  mb: 3,
                }}
              >
                <ShoppingBag
                  sx={{
                    fontSize: 80,
                    color: COLORS.deepNavy,
                    mb: 3,
                  }}
                />
                <Badge
                  badgeContent="0"
                  color="error"
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    "& .MuiBadge-badge": {
                      fontSize: "1rem",
                      height: 30,
                      minWidth: 30,
                      borderRadius: "50%",
                      backgroundColor: COLORS.accent,
                    },
                  }}
                />
              </Box>
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.accent} 100%)`,
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 2,
                }}
              >
                Your Cart is Empty
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ mb: 4, maxWidth: 400, mx: "auto" }}
              >
                Discover our beautiful jewelry collection and find something
                special
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate("/shop")}
                startIcon={<Diamond />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1.1rem",
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.accent} 100%)`,
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 8px 25px ${COLORS.accent}40`,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Start Shopping
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>
    );
  }

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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Fade in={true} timeout={800}>
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(-1)}
              sx={{
                mb: 3,
                borderRadius: 2,
                color: theme.palette.text.primary,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Continue Shopping
            </Button>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Typography
                variant="h3"
                sx={{
                  textAlign: "center",
                  color: theme.palette.text.primary,
                  mb: 5,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  textShadow: `2px 2px 4px ${COLORS.deepNavy}40`,
                  fontSize: { xs: "2rem", md: "3rem" },
                  letterSpacing: "2px",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    display: "block",
                    width: "100px",
                    height: "2px",
                    background: `linear-gradient(90deg, transparent, ${COLORS.deepNavy}, transparent)`,
                    margin: "10px auto 0",
                    boxShadow: `0 2px 10px ${COLORS.deepNavy}40`,
                  },
                }}
              >
                Shopping Cart
              </Typography>
              <Chip
                label={`${items.reduce((total, item) => total + item.quantity, 0)} items`}
                sx={{
                  fontSize: "1rem",
                  py: 1,
                  background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.accent} 100%)`,
                  color: "white",
                  fontWeight: "bold",
                }}
              />
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            {items.map((item, index) => (
              <Grow
                in={true}
                timeout={800}
                key={item.id}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: theme.shadows[8],
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Box
                          sx={{
                            position: "relative",
                            borderRadius: 2,
                            overflow: "hidden",
                            cursor: "pointer",
                          }}
                          onClick={() => handleQuickView(item.id)}
                        >
                          <Box
                            component="img"
                            src={
                              item.image_url ||
                              "https://via.placeholder.com/150x150?text=Jewelry"
                            }
                            alt={item.name}
                            sx={{
                              width: "100%",
                              height: 120,
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.1)",
                              },
                            }}
                          />
                          <Box
                            sx={{
                              position: "absolute",
                              top: 8,
                              left: 8,
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            {item.offer_price && (
                              <Chip
                                label={`${Math.round(
                                  (1 - item.offer_price / item.price) * 100
                                )}% OFF`}
                                size="small"
                                sx={{
                                  backgroundColor: COLORS.accent,
                                  color: "white",
                                  fontWeight: "bold",
                                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                  animation: "pulse 2s infinite",
                                  "@keyframes pulse": {
                                    "0%": { transform: "scale(1)" },
                                    "50%": { transform: "scale(1.05)" },
                                    "100%": { transform: "scale(1)" },
                                  },
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            cursor: "pointer",
                            "&:hover": {
                              color: COLORS.deepNavy,
                            },
                          }}
                          onClick={() => handleQuickView(item.id)}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          Premium Quality Jewelry
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            flexWrap: "wrap",
                            mb: 1,
                          }}
                        >
                          <Chip
                            label={item.category || "Jewelry"}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: COLORS.deepNavy,
                              color: COLORS.deepNavy,
                            }}
                          />
                          {item.stock && (
                            <Chip
                              icon={<Inventory sx={{ fontSize: 16 }} />}
                              label="In Stock"
                              size="small"
                              variant="filled"
                              color="success"
                            />
                          )}
                        </Box>

                        {/* Quick Actions */}
                        <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                          <Tooltip title="Add to Wishlist">
                            <IconButton
                              size="small"
                              sx={{ color: COLORS.accent }}
                            >
                              <FavoriteBorder fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Compare">
                            <IconButton
                              size="small"
                              sx={{ color: COLORS.deepNavy }}
                            >
                              <CompareArrows fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Quick View">
                            <IconButton
                              size="small"
                              sx={{ color: COLORS.silver }}
                              onClick={() => handleQuickView(item.id)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              {item.offer_price ? (
                                <>
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: COLORS.accent,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {formatCurrency(item.offer_price)}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      textDecoration: "line-through",
                                      color: COLORS.silver,
                                    }}
                                  >
                                    {formatCurrency(item.price)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: COLORS.success,
                                      fontWeight: 600,
                                      display: 'block',
                                    }}
                                  >
                                    Save {formatCurrency(item.price - item.offer_price)}
                                  </Typography>
                                </>
                              ) : (
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: COLORS.deepNavy,
                                    fontWeight: 600,
                                  }}
                                >
                                  {formatCurrency(item.price)}
                                </Typography>
                              )}
                            </Box>

                            <IconButton
                              sx={{
                                color: COLORS.accent,
                                "&:hover": {
                                  backgroundColor: COLORS.accent,
                                  color: "white",
                                },
                              }}
                              onClick={() => {
                                setItemToRemove(item.id);
                                setRemoveDialogOpen(true);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Box>

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              justifyContent: "center",
                              p: 1,
                              backgroundColor: theme.palette.action.hover,
                              borderRadius: 2,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleDecrement(item.id, item.quantity)
                              }
                              disabled={item.quantity <= 1}
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                "&:hover": {
                                  backgroundColor: COLORS.deepNavy,
                                  color: "white",
                                },
                              }}
                            >
                              <Remove />
                            </IconButton>

                            <TextField
                              size="small"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = Math.max(
                                  1,
                                  Math.min(99, parseInt(e.target.value) || 1)
                                );
                                handleQuantityChange(item.id, value);
                              }}
                              inputProps={{
                                style: {
                                  textAlign: "center",
                                  width: "50px",
                                  fontWeight: 600,
                                  color: COLORS.deepNavy,
                                },
                                min: 1,
                                max: 99,
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                  "& fieldset": {
                                    borderColor: theme.palette.divider,
                                  },
                                },
                              }}
                            />

                            <IconButton
                              size="small"
                              onClick={() =>
                                handleIncrement(item.id, item.quantity)
                              }
                              disabled={item.quantity >= 99}
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                "&:hover": {
                                  backgroundColor: COLORS.deepNavy,
                                  color: "white",
                                },
                              }}
                            >
                              <Add />
                            </IconButton>
                          </Box>

                          <Box sx={{ textAlign: 'center' }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                color: COLORS.deepNavy,
                                p: 1,
                                backgroundColor: theme.palette.action.selected,
                                borderRadius: 2,
                              }}
                            >
                              Total: {formatCurrency(
                                item.offer_price 
                                  ? item.offer_price * item.quantity 
                                  : item.price * item.quantity
                              )}
                              {item.offer_price && (
                                <Typography
                                  component="span"
                                  variant="caption"
                                  sx={{
                                    display: 'block',
                                    color: COLORS.success,
                                    fontWeight: 600,
                                    mt: 0.5,
                                  }}
                                >
                                  Save {formatCurrency((item.price - item.offer_price) * item.quantity)}
                                </Typography>
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grow>
            ))}

            <Fade in={true} timeout={800} style={{ transitionDelay: "400ms" }}>
              <Box sx={{ textAlign: "right", mt: 3 }}>
                <Button
                  color="error"
                  variant="outlined"
                  onClick={() => setClearDialogOpen(true)}
                  startIcon={<Delete />}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    borderColor: COLORS.accent,
                    color: COLORS.accent,
                    "&:hover": {
                      backgroundColor: COLORS.accent,
                      color: "white",
                    },
                  }}
                >
                  Clear Entire Cart
                </Button>
              </Box>
            </Fade>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Slide direction="left" in={true} timeout={800}>
              <Paper
                sx={{
                  p: 4,
                  position: "sticky",
                  top: 24,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: `0 8px 32px ${COLORS.deepNavy}20`,
                  background:
                    theme.palette.mode === "light"
                      ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${COLORS.offWhite} 100%)`
                      : undefined,
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    color: COLORS.deepNavy,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <ShoppingBag sx={{ color: COLORS.accent }} />
                  Order Summary
                </Typography>
                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="body1">
                    Subtotal ({items.length} items):
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={COLORS.deepNavy}
                  >
                    {formatCurrency(subtotal)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocalShipping
                      sx={{ fontSize: 20, color: COLORS.silver }}
                    />
                    <Typography variant="body1">Shipping:</Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={shipping === 0 ? COLORS.success : COLORS.deepNavy}
                  >
                    {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                  </Typography>
                </Box>

                {shipping === 0 && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      backgroundColor: COLORS.success + "20",
                      borderRadius: 2,
                      border: `1px solid ${COLORS.success}30`,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: COLORS.success,
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <Discount sx={{ fontSize: 20 }} />
                      🎉 Free shipping on orders over PKR 2,999!
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Total Savings */}
                {totalSavings > 0 && (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1">You Save:</Typography>
                      <Typography variant="body1" sx={{ color: COLORS.success, fontWeight: 600 }}>
                        -{formatCurrency(totalSavings)}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        mb: 2,
                        p: 1.5,
                        backgroundColor: COLORS.success + '15',
                        borderRadius: 2,
                        border: `1px solid ${COLORS.success}30`,
                      }}
                    >
                      <Typography variant="body2" sx={{ color: COLORS.success, textAlign: 'center' }}>
                        🎉 You're saving {formatCurrency(totalSavings)} on this order!
                      </Typography>
                    </Box>
                  </>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 4,
                  }}
                >
                  <Typography variant="h6" color={COLORS.deepNavy}>
                    Total Amount:
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: COLORS.accent,
                      fontWeight: 700,
                    }}
                  >
                    {formatCurrency(total)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleCheckout}
                  startIcon={<ShoppingCartCheckout />}
                  sx={{
                    py: 1.5,
                    borderRadius: 3,
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, ${COLORS.accent} 100%)`,
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 8px 25px ${COLORS.accent}40`,
                    },
                    transition: "all 0.3s ease",
                    mb: 2,
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    mt: 2,
                    p: 2,
                    backgroundColor: theme.palette.action.hover,
                    borderRadius: 2,
                  }}
                >
                  <Security sx={{ fontSize: 20, color: COLORS.success }} />
                  <Typography
                    variant="body2"
                    color={COLORS.silver}
                    sx={{ textAlign: "center" }}
                  >
                    Secure checkout with SSL encryption
                  </Typography>
                </Box>

                {/* Promo Code Section */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    backgroundColor: theme.palette.action.selected,
                    borderRadius: 2,
                    border: `1px dashed ${COLORS.silver}50`,
                  }}
                >
                  <Typography
                    variant="body2"
                    color={COLORS.deepNavy}
                    gutterBottom
                  >
                    Have a promo code?
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Enter code"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: 2,
                        borderColor: COLORS.deepNavy,
                        color: COLORS.deepNavy,
                        "&:hover": {
                          backgroundColor: COLORS.deepNavy,
                          color: "white",
                        },
                      }}
                    >
                      Apply
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Slide>
          </Grid>
        </Grid>

        {/* Remove Item Dialog */}
        <Dialog
          open={removeDialogOpen}
          onClose={() => setRemoveDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <DialogTitle sx={{ color: COLORS.deepNavy, fontWeight: 600 }}>
            <Delete sx={{ mr: 1, color: COLORS.accent }} />
            Remove Item
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: theme.palette.text.secondary, mt: 1 }}>
              Are you sure you want to remove this item from your cart?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setRemoveDialogOpen(false)}
              sx={{ borderRadius: 2, color: COLORS.silver }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => itemToRemove && handleRemoveItem(itemToRemove)}
              variant="contained"
              sx={{
                borderRadius: 2,
                backgroundColor: COLORS.accent,
                "&:hover": {
                  backgroundColor: COLORS.accent,
                  opacity: 0.9,
                },
              }}
            >
              Remove Item
            </Button>
          </DialogActions>
        </Dialog>

        {/* Clear Cart Dialog */}
        <Dialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <DialogTitle sx={{ color: COLORS.deepNavy, fontWeight: 600 }}>
            <Delete sx={{ mr: 1, color: COLORS.accent }} />
            Clear Shopping Cart
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: theme.palette.text.secondary, mt: 1 }}>
              Are you sure you want to remove all items from your cart? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setClearDialogOpen(false)}
              sx={{ borderRadius: 2, color: COLORS.silver }}
            >
              Keep Items
            </Button>
            <Button
              onClick={handleClearCart}
              variant="contained"
              sx={{
                borderRadius: 2,
                backgroundColor: COLORS.accent,
                "&:hover": {
                  backgroundColor: COLORS.accent,
                  opacity: 0.9,
                },
              }}
            >
              Clear All Items
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default CartPage;
