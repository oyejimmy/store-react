import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../store";
import {
  fetchProducts,
  fetchProductsByCategory,
} from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Pagination,
  Typography,
  CircularProgress,
  Chip,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
  Snackbar,
  InputAdornment,
  Paper,
  IconButton,
} from "@mui/material";
import {
  ShoppingCart,
  Visibility,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const ShopPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const { products, loading, filters } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [availabilityFilter, setAvailabilityFilter] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 799]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const categoryParam = searchParams.get("category") || category;
    if (categoryParam) {
      dispatch(fetchProductsByCategory({ category: categoryParam }));
    } else {
      dispatch(fetchProducts({}));
    }
  }, [dispatch, category, searchParams]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    setSnackbarMessage(`${product.name} added to cart!`);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleViewDetails = (productId) => {
    navigate(`/product/${productId}`);
  };

  const resetFilters = () => {
    setAvailabilityFilter([]);
    setPriceRange([0, 799]);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const productPrice =
      product.offer_price || product.price || product.retail_price || 0;
    const matchesPrice =
      productPrice >= priceRange[0] && productPrice <= priceRange[1];

    const isInStock = (product.stock_quantity || product.stock || 0) > 0;
    const matchesAvailability =
      availabilityFilter.length === 0 ||
      (availabilityFilter.includes("in_stock") && isInStock) ||
      (availabilityFilter.includes("out_of_stock") && !isInStock);

    return matchesSearch && matchesPrice && matchesAvailability;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        const priceA = a.offer_price || a.price || a.retail_price || 0;
        const priceB = b.offer_price || b.price || b.retail_price || 0;
        return priceA - priceB;
      case "price_high":
        const priceA2 = a.offer_price || a.price || a.retail_price || 0;
        const priceB2 = b.offer_price || b.price || b.retail_price || 0;
        return priceB2 - priceA2;
      case "alphabetical_az":
        return a.name.localeCompare(b.name);
      case "alphabetical_za":
        return b.name.localeCompare(a.name);
      case "best_selling":
        return (b.sold || 0) - (a.sold || 0);
      case "featured":
      default:
        return 0;
    }
  });

  const pageSize = 12;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          bgcolor: "background.default", // Apply background color for loading state
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  const categoryParam = searchParams.get("category") || category;
  const pageTitle = categoryParam
    ? categoryParam.charAt(0).toUpperCase() +
      categoryParam.slice(1).replace("-", " ")
    : "All Products";

  const snackbarStyle = {
    backgroundColor: theme.palette.mode === "dark" ? "#1E1B4B" : "#F8FAFC",
    color: theme.palette.mode === "dark" ? "#F8FAFC" : "#1E1B4B",
  };

  const cardButtonStyle = {
    flex: 1,
    height: "48px", // Consistent height for all buttons
    fontWeight: "bold",
    borderRadius: "8px",
  };

  return (
    // Main container with dynamic background color
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        minHeight: "100vh",
        pb: 10,
      }}
    >
      <Box sx={{ margin: 5, p: 3, maxWidth: 1600, mx: "auto", mb: 10 }}>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            color: theme.palette.text.primary,
            mb: 5,
            fontWeight: "bold",
          }}
        >
          {pageTitle}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper elevation={4} sx={{ p: 2, mb: 3, borderRadius: "12px" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: theme.palette.text.primary, fontWeight: "bold" }}
                >
                  Filters
                </Typography>
                <Button
                  size="small"
                  onClick={resetFilters}
                  variant="text"
                  color="secondary"
                >
                  Reset
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Availability
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={availabilityFilter.includes("in_stock")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAvailabilityFilter([
                            ...availabilityFilter,
                            "in_stock",
                          ]);
                        } else {
                          setAvailabilityFilter(
                            availabilityFilter.filter((f) => f !== "in_stock")
                          );
                        }
                      }}
                    />
                  }
                  label={`In stock (${
                    products.filter(
                      (p) => (p.stock_quantity || p.stock || 0) > 0
                    ).length
                  })`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={availabilityFilter.includes("out_of_stock")}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setAvailabilityFilter([
                            ...availabilityFilter,
                            "out_of_stock",
                          ]);
                        } else {
                          setAvailabilityFilter(
                            availabilityFilter.filter(
                              (f) => f !== "out_of_stock"
                            )
                          );
                        }
                      }}
                    />
                  }
                  label={`Out of stock (${
                    products.filter(
                      (p) => (p.stock_quantity || p.stock || 0) === 0
                    ).length
                  })`}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                  Price Range
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mb: 2, display: "block" }}
                >
                  The highest price is PKR 799.00
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(_, value) => setPriceRange(value)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={799}
                  valueLabelFormat={(value) => `PKR ${value}`}
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="From"
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([
                          parseInt(e.target.value) || 0,
                          priceRange[1],
                        ])
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">PKR</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="To"
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([
                          priceRange[0],
                          parseInt(e.target.value) || 799,
                        ])
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">PKR</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <FormControl sx={{ minWidth: 300 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Sort by"
                >
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="alphabetical_az">
                    Alphabetically, A-Z
                  </MenuItem>
                  <MenuItem value="alphabetical_za">
                    Alphabetically, Z-A
                  </MenuItem>
                  <MenuItem value="price_low">Price, low to high</MenuItem>
                  <MenuItem value="price_high">Price, high to low</MenuItem>
                  <MenuItem value="best_selling">Best selling</MenuItem>
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary">
                {sortedProducts.length} products
              </Typography>
            </Box>

            {paginatedProducts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No products found
                </Typography>
              </Box>
            ) : (
              <>
                <Grid container spacing={4}>
                  {paginatedProducts.map((product) => {
                    const isOutOfStock =
                      (product.stock_quantity || product.stock || 0) === 0;

                    return (
                      <Grid item xs={12} sm={6} md={6} lg={4} key={product.id}>
                        <Box sx={{ position: "relative" }}>
                          {/* Out of Stock Overlay */}
                          {isOutOfStock && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                borderRadius: "16px",
                              }}
                            >
                              <Box
                                sx={{
                                  backgroundColor: "#ff0000",
                                  padding: "16px",
                                  borderRadius: "50px",
                                  transform: "rotate(-5deg)",
                                }}
                              >
                                <Typography
                                  variant="h5"
                                  sx={{
                                    color: "white",
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                    letterSpacing: "2px",
                                  }}
                                >
                                  Out of Stock
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          <Card
                            elevation={4}
                            sx={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              borderRadius: "16px",
                              transition: "transform 0.2s",
                              "&:hover": {
                                transform: isOutOfStock
                                  ? "none"
                                  : "translateY(-8px)",
                              },
                              // Blur effect
                              filter: isOutOfStock ? "blur(4px)" : "none",
                            }}
                          >
                            <CardMedia
                              component="img"
                              height="240" // Slightly taller image
                              image={product.images[0] || ""}
                              alt={product.name}
                              sx={{ objectFit: "cover" }}
                            />
                            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                              <Typography
                                variant="h6"
                                component="h3"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                              >
                                {product.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1, minHeight: 40 }}
                              >
                                {product.description?.substring(0, 60)}...
                              </Typography>
                              <Box sx={{ mb: 1 }}>
                                <Chip
                                  label={product.category || "Jewelry"}
                                  size="small"
                                  color="primary"
                                />
                                {isOutOfStock && (
                                  <Chip
                                    label="Out of Stock"
                                    size="small"
                                    color="error"
                                    sx={{ ml: 1 }}
                                  />
                                )}
                              </Box>
                              <Box>
                                {(() => {
                                  const originalPrice =
                                    product.original_price ||
                                    product.retail_price;
                                  const currentPrice =
                                    product.offer_price ||
                                    product.price ||
                                    product.retail_price;
                                  return (
                                    originalPrice &&
                                    currentPrice &&
                                    originalPrice > currentPrice && (
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          textDecoration: "line-through",
                                          color: "text.secondary",
                                          mr: 1,
                                        }}
                                        component="span"
                                      >
                                        PKR {originalPrice}
                                      </Typography>
                                    )
                                  );
                                })()}
                                <Typography
                                  variant="h6"
                                  sx={{
                                    color: theme.palette.primary.main,
                                    fontWeight: "bold",
                                  }}
                                  component="span"
                                >
                                  PKR{" "}
                                  {product.offer_price ||
                                    product.price ||
                                    product.retail_price}
                                </Typography>
                              </Box>
                            </CardContent>
                            <CardActions
                              sx={{
                                p: 2,
                                pt: 0,
                                justifyContent: "space-between",
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<ShoppingCart />}
                                onClick={() => handleAddToCart(product)}
                                disabled={isOutOfStock}
                                sx={cardButtonStyle}
                              >
                                Add to Cart
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<Visibility />}
                                onClick={() => handleViewDetails(product.id)}
                                sx={cardButtonStyle}
                              >
                                View Details
                              </Button>
                            </CardActions>
                          </Card>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={Math.ceil(sortedProducts.length / pageSize)}
                    page={currentPage}
                    onChange={(_, page) => setCurrentPage(page)}
                    color="primary"
                  />
                </Box>
              </>
            )}
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Box
            sx={{
              ...snackbarStyle,
              p: 2,
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              boxShadow: theme.shadows[6],
            }}
          >
            <Typography>{snackbarMessage}</Typography>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
              sx={{ ml: 2 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ShopPage;
