import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  fetchProducts,
  fetchProductsByCategory,
} from "../../store/slices/productSlice";
import { addToCart } from "../../store/slices/cartSlice";
import { productAPI } from "../../services/api";
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
  useTheme,
  Fade,
  Slide,
  Grow,
  Container,
  FormGroup,
} from "@mui/material";
import {
  ShoppingCart,
  Visibility,
  Close as CloseIcon,
  FilterList,
  Sort,
  Search,
  Diamond,
  LocalOffer,
  Inventory,
  PriceChange,
  CheckCircle,
  Refresh,
} from "@mui/icons-material";
import { COLORS } from "../../utils/contstant";

type AvailabilityFilter = "in_stock" | "out_of_stock";

const ShopPage = () => {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [headerVisible, setHeaderVisible] = useState(false);

  const { loading, products, filters } = useSelector((state: RootState) => ({
    loading: state.products.loading,
    filters: state.products.filters,
    products: Array.isArray(state.products.products)
      ? state.products.products
      : [],
  }));

  // Track initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [hasData, setHasData] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [availabilityFilter, setAvailabilityFilter] = useState<
    AvailabilityFilter[]
  >([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 799]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Set header visible immediately on mount
  useEffect(() => {
    setHeaderVisible(true);
  }, []);

  // Optimized product loading
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadProducts = async () => {
      if (!isMounted) return;
      
      const categoryParam = searchParams.get("category") || category;
      const shouldLoad = !hasData || categoryParam !== category;
      
      if (!shouldLoad) return;
      
      setApiError(null);
      setIsInitialLoad(true);

      try {
        const action = categoryParam 
          ? fetchProductsByCategory({ 
              category: categoryParam, 
              signal: controller.signal 
            })
          : fetchProducts({ signal: controller.signal });
        
        const result = await dispatch(action);
        
        if (isMounted && result.meta.requestStatus === "fulfilled") {
          setHasData(true);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error("Error loading products:", error);
          const errorMessage = error.response?.data?.message || error.message || "Failed to load products";
          setApiError(errorMessage);
          setSnackbarMessage(`Error: ${errorMessage}`);
          setOpenSnackbar(true);
        }
      } finally {
        if (isMounted) {
          setIsInitialLoad(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [category, searchParams.toString()]);

  const handleAddToCart = (product: any) => {
    dispatch(addToCart({ product, quantity: 1 }));
    setSnackbarMessage(`${product.name} added to cart!`);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSnackbarButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setOpenSnackbar(false);
  };

  const handleViewDetails = (productId: any) => {
    // Find the product to ensure we have the correct data structure
    const product = products.find((p) => p.id === productId);
    if (!product) {
      navigate(`/product/${productId}`);
      return;
    }

    // Create a deep clone of the product to avoid reference issues
    const productClone = JSON.parse(JSON.stringify(product));

    // Handle category which can be either string or Category object
    if (productClone.category) {
      productClone.category =
        typeof productClone.category === "object"
          ? productClone.category.name || "Uncategorized"
          : productClone.category;
    }

    // Ensure other object properties are properly handled
    if (productClone.images && !Array.isArray(productClone.images)) {
      productClone.images = [];
    }

    // Navigate with the cleaned product data
    navigate(`/product/${productId}`, {
      state: {
        product: productClone,
      },
    });
  };

  const handleOutOfStockClick = () => {
    navigate("/contact");
  };

  const resetFilters = () => {
    setAvailabilityFilter([]);
    setPriceRange([0, 799]);
  };

  const filteredProducts = products.filter((product: any) => {
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

  const sortedProducts = [...filteredProducts].sort((a: any, b: any) => {
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

  // Show loading state when loading data and no data is available yet
  if ((isInitialLoad || loading) && !hasData) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
          backdropFilter: "blur(4px)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            p: 4,
            borderRadius: 4,
            boxShadow: 3,
            backgroundColor: theme.palette.background.paper,
            maxWidth: "90%",
            width: 400,
            textAlign: "center",
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
          <Box>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{
                fontWeight: 600,
                mb: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Loading Products
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 300, mx: "auto" }}
            >
              Please wait while we fetch the latest collection for you...
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  if (apiError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
          backgroundColor: theme.palette.background.default,
          gap: 2,
          p: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" color="error">
          Failed to load products
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          startIcon={<Refresh />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  const categoryParam = searchParams.get("category") || category;
  const pageTitle = categoryParam
    ? categoryParam.charAt(0).toUpperCase() +
      categoryParam.slice(1).replace("-", " ")
    : "All Products";

  const accentColor =
    theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        pb: 10,
        transition: "background-color 0.3s ease",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6,
            p: 3,
            mx: "auto",
            backgroundColor: theme.palette.background.default,
            transition: "opacity 300ms ease, transform 300ms ease",
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              mb: 6,
            }}
          >
            <Typography
              variant="h1"
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
              {pageTitle}
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={4}>
          {/* Filters Sidebar */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: { xs: isFilterVisible ? "block" : "none", md: "block" },
            }}
          >
            <Slide direction="right" in={true} timeout={800}>
              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[4],
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FilterList sx={{ color: theme.palette.primary.main }} />
                    <Typography
                      variant="h6"
                      sx={{
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                      }}
                    >
                      Filters
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    onClick={resetFilters}
                    variant="outlined"
                    sx={{
                      borderRadius: "20px",
                      px: 2,
                    }}
                  >
                    Reset
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Search Field */}
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search
                            sx={{
                              color: theme.palette.text.secondary,
                              fontSize: 20,
                            }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      maxWidth: "280px",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                </Box>

                {/* Availability Filter - In one row */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Inventory
                      sx={{ fontSize: 18, color: theme.palette.primary.main }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        fontSize: "0.9rem",
                      }}
                    >
                      Availability
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
                                availabilityFilter.filter(
                                  (f) => f !== "in_stock"
                                )
                              );
                            }
                          }}
                          size="small"
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.85rem" }}
                          >
                            In Stock
                          </Typography>
                          <Chip
                            label={
                              products.filter(
                                (p) => (p.stock_quantity || p.stock || 0) > 0
                              ).length
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              minWidth: "28px",
                              height: "22px",
                              "& .MuiChip-label": {
                                px: 0.5,
                                fontSize: "0.75rem",
                              },
                            }}
                          />
                        </Box>
                      }
                      sx={{ m: 0 }}
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
                          size="small"
                        />
                      }
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{ fontSize: "0.85rem" }}
                          >
                            Out of Stock
                          </Typography>
                          <Chip
                            label={
                              products.filter(
                                (p) => (p.stock_quantity || p.stock || 0) === 0
                              ).length
                            }
                            size="small"
                            variant="outlined"
                            sx={{
                              minWidth: "28px",
                              height: "22px",
                              color: theme.palette.error.main,
                              borderColor: theme.palette.error.main,
                              "& .MuiChip-label": {
                                px: 0.5,
                                fontSize: "0.75rem",
                                color: theme.palette.error.main,
                              },
                            }}
                          />
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Price Range Filter */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <PriceChange
                      sx={{ fontSize: 20, color: theme.palette.primary.main }}
                    />
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Price Range
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ mb: 2, display: "block" }}
                  >
                    The highest price is PKR 799.00
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(_, value) =>
                      setPriceRange(value as [number, number])
                    }
                    valueLabelDisplay="auto"
                    min={0}
                    max={799}
                    valueLabelFormat={(value) => `PKR ${value}`}
                    sx={{ mb: 3 }}
                  />
                  <Grid container spacing={2}>
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
                            <InputAdornment position="start">
                              PKR
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
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
                            <InputAdornment position="start">
                              PKR
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Slide>
          </Grid>

          {/* Products Grid */}
          <Grid item xs={12} md={9}>
            {/* Mobile Filter Toggle */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setIsFilterVisible(!isFilterVisible)}
                sx={{ borderRadius: 2 }}
              >
                {isFilterVisible ? "Hide Filters" : "Show Filters"}
              </Button>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Sort sx={{ color: theme.palette.text.secondary }} />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort by"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="featured">Featured</MenuItem>
                    <MenuItem value="alphabetical_az">A-Z</MenuItem>
                    <MenuItem value="alphabetical_za">Z-A</MenuItem>
                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                    <MenuItem value="best_selling">Best Selling</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Desktop Sort Controls */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {sortedProducts.length} products found
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Sort sx={{ color: theme.palette.text.secondary }} />
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort by"
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="featured">Featured</MenuItem>
                    <MenuItem value="alphabetical_az">
                      Alphabetically, A-Z
                    </MenuItem>
                    <MenuItem value="alphabetical_za">
                      Alphabetically, Z-A
                    </MenuItem>
                    <MenuItem value="price_low">Price: Low to High</MenuItem>
                    <MenuItem value="price_high">Price: High to Low</MenuItem>
                    <MenuItem value="best_selling">Best Selling</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {paginatedProducts.length === 0 ? (
              <Fade in={true} timeout={800}>
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Diamond
                    sx={{
                      fontSize: 64,
                      color: theme.palette.text.secondary,
                      mb: 2,
                      opacity: 0.5,
                    }}
                  />
                  <Typography variant="h5" color="text.secondary" gutterBottom>
                    No products found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Try adjusting your filters or search terms
                  </Typography>
                </Box>
              </Fade>
            ) : (
              <>
                <Grid container spacing={3}>
                  {paginatedProducts.map((product: any, index: number) => {
                    const isOutOfStock =
                      (product.stock_quantity || product.stock || 0) === 0;
                    const originalPrice =
                      product.original_price || product.retail_price;
                    const currentPrice =
                      product.offer_price ||
                      product.price ||
                      product.retail_price;
                    const hasDiscount =
                      originalPrice &&
                      currentPrice &&
                      originalPrice > currentPrice;
                    const discountPercentage = hasDiscount
                      ? Math.round(
                          ((originalPrice - currentPrice) / originalPrice) * 100
                        )
                      : 0;

                    // Determine product type for category label
                    const getProductType = () => {
                      // Ensure we're working with a string
                      let category = product.category;

                      // If category is an object with a name property, use that
                      if (
                        category &&
                        typeof category === "object" &&
                        category !== null
                      ) {
                        category = category.name || "";
                      }

                      // If we have a string category, use it
                      if (
                        typeof category === "string" &&
                        category.trim() !== ""
                      ) {
                        return category;
                      }

                      // Otherwise, fall back to the name-based detection
                      const name = (product.name || "").toLowerCase();
                      if (name.includes("ring")) return "Ring";
                      if (name.includes("hoop") || name.includes("earring"))
                        return "Earrings";
                      if (name.includes("necklace")) return "Necklace";
                      if (name.includes("bracelet")) return "Bracelet";
                      if (name.includes("pendant")) return "Pendant";

                      // Default fallback
                      return "Jewelry";
                    };

                    return (
                      <Grid item xs={12} sm={6} md={3} key={product.id}>
                        <Grow
                          in={true}
                          timeout={800}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <Box sx={{ position: "relative", height: "100%" }}>
                            {/* Discount Badge */}
                            {hasDiscount && (
                              <Chip
                                label={`${discountPercentage}% OFF`}
                                color="primary"
                                sx={{
                                  position: "absolute",
                                  top: 12,
                                  left: 12,
                                  zIndex: 2,
                                  fontWeight: "bold",
                                }}
                              />
                            )}

                            <Card
                              sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: "16px",
                                transition: "all 0.3s ease",
                                backgroundColor: theme.palette.background.paper,
                                border: `1px solid ${theme.palette.divider}`,
                                boxShadow: theme.shadows[2],
                                "&:hover": {
                                  transform: isOutOfStock
                                    ? "none"
                                    : "translateY(-8px)",
                                  boxShadow: theme.shadows[8],
                                  borderColor: theme.palette.primary.main,
                                },
                                cursor: isOutOfStock ? "pointer" : "default",
                              }}
                              onClick={
                                isOutOfStock ? handleOutOfStockClick : undefined
                              }
                            >
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
                                    zIndex: 3,
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    borderRadius: "16px",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      backgroundColor: theme.palette.error.main,
                                      padding: "16px 24px",
                                      borderRadius: "25px",
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

                              {/* Clickable product image */}
                              <Box
                                sx={{
                                  height: 280,
                                  overflow: "hidden",
                                  cursor: "pointer",
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isOutOfStock)
                                    handleViewDetails(product.id);
                                }}
                              >
                                <CardMedia
                                  component="img"
                                  height="280"
                                  image={
                                    product.images?.[0] ||
                                    "https://via.placeholder.com/300x280?text=Jewelry"
                                  }
                                  alt={product.name}
                                  sx={{
                                    objectFit: "cover",
                                    transition: "transform 0.3s ease",
                                    "&:hover": {
                                      transform: "scale(1.05)",
                                    },
                                  }}
                                />
                              </Box>

                              <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
                                <Typography
                                  variant="h6"
                                  component="h3"
                                  gutterBottom
                                  sx={{
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    minHeight: "auto",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {product.name}
                                </Typography>

                                <Box sx={{ mb: 1 }}>
                                  <Chip
                                    label={getProductType()}
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      borderColor: theme.palette.primary.main,
                                      color: theme.palette.primary.main,
                                      fontSize: "0.7rem",
                                    }}
                                  />
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      color: theme.palette.primary.main,
                                      fontWeight: "bold",
                                      fontSize: "1.1rem",
                                    }}
                                  >
                                    PKR {currentPrice}
                                  </Typography>
                                  {hasDiscount && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        textDecoration: "line-through",
                                        color: "text.secondary",
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      PKR {originalPrice}
                                    </Typography>
                                  )}
                                </Box>
                              </CardContent>
                              <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
                                <Button
                                  variant="contained"
                                  startIcon={<ShoppingCart />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                  }}
                                  disabled={isOutOfStock}
                                  sx={{
                                    flex: 1,
                                    borderRadius: "25px",
                                    py: 0.8,
                                    fontSize: "0.8rem",
                                    backgroundColor: theme.palette.primary.main,
                                    "&:hover": {
                                      backgroundColor:
                                        theme.palette.primary.dark,
                                    },
                                  }}
                                >
                                  Add to Cart
                                </Button>
                                <Button
                                  variant="outlined"
                                  startIcon={<Visibility />}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewDetails(product.id);
                                  }}
                                  sx={{
                                    flex: 1,
                                    borderRadius: "25px",
                                    py: 0.8,
                                    fontSize: "0.8rem",
                                    borderColor: theme.palette.primary.main,
                                    color: theme.palette.primary.main,
                                    "&:hover": {
                                      backgroundColor:
                                        theme.palette.primary.main,
                                      color: theme.palette.primary.contrastText,
                                    },
                                  }}
                                >
                                  Details
                                </Button>
                              </CardActions>
                            </Card>
                          </Box>
                        </Grow>
                      </Grid>
                    );
                  })}
                </Grid>

                {/* Pagination */}
                {sortedProducts.length > pageSize && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 6 }}
                  >
                    <Pagination
                      count={Math.ceil(sortedProducts.length / pageSize)}
                      page={currentPage}
                      onChange={(_, page) => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      color="primary"
                      size="large"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderRadius: 2,
                          fontWeight: 600,
                        },
                      }}
                    />
                  </Box>
                )}
              </>
            )}
          </Grid>
        </Grid>

        {/* Snackbar Notification */}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Paper
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              display: "flex",
              alignItems: "center",
              gap: 2,
              boxShadow: theme.shadows[6],
              border: `1px solid ${theme.palette.primary.main}30`,
            }}
          >
            <CheckCircle sx={{ color: theme.palette.success.main }} />
            <Typography>{snackbarMessage}</Typography>
            <IconButton
              size="small"
              onClick={handleSnackbarButtonClick}
              sx={{ ml: 1 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default ShopPage;
