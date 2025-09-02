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
} from "@mui/icons-material";

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

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
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
              <ShoppingBag
                sx={{
                  fontSize: 80,
                  color: theme.palette.primary.main,
                  mb: 3,
                  opacity: 0.8,
                }}
              />
              <Typography
                variant="h3"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  background:
                    theme.palette.mode === "light"
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #4C4A73 100%)`
                      : `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, #CBD5E1 100%)`,
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
                  backgroundColor: theme.palette.primary.main,
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                    transform: "translateY(-2px)",
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
              <ShoppingBag
                sx={{ fontSize: 40, color: theme.palette.primary.main }}
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background:
                    theme.palette.mode === "light"
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #4C4A73 100%)`
                      : `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, #CBD5E1 100%)`,
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Shopping Cart
              </Typography>
              <Chip
                label={`${items.length} items`}
                color="primary"
                variant="filled"
                sx={{ fontSize: "1rem", py: 1 }}
              />
            </Box>
          </Box>
        </Fade>

        <Grid container spacing={3}>
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
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={3}>
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
                            borderRadius: 2,
                            transition: "transform 0.3s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <Typography
                          variant="h6"
                          gutterBottom
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                          }}
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
                        <Chip
                          label={item.category || "Jewelry"}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                          }}
                        />
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
                            <Typography
                              variant="h6"
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: 600,
                              }}
                            >
                              {formatCurrency(item.price)}
                            </Typography>

                            <IconButton
                              color="error"
                              onClick={() => {
                                setItemToRemove(item.id);
                                setRemoveDialogOpen(true);
                              }}
                              sx={{
                                "&:hover": {
                                  backgroundColor: theme.palette.error.main,
                                  color: theme.palette.error.contrastText,
                                },
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
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                "&:hover": {
                                  backgroundColor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText,
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
                                },
                                min: 1,
                                max: 99,
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />

                            <IconButton
                              size="small"
                              onClick={() =>
                                handleQuantityChange(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= 99}
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                "&:hover": {
                                  backgroundColor: theme.palette.primary.main,
                                  color: theme.palette.primary.contrastText,
                                },
                              }}
                            >
                              <Add />
                            </IconButton>
                          </Box>

                          <Typography
                            variant="subtitle1"
                            sx={{
                              textAlign: "center",
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            Total: {formatCurrency(item.price * item.quantity)}
                          </Typography>
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
                    "&:hover": {
                      backgroundColor: theme.palette.error.main,
                      color: theme.palette.error.contrastText,
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
                  boxShadow: theme.shadows[4],
                }}
              >
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                >
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
                  <Typography variant="body1" fontWeight={600}>
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
                      sx={{ fontSize: 20, color: theme.palette.text.secondary }}
                    />
                    <Typography variant="body1">Shipping:</Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    fontWeight={600}
                    color={shipping === 0 ? "success.main" : "text.primary"}
                  >
                    {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                  </Typography>
                </Box>

                {shipping === 0 && (
                  <Box
                    sx={{
                      mb: 3,
                      p: 2,
                      backgroundColor: theme.palette.success.light,
                      borderRadius: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.success.dark,
                        textAlign: "center",
                      }}
                    >
                      🎉 Free shipping on orders over PKR 2,999!
                    </Typography>
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 4,
                  }}
                >
                  <Typography variant="h6">Total Amount:</Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      color: theme.palette.primary.main,
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
                    backgroundColor: theme.palette.primary.main,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                      transform: "translateY(-2px)",
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
                  }}
                >
                  <Security
                    sx={{ fontSize: 20, color: theme.palette.success.main }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center" }}
                  >
                    Secure checkout with SSL encryption
                  </Typography>
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
          <DialogTitle
            sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
          >
            Remove Item
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              Are you sure you want to remove this item from your cart?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setRemoveDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => itemToRemove && handleRemoveItem(itemToRemove)}
              color="error"
              variant="contained"
              sx={{ borderRadius: 2 }}
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
          <DialogTitle
            sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
          >
            Clear Shopping Cart
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: theme.palette.text.secondary }}>
              Are you sure you want to remove all items from your cart? This
              action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setClearDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Keep Items
            </Button>
            <Button
              onClick={handleClearCart}
              color="error"
              variant="contained"
              sx={{ borderRadius: 2 }}
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
