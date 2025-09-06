import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { fetchProductById } from "../../../store/slices/productSlice";
import { addToCart } from "../../../store/slices/cartSlice";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../store/slices/wishlistSlice";
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
  Paper,
  Rating,
  Tabs,
  Tab,
  Container,
  useTheme,
  Fade,
  Grow,
  Zoom,
  Slide,
  Alert,
} from "@mui/material";
import {
  ShoppingCart,
  Favorite,
  Share,
  Add,
  Remove,
  Inventory,
  LocalOffer,
  Diamond,
  Security,
  AssignmentReturn,
  AllInclusive,
  WorkspacePremium,
  TrendingUp,
  CalendarToday,
  LocationOn,
  Visibility,
  LocalShipping,
  Category,
  Sell,
  Paid,
} from "@mui/icons-material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();

  const { currentProduct, loading } = useSelector(
    (state: RootState) => state.products
  );
  const { items: wishlistItems } = useSelector(
    (state: RootState) => state.wishlist
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)));
    }

    // Generate random suggested products
    const products = [
      {
        id: 11,
        name: "Golden Hair Clip",
        price: "450",
        image: "1515562141207-7a88fb7ce338",
        rating: 4.8,
        reviews: 42,
        category: "Hair Accessories",
      },
      {
        id: 12,
        name: "Pearl Hair Pins",
        price: "320",
        image: "1573408301185-9146fe634ad0",
        rating: 4.5,
        reviews: 28,
        category: "Hair Accessories",
      },
      {
        id: 13,
        name: "Floral Hair Band",
        price: "550",
        image: "1605100804763-247f67b3557e",
        rating: 4.9,
        reviews: 56,
        category: "Hair Accessories",
      },
      {
        id: 14,
        name: "Silk Scrunchies Set",
        price: "380",
        image: "1611652022419-a9419f74343d",
        rating: 4.3,
        reviews: 19,
        category: "Hair Accessories",
      },
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
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading || !currentProduct) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500",
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500",
  ];

  const images =
    currentProduct.images && currentProduct.images.length > 0
      ? currentProduct.images
      : defaultImages;

  // Helper function to safely convert price to number
  const toNumber = (value: any): number => {
    if (value === undefined || value === null) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      // Handle JS:150 format
      const numStr = value.includes("JS:") ? value.split("JS:")[1] : value;
      const num = parseFloat(numStr.replace(/[^0-9.-]+/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  const originalPrice = toNumber(
    currentProduct.original_price ||
      currentProduct.retail_price ||
      currentProduct.price
  );

  const currentPrice = toNumber(
    currentProduct.offer_price ||
      (currentProduct as any).sell_price ||
      (currentProduct as any).price ||
      currentProduct.retail_price
  );

  const hasDiscount = originalPrice > currentPrice;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  const stock =
    (currentProduct as any).stock_quantity ||
    currentProduct.stock ||
    currentProduct.available ||
    (currentProduct as any).total_qty ||
    0;

  const isInWishlist = wishlistItems.some(
    (item) => item.id === currentProduct?.id
  );

  const handleWishlist = () => {
    if (currentProduct) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(currentProduct.id));
      } else {
        dispatch(
          addToWishlist({
            id: currentProduct.id,
            name: (currentProduct.name || currentProduct.full_name || ''),
            price: currentPrice,
            image: Array.isArray(images) && images[0] ? images[0] : "",
          })
        );
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get category name
  const getCategoryName = () => {
    if (!currentProduct?.category) return "Hair Accessories";
    return typeof currentProduct.category === 'object' 
      ? currentProduct.category.name 
      : currentProduct.category;
  };

  // Get delivery charges
  const deliveryCharges = toNumber(currentProduct.delivery_charges) || 0;

  return (
    <Box
      sx={{
        pt: 12,
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        transition: "background-color 0.3s ease",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true} timeout={800}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2, position: "relative" }}>
                {hasDiscount && (
                  <Chip
                    label={`${discountPercent}% OFF`}
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 16,
                      left: 16,
                      zIndex: 2,
                      fontWeight: "bold",
                      fontSize: "1rem",
                      py: 1.5,
                    }}
                  />
                )}
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 3,
                    boxShadow: 3,
                    cursor: "zoom-in",
                    border: `1px solid ${theme.palette.divider}`,
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
                    alt={currentProduct.name || currentProduct.full_name}
                    sx={{
                      width: "100%",
                      height: 500,
                      objectFit: "cover",
                      transition: "transform 0.1s ease",
                      transform: isZoomed ? "scale(2)" : "scale(1)",
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                </Box>
              </Box>

              <Grid container spacing={1}>
                {images.slice(0, 4).map((image, index) => (
                  <Grid item xs={3} key={index}>
                    <Box
                      component="img"
                      src={image}
                      alt={`${
                        currentProduct.name || currentProduct.full_name
                      } ${index + 1}`}
                      onClick={() => setSelectedImage(index)}
                      sx={{
                        width: "100%",
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 2,
                        cursor: "pointer",
                        border:
                          selectedImage === index
                            ? `3px solid ${theme.palette.primary.main}`
                            : `2px solid ${theme.palette.divider}`,
                        transition: "all 0.3s ease",
                        boxShadow: selectedImage === index ? 2 : 1,
                        "&:hover": {
                          transform:
                            selectedImage !== index ? "scale(1.05)" : "none",
                        },
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={6}>
              <Slide direction="left" in={true} timeout={800}>
                <Box>
                  <Typography
                    variant="h3"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      background:
                        theme.palette.mode === "dark"
                          ? "linear-gradient(45deg, #FFF 30%, #BBB 90%)"
                          : "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                      backgroundClip: "text",
                      textFillColor: "transparent",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {currentProduct.name || currentProduct.full_name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={<WorkspacePremium />}
                      label="Premium Quality"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      icon={<TrendingUp />}
                      label="Bestseller"
                      color="success"
                      variant="outlined"
                    />
                    {currentProduct.subcategory && (
                      <Chip
                        label={currentProduct.subcategory}
                        variant="outlined"
                        sx={{ textTransform: "capitalize" }}
                      />
                    )}
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Rating
                        value={4.7}
                        precision={0.1}
                        readOnly
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        4.7 (128 reviews)
                      </Typography>
                    </Box>

                    {hasDiscount && (
                      <Typography
                        variant="h5"
                        sx={{
                          textDecoration: "line-through",
                          color: "text.secondary",
                          mr: 2,
                          display: "inline",
                        }}
                      >
                        {currentProduct.currency || "PKR"} {originalPrice}
                      </Typography>
                    )}
                    <Typography
                      variant="h2"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: "bold",
                        display: "inline",
                      }}
                    >
                      {currentProduct.currency || "PKR"} {currentPrice}
                    </Typography>

                    {deliveryCharges > 0 && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        + {currentProduct.currency || "PKR"} {deliveryCharges}{" "}
                        delivery charges
                      </Typography>
                    )}
                  </Box>

                  <Typography
                    variant="body1"
                    paragraph
                    sx={{ lineHeight: 1.8, mb: 3 }}
                  >
                    {currentProduct.description ||
                      "This exquisite piece showcases exceptional craftsmanship with attention to every detail. Made from premium materials, it's designed to last a lifetime while maintaining its brilliant appearance."}
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <Typography variant="h6">Quantity:</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        sx={{
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                        }}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        size="small"
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          if (value >= 1 && value <= stock) {
                            setQuantity(value);
                          }
                        }}
                        inputProps={{
                          style: { textAlign: "center", width: "60px" },
                          min: 1,
                          max: stock,
                        }}
                      />
                      <IconButton
                        onClick={() =>
                          setQuantity(Math.min(stock, quantity + 1))
                        }
                        disabled={quantity >= stock}
                        sx={{
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: 1,
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Inventory
                        sx={{
                          mr: 1,
                          color: stock > 0 ? "success.main" : "error.main",
                        }}
                      />
                      <Typography
                        variant="body2"
                        color={stock > 0 ? "success.main" : "error.main"}
                      >
                        {stock > 0 ? `${stock} in stock` : "Out of stock"}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCart />}
                      onClick={handleAddToCart}
                      disabled={stock === 0}
                      sx={{
                        flex: 1,
                        minWidth: 200,
                        py: 1.5,
                        borderRadius: 2,
                        background:
                          theme.palette.mode === "dark"
                            ? "linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)"
                            : "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                        fontWeight: "bold",
                      }}
                    >
                      Add to Cart
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleBuyNow}
                      disabled={stock === 0}
                      sx={{
                        flex: 1,
                        minWidth: 150,
                        py: 1.5,
                        borderRadius: 2,
                        borderWidth: 2,
                        "&:hover": { borderWidth: 2 },
                      }}
                    >
                      Buy Now
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
                    <Button
                      variant={isInWishlist ? "contained" : "outlined"}
                      startIcon={
                        <Favorite
                          sx={{ color: isInWishlist ? "white" : "inherit" }}
                        />
                      }
                      onClick={handleWishlist}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: 1,
                      }}
                    >
                      {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={handleShare}
                      sx={{
                        flex: 1,
                        borderRadius: 2,
                        py: 1,
                      }}
                    >
                      Share
                    </Button>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Value Propositions */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <Security
                          color="primary"
                          sx={{ fontSize: 40, mb: 1 }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          Secure Payment
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <AssignmentReturn
                          color="primary"
                          sx={{ fontSize: 40, mb: 1 }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          Easy Returns
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <AllInclusive
                          color="primary"
                          sx={{ fontSize: 40, mb: 1 }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          Lifetime Warranty
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box sx={{ textAlign: "center" }}>
                        <LocalShipping
                          color="primary"
                          sx={{ fontSize: 40, mb: 1 }}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          Free Delivery
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Paper
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        theme.palette.mode === "dark"
                          ? "linear-gradient(to right, #1a1a1a, #2d2d2d)"
                          : "linear-gradient(to right, #f5f5f5, #e8e8e8)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Visibility sx={{ mr: 1 }} /> Product Insights
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          display="flex"
                          alignItems="center"
                        >
                          <Category sx={{ fontSize: 16, mr: 1 }} /> Category:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" textTransform="capitalize">
                          {getCategoryName()}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          display="flex"
                          alignItems="center"
                        >
                          <Sell sx={{ fontSize: 16, mr: 1 }} /> Subcategory:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" textTransform="capitalize">
                          {currentProduct.subcategory || "N/A"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          display="flex"
                          alignItems="center"
                        >
                          <Paid sx={{ fontSize: 16, mr: 1 }} /> Currency:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {currentProduct.currency || "PKR"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          display="flex"
                          alignItems="center"
                        >
                          <CalendarToday sx={{ fontSize: 16, mr: 1 }} /> Added:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {currentProduct.created_at
                            ? formatDate(currentProduct.created_at)
                            : "N/A"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          display="flex"
                          alignItems="center"
                        >
                          <CalendarToday sx={{ fontSize: 16, mr: 1 }} />{" "}
                          Updated:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {currentProduct.updated_at
                            ? formatDate(currentProduct.updated_at)
                            : "N/A"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          display="flex"
                          alignItems="center"
                        >
                          <LocationOn sx={{ fontSize: 16, mr: 1 }} /> Location:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2">
                          {(currentProduct as any).location || "Main Warehouse"}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold">
                          Status:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Chip
                          label={
                            currentProduct.status ||
                            (stock > 0 ? "Available" : "Out of Stock")
                          }
                          color={
                            currentProduct.status === "available" || stock > 0
                              ? "success"
                              : "error"
                          }
                          size="small"
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" fontWeight="bold">
                          Active:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Chip
                          label={currentProduct.is_active ? "Yes" : "No"}
                          color={currentProduct.is_active ? "success" : "error"}
                          size="small"
                        />
                      </Grid>

                      {currentProduct.sold !== undefined && (
                        <>
                          <Grid item xs={6}>
                            <Typography variant="body2" fontWeight="bold">
                              Sold:
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              {currentProduct.sold} units
                            </Typography>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  </Paper>
                </Box>
              </Slide>
            </Grid>
          </Grid>
        </Fade>

        {/* Product Details Tabs */}
        <Fade in={true} timeout={1000}>
          <Box sx={{ mt: 6 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              centered
              sx={{ mb: 3 }}
            >
              <Tab label="Description" />
              <Tab label="Specifications" />
              <Tab label="Reviews (128)" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Product Description
                </Typography>
                <Typography paragraph>
                  {currentProduct.description ||
                    "This exquisite Mate Flower Hair Catcher showcases exceptional craftsmanship with attention to every detail. Made from premium materials, it's designed to last a lifetime while maintaining its brilliant appearance."}
                </Typography>
                <Typography paragraph>
                  Whether you're treating yourself or searching for the perfect
                  gift, this piece will undoubtedly impress. Each item undergoes
                  rigorous quality checks to ensure it meets our high standards.
                </Typography>
                <ul>
                  <li>
                    <Typography>Premium quality materials</Typography>
                  </li>
                  <li>
                    <Typography>Expert craftsmanship</Typography>
                  </li>
                  <li>
                    <Typography>Comfortable to wear all day</Typography>
                  </li>
                  <li>
                    <Typography>Perfect for various hair types</Typography>
                  </li>
                </ul>
              </Paper>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Specifications
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="bold">
                      Material:
                    </Typography>
                    <Typography variant="body2">
                      High-Quality Metal with Flower Design
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="bold">
                      Type:
                    </Typography>
                    <Typography variant="body2">
                      {currentProduct.type || "Hair Accessory"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="bold">
                      Weight:
                    </Typography>
                    <Typography variant="body2">Approx 15g</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="bold">
                      Dimensions:
                    </Typography>
                    <Typography variant="body2">6cm x 4cm</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="bold">
                      Clasp Type:
                    </Typography>
                    <Typography variant="body2">Secure Clip</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" fontWeight="bold">
                      Collection:
                    </Typography>
                    <Typography variant="body2">
                      {currentProduct.subcategory || "Floral"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom color="primary">
                  Customer Reviews
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Rating value={4.7} precision={0.1} readOnly size="large" />
                  <Typography variant="h6" sx={{ ml: 2 }}>
                    4.7 out of 5
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  128 reviews
                </Typography>

                <Box sx={{ mt: 3 }}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <Box
                      key={star}
                      sx={{ display: "flex", alignItems: "center", mb: 1 }}
                    >
                      <Typography variant="body2" sx={{ minWidth: 30 }}>
                        {star}
                      </Typography>
                      <Box
                        sx={{
                          flexGrow: 1,
                          mx: 2,
                          height: 8,
                          backgroundColor: theme.palette.grey[300],
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          sx={{
                            height: "100%",
                            width: `${
                              star === 5
                                ? 80
                                : star === 4
                                ? 15
                                : star === 3
                                ? 4
                                : star === 2
                                ? 1
                                : 0
                            }%`,
                            backgroundColor: theme.palette.primary.main,
                            borderRadius: 4,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ minWidth: 30 }}>
                        {star === 5
                          ? 80
                          : star === 4
                          ? 15
                          : star === 3
                          ? 4
                          : star === 2
                          ? 1
                          : 0}
                        %
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Alert severity="info" sx={{ mt: 3 }}>
                  Customers love this product! It has an average rating of 4.7
                  stars based on 128 reviews.
                </Alert>
              </Paper>
            </TabPanel>
          </Box>
        </Fade>

        {/* Suggested Collections */}
        <Grow in={true} timeout={1200}>
          <Box sx={{ mt: 6 }}>
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                textAlign: "center",
                mb: 4,
                fontWeight: "bold",
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(45deg, #FFF 30%, #BBB 90%)"
                    : "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                backgroundClip: "text",
                textFillColor: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Related Hair Accessories
            </Typography>
            <Grid container spacing={3}>
              {suggestedProducts.map((product, index) => (
                <Grid item xs={12} sm={6} md={3} key={product.id}>
                  <Zoom
                    in={true}
                    timeout={1000}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <Card
                      sx={{
                        cursor: "pointer",
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "all 0.3s ease",
                        boxShadow: 2,
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src={`https://images.unsplash.com/photo-${product.image}?w=300`}
                        alt={product.name}
                        sx={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom noWrap>
                          {product.name}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 1 }}
                        >
                          <Rating
                            value={product.rating}
                            precision={0.1}
                            readOnly
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            ({product.reviews})
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                          noWrap
                        >
                          {product.category}
                        </Typography>
                        <Typography
                          variant="h6"
                          color="primary.main"
                          fontWeight="bold"
                        >
                          PKR {product.price}
                        </Typography>
                        <Button
                          variant="outlined"
                          size="small"
                          fullWidth
                          sx={{ mt: 2, borderRadius: 2 }}
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grow>
      </Container>
    </Box>
  );
};

export default ProductDetailPage;
