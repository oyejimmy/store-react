import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchProductById } from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  Paper
} from "@mui/material";
import {
  ShoppingCart,
  Favorite,
  Share,
  Add,
  Remove
} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const { currentProduct, loading } = useSelector(
    (state: RootState) => state.products
  );
  const { items: wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)));
    }
    
    // Generate random suggested products
    const products = [
      { id: 11, name: 'Golden Ring Set', price: '2,500', image: '1515562141207-7a88fb7ce338' },
      { id: 12, name: 'Pearl Earrings', price: '1,800', image: '1573408301185-9146fe634ad0' },
      { id: 13, name: 'Diamond Pendant', price: '3,200', image: '1605100804763-247f67b3557e' },
      { id: 14, name: 'Silver Bracelet', price: '1,500', image: '1611652022419-a9419f74343d' },
      { id: 15, name: 'Ruby Necklace', price: '4,200', image: '1617038260897-41a1f14a8ca0' },
      { id: 16, name: 'Emerald Ring', price: '3,800', image: '1515562141207-7a88fb7ce338' },
      { id: 17, name: 'Gold Bangles', price: '2,200', image: '1573408301185-9146fe634ad0' },
      { id: 18, name: 'Crystal Anklet', price: '1,200', image: '1605100804763-247f67b3557e' }
    ];
    
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setSuggestedProducts(shuffled.slice(0, 4));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(
        addToCart({
          product: currentProduct,
          quantity,
        })
      );
      alert("Product added to cart!");
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link to this product is copied');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link to this product is copied');
    }
  };

  const isInWishlist = wishlistItems.some(item => item.id === currentProduct?.id);

  const handleWishlist = () => {
    if (currentProduct) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(currentProduct.id));
      } else {
        dispatch(addToWishlist({
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentPrice,
          image: images[0]
        }));
      }
    }
  };

  if (loading || !currentProduct) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
    "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=500"
  ];
  
  const images = currentProduct.images && currentProduct.images.length > 0
    ? currentProduct.images
    : defaultImages;

  const originalPrice = currentProduct.original_price || currentProduct.retail_price;
  const currentPrice = currentProduct.offer_price || currentProduct.price || currentProduct.retail_price;
  const hasDiscount = originalPrice && currentPrice && originalPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;

  return (
    <Box sx={{ p: 3, pt: 12, maxWidth: 1200, mx: 'auto' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 3,
                boxShadow: 3,
                cursor: 'zoom-in'
              }}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPosition({ x, y });
              }}
            >
              <Box
                component="img"
                src={images[selectedImage]}
                alt={currentProduct.name}
                sx={{
                  width: '100%',
                  height: 500,
                  objectFit: 'cover',
                  transition: 'transform 0.1s ease',
                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                }}
              />
            </Box>
          </Box>

          <Grid container spacing={1}>
            {images.slice(0, 5).map((image, index) => (
              <Grid item xs key={index}>
                <Box
                  component="img"
                  src={image}
                  alt={`${currentProduct.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  sx={{
                    width: '100%',
                    height: 80,
                    objectFit: 'cover',
                    borderRadius: 2,
                    cursor: 'pointer',
                    border: selectedImage === index ? `3px solid ${theme.palette.primary.main}` : '2px solid #f0f0f0',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedImage === index ? 2 : 1,
                    '&:hover': {
                      transform: selectedImage !== index ? 'scale(1.05)' : 'none'
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {currentProduct.name}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label="Premium Quality" color="primary" />
            {hasDiscount && (
              <Chip label={`${discountPercent}% OFF`} color="error" />
            )}
          </Box>

          <Box sx={{ mb: 2 }}>
            {hasDiscount && (
              <Typography
                variant="h6"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  mr: 2,
                  display: 'inline'
                }}
              >
                PKR {originalPrice}
              </Typography>
            )}
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 'bold',
                display: 'inline'
              }}
            >
              PKR {currentPrice}
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            {currentProduct.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Typography variant="h6">Quantity:</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Remove />
              </IconButton>
              <TextField
                size="small"
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  if (value >= 1 && value <= (currentProduct.stock_quantity || currentProduct.stock || 0)) {
                    setQuantity(value);
                  }
                }}
                inputProps={{
                  style: { textAlign: 'center', width: '60px' },
                  min: 1,
                  max: currentProduct.stock_quantity || currentProduct.stock || 0
                }}
              />
              <IconButton
                onClick={() => setQuantity(Math.min((currentProduct.stock_quantity || currentProduct.stock || 0), quantity + 1))}
                disabled={quantity >= (currentProduct.stock_quantity || currentProduct.stock || 0)}
              >
                <Add />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {currentProduct.stock_quantity || currentProduct.stock || 0} available
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={(currentProduct.stock_quantity || currentProduct.stock || 0) === 0}
              sx={{ flex: 1, minWidth: 200 }}
            >
              Add to Cart
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleBuyNow}
              disabled={(currentProduct.stock_quantity || currentProduct.stock || 0) === 0}
              sx={{ flex: 1, minWidth: 150 }}
            >
              Buy Now
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              variant={isInWishlist ? "contained" : "outlined"}
              startIcon={<Favorite sx={{ color: isInWishlist ? 'white' : 'inherit' }} />}
              onClick={handleWishlist}
              sx={{ flex: 1 }}
            >
              {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
            </Button>

            <Button
              variant="outlined"
              startIcon={<Share />}
              onClick={handleShare}
              sx={{ flex: 1 }}
            >
              Share
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Product Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">Category:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{currentProduct.category}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">Subcategory:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">{currentProduct.subcategory}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">Material:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Gold Plated</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" fontWeight="bold">Stock:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {(currentProduct.stock_quantity || currentProduct.stock || 0) > 0 
                    ? `${currentProduct.stock_quantity || currentProduct.stock} in stock`
                    : 'Out of stock'
                  }
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Suggested Collections */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, fontWeight: 'bold' }}>
          Suggested Collections
        </Typography>
        <Grid container spacing={3}>
          {suggestedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card sx={{ cursor: 'pointer', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }, transition: 'all 0.3s' }}>
                <Box
                  component="img"
                  src={`https://images.unsplash.com/photo-${product.image}?w=300`}
                  alt={product.name}
                  sx={{ width: '100%', height: 200, objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Premium quality jewelry
                  </Typography>
                  <Typography variant="h6" color="primary.main" fontWeight="bold">
                    PKR {product.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductDetailPage;