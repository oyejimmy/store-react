import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Avatar,
  Checkbox,
  useTheme,
  alpha,
  Slide,
  Fade,
  Zoom,
  Grow,
  useMediaQuery,
} from "@mui/material";
import { Alert } from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  ShoppingBag,
  Search,
  TrendingUp,
  Warning,
  AttachMoney,
  PhotoCamera,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Inventory,
  CheckCircle,
  Info,
} from "@mui/icons-material";
import { adminAPI } from "../../../services/api";

// Color constants
const COLORS = {
  offWhite: "#F8FAFC",
  deepNavy: "#1E1B4B",
  silver: "#94A3B8",
};

const AdminProducts: React.FC = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const [formData, setFormData] = useState({
    name: "",
    full_name: "",
    type: "",
    category_id: "",
    retail_price: "",
    offer_price: "",
    buy_price: "",
    sell_price: "",
    stock_quantity: "",
    total_qty: "",
    location: "Store",
    description: "",
    subcategory: "",
    delivery_charges: "0",
  });
  const [errors, setErrors] = useState<any>({});

  // Theme-aware colors
  const tableHeadingColor = {
    backgroundColor: isDarkMode ? COLORS.deepNavy : COLORS.deepNavy,
    color: COLORS.offWhite,
    fontWeight: 600,
  };

  const primaryColor = isDarkMode ? "#6366f1" : COLORS.deepNavy;
  const secondaryColor = isDarkMode ? "#818cf8" : "#4f46e5";
  const cardBgColor = isDarkMode ? "#1e293b" : COLORS.offWhite;
  const textPrimary = isDarkMode ? COLORS.offWhite : COLORS.deepNavy;
  const textSecondary = isDarkMode ? COLORS.silver : "#64748b";
  const borderColor = isDarkMode ? "#334155" : "#e2e8f0";

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, page, rowsPerPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory !== "all") {
        params.category_id = selectedCategory;
      }
      if (searchTerm) {
        params.search = searchTerm;
      }
      params.page = page + 1;
      params.limit = rowsPerPage;

      const data = await adminAPI.getAllProducts(params);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch products",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminAPI.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch categories",
        severity: "error",
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await adminAPI.getProductAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setSnackbar({
        open: true,
        message: "Failed to fetch analytics",
        severity: "error",
      });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = "Product name is required";
    if (!formData.category_id) newErrors.category_id = "Category is required";
    if (!formData.retail_price)
      newErrors.retail_price = "Retail price is required";
    if (!formData.stock_quantity)
      newErrors.stock_quantity = "Stock quantity is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Image handling functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit

      if (!isValidType) {
        setSnackbar({
          open: true,
          message: `${file.name} is not a valid image file`,
          severity: "error",
        });
        return false;
      }
      if (!isValidSize) {
        setSnackbar({
          open: true,
          message: `${file.name} is too large. Maximum 5MB allowed`,
          severity: "error",
        });
        return false;
      }
      return true;
    });

    // Check total image limit
    if (selectedImages.length + validFiles.length > 5) {
      setSnackbar({
        open: true,
        message: "Maximum 5 images allowed per product",
        severity: "error",
      });
      return;
    }

    setSelectedImages((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  // Upload images to server
  const uploadImages = async (productId: number) => {
    const uploadPromises = selectedImages.map(async (file) => {
      try {
        const response = await adminAPI.uploadProductImage(productId, file);
        return response.image_url;
      } catch (error) {
        console.error("Error uploading image:", error);
        setSnackbar({
          open: true,
          message: `Failed to upload ${file.name}`,
          severity: "error",
        });
        return null;
      }
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    return uploadedUrls.filter((url) => url !== null);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      full_name: "",
      type: "",
      category_id: "",
      retail_price: "",
      offer_price: "",
      buy_price: "",
      sell_price: "",
      stock_quantity: "",
      total_qty: "",
      location: "Store",
      description: "",
      subcategory: "",
      delivery_charges: "0",
    });
    setErrors({});
    setSelectedImages([]);
    setImagePreview([]);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      full_name: product.full_name || "",
      type: product.type || "",
      category_id: product.category_id?.toString() || "",
      retail_price: product.retail_price?.toString() || "",
      offer_price: product.offer_price?.toString() || "",
      buy_price: product.buy_price?.toString() || "",
      sell_price: product.sell_price?.toString() || "",
      stock_quantity: product.stock_quantity?.toString() || "",
      total_qty: product.total_qty?.toString() || "",
      location: product.location || "Store",
      description: product.description || "",
      subcategory: product.subcategory || "",
      delivery_charges: product.delivery_charges?.toString() || "0",
    });
    setErrors({});
    setSelectedImages([]);
    setImagePreview([]);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await adminAPI.deleteProduct(productToDelete);
      setSnackbar({
        open: true,
        message: "Product deleted successfully",
        severity: "success",
      });
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete product",
        severity: "error",
      });
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const productData = {
        ...formData,
        retail_price: parseFloat(formData.retail_price),
        offer_price: formData.offer_price
          ? parseFloat(formData.offer_price)
          : null,
        buy_price: formData.buy_price ? parseFloat(formData.buy_price) : null,
        sell_price: formData.sell_price
          ? parseFloat(formData.sell_price)
          : null,
        stock_quantity: parseInt(formData.stock_quantity),
        total_qty: formData.total_qty ? parseInt(formData.total_qty) : null,
        delivery_charges: parseFloat(formData.delivery_charges),
        category_id: parseInt(formData.category_id),
      };

      let productId;
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, productData);
        productId = editingProduct.id;
        setSnackbar({
          open: true,
          message: "Product updated successfully",
          severity: "success",
        });
      } else {
        const response = await adminAPI.createProduct(productData);
        productId = response.id;
        setSnackbar({
          open: true,
          message: "Product created successfully",
          severity: "success",
        });
      }

      // Upload images if any are selected
      if (selectedImages.length > 0) {
        setSnackbar({
          open: true,
          message: `Uploading ${selectedImages.length} image(s)...`,
          severity: "info",
        });
        const uploadedUrls = await uploadImages(productId);
        if (uploadedUrls.length > 0) {
          setSnackbar({
            open: true,
            message: `${uploadedUrls.length} image(s) uploaded successfully`,
            severity: "success",
          });
        }
      }

      await fetchProducts();
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      setSnackbar({
        open: true,
        message: "Error saving product",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setLoading(true);
      const deletePromises = selectedProducts.map((productId) =>
        adminAPI.deleteProduct(productId)
      );

      await Promise.all(deletePromises);
      setSnackbar({
        open: true,
        message: `${selectedProducts.length} products deleted successfully`,
        severity: "success",
      });
      setSelectedProducts([]);
      fetchProducts();
      fetchAnalytics();
    } catch (error) {
      console.error("Failed to delete some products:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete some products",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setBulkDeleteDialogOpen(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#0f172a" : COLORS.offWhite,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Header with Add Button */}
      <Slide direction="down" in={true} timeout={800}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
            p: 3,
            background: isDarkMode
              ? `linear-gradient(135deg, ${COLORS.deepNavy} 0%, #3730a3 100%)`
              : `linear-gradient(135deg, ${COLORS.deepNavy} 0%, #4f46e5 100%)`,
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(30, 27, 75, 0.2)",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: COLORS.offWhite,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
          >
            Product Management
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => {
                fetchProducts();
                fetchAnalytics();
              }}
              disabled={loading}
              sx={{
                borderColor: COLORS.offWhite,
                color: COLORS.offWhite,
                backgroundColor: "rgba(248, 250, 252, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(248, 250, 252, 0.2)",
                },
              }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAdd}
              sx={{
                backgroundColor: COLORS.offWhite,
                color: COLORS.deepNavy,
                "&:hover": {
                  backgroundColor: "rgba(248, 250, 252, 0.9)",
                },
              }}
            >
              Add Product
            </Button>
          </Box>
        </Box>
      </Slide>

      {/* Analytics Cards */}
      {analytics && (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: cardBgColor,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: "bold",
                          color: primaryColor,
                        }}
                      >
                        {analytics.total_products}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Products
                      </Typography>
                    </Box>
                    <ShoppingBag
                      sx={{
                        fontSize: 40,
                        color: primaryColor,
                        opacity: 0.7,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: cardBgColor,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#f59e0b" }}
                      >
                        {analytics.low_stock_products}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Low Stock
                      </Typography>
                    </Box>
                    <Warning
                      sx={{ fontSize: 40, color: "#f59e0b", opacity: 0.7 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: cardBgColor,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#10b981" }}
                      >
                        PKR {analytics.total_inventory_value?.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Inventory Value
                      </Typography>
                    </Box>
                    <AttachMoney
                      sx={{ fontSize: 40, color: "#10b981", opacity: 0.7 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 2,
                  backgroundColor: cardBgColor,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{ fontWeight: "bold", color: "#3b82f6" }}
                      >
                        {analytics.active_products}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Active Products
                      </Typography>
                    </Box>
                    <TrendingUp
                      sx={{ fontSize: 40, color: "#3b82f6", opacity: 0.7 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Fade>
      )}

      {/* Filters */}
      <Zoom in={true} timeout={800}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            border: `1px solid ${borderColor}`,
            boxShadow: "0 4px 20px rgba(30, 27, 75, 0.08)",
            backgroundColor: cardBgColor,
            transition: "background-color 0.3s ease, border-color 0.3s ease",
          }}
        >
          {/* Search and Filter Controls */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
              flexDirection: isMobile ? "column" : "row",
            }}
          >
            <TextField
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                minWidth: isMobile ? "100%" : isTablet ? "100%" : 600,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                },
              }}
            />
            <FormControl
              sx={{
                minWidth: isMobile ? "100%" : 200,
                "& .MuiOutlinedInput-root": {
                  backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                },
              }}
            >
              <InputLabel>Category Filter</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category Filter"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {selectedProducts.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleBulkDelete}
                sx={{
                  ml: isMobile ? 0 : "auto",
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Delete Selected ({selectedProducts.length})
              </Button>
            )}
          </Box>
        </Paper>
      </Zoom>

      {/* Main Product Management Card */}
      <Grow in={true} timeout={1000}>
        <TableContainer
          component={Paper}
          sx={{
            overflowX: "auto",
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: cardBgColor,
            transition: "background-color 0.3s ease",
            minHeight: products.length === 0 ? "400px" : "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeadingColor} padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedProducts.length > 0 &&
                      selectedProducts.length < products.length
                    }
                    checked={
                      products.length > 0 &&
                      selectedProducts.length === products.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{ color: COLORS.offWhite }}
                  />
                </TableCell>
                <TableCell sx={tableHeadingColor}>Image</TableCell>
                <TableCell sx={tableHeadingColor}>Product Name</TableCell>
                <TableCell sx={tableHeadingColor}>Status</TableCell>
                <TableCell sx={tableHeadingColor}>Inventory</TableCell>
                <TableCell sx={tableHeadingColor}>Category</TableCell>
                <TableCell sx={tableHeadingColor}>Price</TableCell>
                <TableCell sx={tableHeadingColor}>Sale Price</TableCell>
                <TableCell sx={tableHeadingColor}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} sx={{ textAlign: "center", py: 8 }}>
                    <Box sx={{ textAlign: "center" }}>
                      <Inventory
                        sx={{
                          fontSize: 64,
                          color: COLORS.silver,
                          mb: 2,
                          opacity: 0.5,
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ color: textPrimary, mb: 1, fontWeight: 600 }}
                      >
                        No Products Available
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: textSecondary, mb: 3 }}
                      >
                        This product is currently out of stock or not available.
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleAdd}
                        sx={{
                          backgroundColor: primaryColor,
                          "&:hover": {
                            backgroundColor: secondaryColor,
                          },
                        }}
                      >
                        Add New Product
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product, index) => (
                    <TableRow
                      key={product.id}
                      sx={{
                        backgroundColor: isDarkMode
                          ? index % 2 === 0
                            ? "#1e293b"
                            : "#1a2436"
                          : index % 2 === 0
                          ? "#f1f5f9"
                          : "#ffffff",
                        transition: "background-color 0.3s ease",
                        "&:hover": {
                          backgroundColor: isDarkMode
                            ? alpha(primaryColor, 0.1)
                            : alpha(primaryColor, 0.05),
                        },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          sx={{
                            color: isDarkMode ? COLORS.silver : "#64748b",
                            "&.Mui-checked": {
                              color: primaryColor,
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar
                          src={
                            product.images?.[0] || "/placeholder-product.png"
                          }
                          alt={product.name}
                          sx={{ width: 40, height: 40 }}
                        >
                          <PhotoCamera />
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: "medium", color: textPrimary }}
                          >
                            {product.name}
                          </Typography>
                          {product.full_name && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {product.full_name}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.is_active ? "ACTIVE" : "INACTIVE"}
                          color={product.is_active ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" color={textPrimary}>
                            {product.stock_quantity || 0}
                          </Typography>
                          {product.stock_quantity <= 5 &&
                            product.stock_quantity > 0 && (
                              <Chip
                                label="Low Stock"
                                color="warning"
                                size="small"
                              />
                            )}
                          {product.stock_quantity === 0 && (
                            <Chip
                              label="Out of Stock"
                              color="error"
                              size="small"
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: textPrimary }}>
                        {getCategoryName(product.category_id)}
                      </TableCell>
                      <TableCell sx={{ color: textPrimary }}>
                        PKR {product.retail_price?.toLocaleString() || 0}
                      </TableCell>
                      <TableCell>
                        {product.offer_price ? (
                          <Typography
                            variant="body2"
                            sx={{ color: "#10b981", fontWeight: "medium" }}
                          >
                            PKR {product.offer_price.toLocaleString()}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No offer
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(product)}
                          size="small"
                          sx={{
                            color: primaryColor,
                            "&:hover": {
                              backgroundColor: alpha(primaryColor, 0.1),
                            },
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(product.id)}
                          size="small"
                          sx={{
                            color: isDarkMode ? "#ef4444" : "#dc2626",
                            "&:hover": {
                              backgroundColor: isDarkMode
                                ? alpha("#ef4444", 0.1)
                                : alpha("#dc2626", 0.1),
                            },
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
          {products.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                color: textPrimary,
                backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9",
                borderTop: `1px solid ${borderColor}`,
              }}
            />
          )}
        </TableContainer>
      </Grow>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: cardBgColor,
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ color: textPrimary }}>
          {editingProduct ? "Edit Product" : "Add Product"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Product Name"
                value={formData.full_name}
                onChange={handleChange("full_name")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Type"
                value={formData.type}
                onChange={handleChange("type")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={!!errors.category_id}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              >
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category_id}
                  onChange={handleChange("category_id")}
                  label="Category"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.category_id && (
                  <Typography variant="caption" color="error" sx={{ ml: 2 }}>
                    {errors.category_id}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Retail Price (PKR)"
                type="number"
                value={formData.retail_price}
                onChange={handleChange("retail_price")}
                error={!!errors.retail_price}
                helperText={errors.retail_price}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Offer Price (PKR)"
                type="number"
                value={formData.offer_price}
                onChange={handleChange("offer_price")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Buy Price (PKR)"
                type="number"
                value={formData.buy_price}
                onChange={handleChange("buy_price")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sell Price (PKR)"
                type="number"
                value={formData.sell_price}
                onChange={handleChange("sell_price")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleChange("stock_quantity")}
                error={!!errors.stock_quantity}
                helperText={errors.stock_quantity}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Quantity"
                type="number"
                value={formData.total_qty}
                onChange={handleChange("total_qty")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              >
                <InputLabel>Location</InputLabel>
                <Select
                  value={formData.location}
                  onChange={handleChange("location")}
                  label="Location"
                >
                  <MenuItem value="Store">Store</MenuItem>
                  <MenuItem value="Warehouse">Warehouse</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Subcategory"
                value={formData.subcategory}
                onChange={handleChange("subcategory")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Charges (PKR)"
                type="number"
                value={formData.delivery_charges}
                onChange={handleChange("delivery_charges")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange("description")}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  },
                }}
              />
            </Grid>
            {/* Image Upload Section */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2, color: textPrimary }}>
                Product Images
              </Typography>

              {/* Upload Button */}
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{
                    py: 2,
                    borderColor: primaryColor,
                    color: primaryColor,
                    "&:hover": {
                      borderColor: primaryColor,
                      backgroundColor: alpha(primaryColor, 0.04),
                    },
                  }}
                  disabled={selectedImages.length >= 5}
                >
                  {selectedImages.length >= 5
                    ? "Maximum 5 images allowed"
                    : "Upload Product Images"}
                </Button>
              </label>

              {/* Image Preview Grid */}
              {imagePreview.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Selected Images ({selectedImages.length}/5):
                  </Typography>
                  <Grid container spacing={1}>
                    {imagePreview.map((preview, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Card sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height="100"
                            image={preview}
                            alt={`Preview ${index + 1}`}
                            sx={{ objectFit: "cover" }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              backgroundColor: "rgba(0, 0, 0, 0.6)",
                              color: "white",
                              "&:hover": {
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {/* Upload Info */}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                Maximum 5 images, 5MB each. Supported formats: JPG, PNG, GIF,
                WebP
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsModalOpen(false)}
            sx={{ color: textSecondary }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              backgroundColor: primaryColor,
              "&:hover": {
                backgroundColor: secondaryColor,
              },
            }}
          >
            {editingProduct ? "Update" : "Add"} Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: cardBgColor,
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ color: textPrimary }}>Delete Product</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: textPrimary }}>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: textSecondary }}
          >
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog
        open={bulkDeleteDialogOpen}
        onClose={() => setBulkDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: cardBgColor,
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ color: textPrimary }}>
          Delete Selected Products
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: textPrimary }}>
            Are you sure you want to delete {selectedProducts.length} selected
            products? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBulkDeleteDialogOpen(false)}
            sx={{ color: textSecondary }}
          >
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={confirmBulkDelete}>
            Delete {selectedProducts.length} Products
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box
          sx={{
            backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
            color: isDarkMode ? "#f8fafc" : "#1e293b",
            borderRadius: 2,
            p: 2,
            boxShadow: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
            border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
            minWidth: 300,
          }}
        >
          {snackbar.severity === "success" && (
            <CheckCircle sx={{ color: "#10b981" }} />
          )}
          {snackbar.severity === "error" && (
            <Warning sx={{ color: "#ef4444" }} />
          )}
          {snackbar.severity === "warning" && (
            <Warning sx={{ color: "#f59e0b" }} />
          )}
          {snackbar.severity === "info" && <Info sx={{ color: "#3b82f6" }} />}
          <Typography variant="body2">{snackbar.message}</Typography>
          <IconButton
            size="small"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ ml: "auto", color: "inherit" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default AdminProducts;
