import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Typography,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  Fab,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { adminAPI, productAPI } from "../../../services/api";

interface Product {
  id: number;
  name: string;
  image?: string;
  color?: string;
  size?: string;
  total_qty: number;
  buy_price: number;
  sell_price: number;
  purchased_from?: string;
  total_available: number;
  category?: string;
  status?: string;
}

const tableHeadingColor = {
  backgroundColor: "#1E1B4B",
  color: "#ffffff",
  fontWeight: 600,
};

const AdminInventory: React.FC = () => {
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inventory, setInventory] = useState<Product[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);

  // Form state for add/edit
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    color: "",
    size: "",
    total_qty: 0,
    buy_price: 0,
    sell_price: 0,
    purchased_from: "",
    total_available: 0,
    category: "",
  });

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await adminAPI.getAllCategories();
      setCategories(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch categories",
        severity: "error",
      });
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllProducts();
      const processedData = data.map((item: any) => ({
        id: item.id,
        name: item.name || item.title || "Unnamed Product",
        image: item.image_url || item.image || "",
        color: item.color || item.variant_color || "N/A",
        size: item.size || item.variant_size || "N/A",
        total_qty: item.stock_quantity || item.stock || item.total_qty || 0,
        buy_price: item.buy_price || item.cost_price || item.retail_price || 0,
        sell_price: item.sell_price || item.offer_price || item.price || 0,
        purchased_from: item.purchased_from || item.supplier || "Unknown",
        total_available:
          item.stock_quantity || item.stock || item.total_qty || 0,
        category: item.category
          ? typeof item.category === 'object'
            ? item.category.name
            : item.category
          : item.subcategory || "General",
        status: getStockStatus(item.stock_quantity || item.stock || 0),
      }));
      setInventory(processedData);
      setFilteredInventory(processedData);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch inventory data",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (currentStock: number) => {
    if (currentStock === 0) return "out";
    if (currentStock < 5) return "low";
    return "normal";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "low":
        return "warning";
      case "out":
        return "error";
      case "normal":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "low":
        return "LOW STOCK";
      case "out":
        return "OUT OF STOCK";
      case "normal":
        return "IN STOCK";
      default:
        return "UNKNOWN";
    }
  };

  // CRUD Operations
  const handleAddProduct = async () => {
    try {
      const newProduct = await adminAPI.createProduct(formData);

      // Upload images if any are selected
      if (selectedImages.length > 0) {
        setSnackbar({
          open: true,
          message: "Product created, uploading images...",
          severity: "info",
        });
        await uploadImages(newProduct.id);
        setSnackbar({
          open: true,
          message: "Product and images added successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Product added successfully",
          severity: "success",
        });
      }

      setInventory([...inventory, newProduct]);
      setFilteredInventory([...filteredInventory, newProduct]);
      setIsAddModalOpen(false);
      resetForm();

      // Refresh inventory to get updated product with images
      fetchInventory();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add product",
        severity: "error",
      });
    }
  };

  const handleEditProduct = async () => {
    if (!editingItem) return;
    try {
      const updatedProduct = await adminAPI.updateProduct(
        editingItem.id,
        formData
      );

      // Upload new images if any are selected
      if (selectedImages.length > 0) {
        setSnackbar({
          open: true,
          message: "Product updated, uploading new images...",
          severity: "info",
        });
        await uploadImages(editingItem.id);
        setSnackbar({
          open: true,
          message: "Product and images updated successfully",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Product updated successfully",
          severity: "success",
        });
      }

      const updatedInventory = inventory.map((item) =>
        item.id === editingItem.id ? { ...item, ...updatedProduct } : item
      );
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
      setIsEditModalOpen(false);
      resetForm();

      // Refresh inventory to get updated product with new images
      fetchInventory();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update product",
        severity: "error",
      });
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await adminAPI.deleteProduct(id);
      const updatedInventory = inventory.filter((item) => item.id !== id);
      setInventory(updatedInventory);
      setFilteredInventory(updatedInventory);
      setSnackbar({
        open: true,
        message: "Product deleted successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete product",
        severity: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      color: "",
      size: "",
      total_qty: 0,
      buy_price: 0,
      sell_price: 0,
      purchased_from: "",
      total_available: 0,
      category: "",
    });
    setEditingItem(null);
    setSelectedImages([]);
    setImagePreview([]);
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

  const openEditModal = (product: Product) => {
    setEditingItem(product);
    setFormData(product);
    setIsEditModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Filtering and search with category-based product fetching
  const applyFilters = async () => {
    let filtered = inventory;

    // If a specific category is selected, try different API approaches
    if (categoryFilter !== "all") {
      try {
        // First try the productAPI endpoint which exists
        const categoryProducts = await productAPI.getProductsByCategory(
          categoryFilter
        );
        filtered = categoryProducts.map((item: any) => ({
          id: item.id,
          name: item.name || item.title || "Unnamed Product",
          image: item.image_url || item.image || "",
          color: item.color || item.variant_color || "N/A",
          size: item.size || item.variant_size || "N/A",
          total_qty: item.stock_quantity || item.stock || item.total_qty || 0,
          buy_price:
            item.buy_price || item.cost_price || item.retail_price || 0,
          sell_price: item.sell_price || item.offer_price || item.price || 0,
          purchased_from: item.purchased_from || item.supplier || "Unknown",
          total_available:
            item.stock_quantity || item.stock || item.total_qty || 0,
          category:
            typeof item.category === "object"
              ? item.category?.name
              : item.category || item.subcategory || "General",
          status: getStockStatus(item.stock_quantity || item.stock || 0),
        }));
      } catch (error) {
        // Fallback to client-side filtering if API fails
        console.warn(
          "Category API failed, using client-side filtering:",
          error
        );
        filtered = inventory.filter(
          (item) =>
            item.category &&
            item.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }
    }

    if (searchText) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.category &&
            item.category.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredInventory(filtered);
    setPage(0);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, categoryFilter, statusFilter, inventory]);

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        transition: "all 0.3s ease",
      }}
    >
      {/* Header with Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 3,
          background: "linear-gradient(135deg, #2c6e49 0%, #4a8b6a 100%)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(44, 110, 73, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          Inventory Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddModal}
          sx={{
            backgroundColor: "#2c6e49",
            color: "#ffffff",
            "&:hover": {
              backgroundColor: "#1e4d33",
            },
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          border: "1px solid rgba(44, 110, 73, 0.1)",
          boxShadow: "0 4px 20px rgba(44, 110, 73, 0.08)",
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 2, color: "text.primary", fontWeight: 600 }}
        >
          Filter Products
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "primary.main" }} />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "text.primary" }}>Category</InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                label="Category"
                sx={{
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "text.primary" }}>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
                sx={{
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "primary.main",
                  },
                }}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="normal">In Stock</MenuItem>
                <MenuItem value="low">Low Stock</MenuItem>
                <MenuItem value="out">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Material-UI Table */}
      <>
        <TableContainer
          sx={{
            maxHeight: 600,
            overflowX: "auto",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeadingColor}>ID</TableCell>
                <TableCell sx={tableHeadingColor}>Image</TableCell>
                <TableCell sx={tableHeadingColor}>Product Name</TableCell>
                <TableCell sx={tableHeadingColor}>Color</TableCell>
                <TableCell sx={tableHeadingColor}>Size</TableCell>
                <TableCell sx={tableHeadingColor}>Total QTY</TableCell>
                <TableCell sx={tableHeadingColor}>Buy Price</TableCell>
                <TableCell sx={tableHeadingColor}>Sell Price</TableCell>
                <TableCell sx={tableHeadingColor}>Purchased From</TableCell>
                <TableCell sx={tableHeadingColor}>Available</TableCell>
                <TableCell sx={tableHeadingColor}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInventory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(44, 110, 73, 0.1)",
                        transform: "scale(1.01)",
                        transition: "all 0.2s ease",
                      },
                    }}
                  >
                    <TableCell sx={{ color: "text.primary", fontWeight: 500 }}>
                      {product.id.toString().padStart(6, "0")}
                    </TableCell>
                    <TableCell>
                      {product.image ? (
                        <Avatar
                          src={product.image}
                          alt={product.name}
                          sx={{ border: "2px solid #2c6e49" }}
                        />
                      ) : (
                        <Avatar
                          sx={{ backgroundColor: "#2c6e49", color: "#ffffff" }}
                        >
                          <ImageIcon />
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell sx={{ color: "text.primary", fontWeight: 500 }}>
                      {product.name}
                    </TableCell>
                    <TableCell>{product.color}</TableCell>
                    <TableCell>{product.size}</TableCell>
                    <TableCell>{product.total_qty}</TableCell>
                    <TableCell>PKR {product.buy_price}</TableCell>
                    <TableCell>PKR {product.sell_price}</TableCell>
                    <TableCell>{product.purchased_from}</TableCell>
                    <TableCell>
                      <Chip
                        label={`${product.total_available}`}
                        color={getStatusColor(product.status || "normal")}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          "& .MuiChip-label": {
                            color:
                              product.status === "normal"
                                ? "#ffffff"
                                : "#000000",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => openEditModal(product)}
                        sx={{
                          color: "#2c6e49",
                          "&:hover": {
                            backgroundColor: "rgba(44, 110, 73, 0.1)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteProduct(product.id)}
                        sx={{
                          color: "#6E2C51",
                          "&:hover": {
                            backgroundColor: "rgba(110, 44, 81, 0.1)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredInventory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </>

      {/* Add Product Modal */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Size"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Quantity"
                type="number"
                value={formData.total_qty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_qty: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Buy Price"
                type="number"
                value={formData.buy_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buy_price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sell Price"
                type="number"
                value={formData.sell_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sell_price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Purchased From"
                value={formData.purchased_from}
                onChange={(e) =>
                  setFormData({ ...formData, purchased_from: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "2px dashed #2c6e49",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "rgba(44, 110, 73, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#6E2C51",
                    backgroundColor: "rgba(110, 44, 81, 0.05)",
                  },
                }}
              >
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
                    sx={{
                      mb: 2,
                      borderColor: "#2c6e49",
                      color: "#2c6e49",
                      "&:hover": {
                        borderColor: "#6E2C51",
                        color: "#6E2C51",
                        backgroundColor: "rgba(110, 44, 81, 0.1)",
                      },
                    }}
                  >
                    Upload Images
                  </Button>
                </label>
                <Typography variant="body2" sx={{ color: "#000000", mb: 1 }}>
                  Select multiple images for this product (Max 5 images, 5MB
                  each)
                </Typography>
                <Typography variant="caption" sx={{ color: "#666666" }}>
                  Supported formats: JPG, PNG, GIF, WebP
                </Typography>

                {/* Upload Progress Info */}
                {selectedImages.length > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: "rgba(44, 110, 73, 0.1)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c6e49", fontWeight: 600 }}
                    >
                      {selectedImages.length} image
                      {selectedImages.length !== 1 ? "s" : ""} selected
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666666" }}>
                      Images will be uploaded when you save the product
                    </Typography>
                  </Box>
                )}

                {/* Image Preview */}
                {imagePreview.length > 0 && (
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      justifyContent: "center",
                    }}
                  >
                    {imagePreview.map((preview, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: 120,
                          height: 120,
                          border: "2px solid #2c6e49",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "#6E2C51",
                            color: "#ffffff",
                            "&:hover": {
                              backgroundColor: "#8B3A62",
                              transform: "scale(1.1)",
                            },
                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}
                          onClick={() => removeImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "rgba(44, 110, 73, 0.8)",
                            color: "#ffffff",
                            textAlign: "center",
                            py: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            Image {index + 1}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddProduct} variant="contained">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Size"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Quantity"
                type="number"
                value={formData.total_qty}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_qty: parseInt(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Buy Price"
                type="number"
                value={formData.buy_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    buy_price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sell Price"
                type="number"
                value={formData.sell_price}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sell_price: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Purchased From"
                value={formData.purchased_from}
                onChange={(e) =>
                  setFormData({ ...formData, purchased_from: e.target.value })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  label="Category"
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "2px dashed #2c6e49",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  backgroundColor: "rgba(44, 110, 73, 0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    borderColor: "#6E2C51",
                    backgroundColor: "rgba(110, 44, 81, 0.05)",
                  },
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="edit-image-upload"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="edit-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{
                      mb: 2,
                      borderColor: "#2c6e49",
                      color: "#2c6e49",
                      "&:hover": {
                        borderColor: "#6E2C51",
                        color: "#6E2C51",
                        backgroundColor: "rgba(110, 44, 81, 0.1)",
                      },
                    }}
                  >
                    Upload Images
                  </Button>
                </label>
                <Typography variant="body2" sx={{ color: "#000000", mb: 1 }}>
                  Select multiple images for this product (Max 5 images, 5MB
                  each)
                </Typography>
                <Typography variant="caption" sx={{ color: "#666666" }}>
                  Supported formats: JPG, PNG, GIF, WebP
                </Typography>

                {/* Upload Progress Info */}
                {selectedImages.length > 0 && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: "rgba(44, 110, 73, 0.1)",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ color: "#2c6e49", fontWeight: 600 }}
                    >
                      {selectedImages.length} image
                      {selectedImages.length !== 1 ? "s" : ""} selected
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666666" }}>
                      Images will be uploaded when you save the product
                    </Typography>
                  </Box>
                )}

                {/* Image Preview */}
                {imagePreview.length > 0 && (
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      justifyContent: "center",
                    }}
                  >
                    {imagePreview.map((preview, index) => (
                      <Box
                        key={index}
                        sx={{
                          position: "relative",
                          width: 120,
                          height: 120,
                          border: "2px solid #2c6e49",
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            backgroundColor: "#6E2C51",
                            color: "#ffffff",
                            "&:hover": {
                              backgroundColor: "#8B3A62",
                              transform: "scale(1.1)",
                            },
                            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                          }}
                          onClick={() => removeImage(index)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "rgba(44, 110, 73, 0.8)",
                            color: "#ffffff",
                            textAlign: "center",
                            py: 0.5,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{ fontSize: "0.7rem" }}
                          >
                            Image {index + 1}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEditProduct} variant="contained">
            Update Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button for Refresh */}
      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#2c6e49",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#6E2C51",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s ease-in-out",
        }}
        onClick={fetchInventory}
      >
        <RefreshIcon />
      </Fab>
    </Box>
  );
};

export default AdminInventory;
