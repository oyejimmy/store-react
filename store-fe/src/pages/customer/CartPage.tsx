import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
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
  Paper
} from '@mui/material';
import { 
  Delete,
  ShoppingBag,
  ArrowBack,
  Add,
  Remove
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { items } = useSelector((state: RootState) => state.cart);
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = React.useState(false);
  const [itemToRemove, setItemToRemove] = React.useState<number | null>(null);

  const handleQuantityChange = (productId: number, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ itemId: productId, quantity }));
    }
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
    alert('Item removed from cart');
    setRemoveDialogOpen(false);
    setItemToRemove(null);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    alert('Cart cleared');
    setClearDialogOpen(false);
  };

  const handleCheckout = () => {
    if (items.length > 0) {
      navigate('/checkout');
    } else {
      alert('Your cart is empty');
    }
  };

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
        <ShoppingBag sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Looks like you haven't added anything to your cart yet
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/shop')}>
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 2 }}
        >
          Continue Shopping
        </Button>
        <Typography variant="h4" gutterBottom>
          Shopping Cart ({items.length} items)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {items.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={3}>
                    <Box
                      component="img"
                      src={item.image_url}
                      alt={item.name}
                      sx={{
                        width: '100%',
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="h6" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Premium Quality
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                      ₹{item.price}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          if (value >= 1 && value <= 99) {
                            handleQuantityChange(item.id, value);
                          }
                        }}
                        inputProps={{ 
                          style: { textAlign: 'center', width: '40px' },
                          min: 1,
                          max: 99
                        }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 99}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={1}>
                    <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                      ₹{item.price * item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setItemToRemove(item.id);
                        setRemoveDialogOpen(true);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ textAlign: 'right', mt: 2 }}>
            <Button 
              color="error" 
              variant="outlined"
              onClick={() => setClearDialogOpen(true)}
            >
              Clear Cart
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal ({items.length} items):</Typography>
              <Typography>₹{subtotal}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Shipping:</Typography>
              <Typography>{shipping === 0 ? 'Free' : `₹${shipping}`}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                ₹{total}
              </Typography>
            </Box>
            
            <Button 
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              startIcon={<ShoppingBag />}
              sx={{ mb: 2 }}
            >
              Proceed to Checkout
            </Button>
            
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Secure checkout with SSL encryption
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Remove Item Dialog */}
      <Dialog open={removeDialogOpen} onClose={() => setRemoveDialogOpen(false)}>
        <DialogTitle>Remove Item</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to remove this item from your cart?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => itemToRemove && handleRemoveItem(itemToRemove)} 
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear Cart Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Clear Cart</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to clear all items from your cart?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClearCart} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CartPage;