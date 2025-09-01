import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  TablePagination,
  Avatar,
  Tooltip,
  InputAdornment,
  Checkbox,
  Stack,
  Divider
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Upload,
  ShoppingBag,
  Search,
  FilterList,
  Inventory,
  TrendingUp,
  Warning,
  AttachMoney,
  Visibility,
  PhotoCamera
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { adminAPI } from '../../services/api';

const AdminProducts: React.FC = () => {
  const theme = useTheme();

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    full_name: '',
    type: '',
    category_id: '',
    retail_price: '',
    offer_price: '',
    buy_price: '',
    sell_price: '',
    stock_quantity: '',
    total_qty: '',
    location: 'Store',
    description: '',
    subcategory: '',
    delivery_charges: '0'
  });
  const [errors, setErrors] = useState<any>({});

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
      if (selectedCategory !== 'all') {
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
      console.error('Failed to fetch products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await adminAPI.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const data = await adminAPI.getProductAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name) newErrors.name = 'Product name is required';
    if (!formData.category_id) newErrors.category_id = 'Category is required';
    if (!formData.retail_price) newErrors.retail_price = 'Retail price is required';
    if (!formData.stock_quantity) newErrors.stock_quantity = 'Stock quantity is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      full_name: '',
      type: '',
      category_id: '',
      retail_price: '',
      offer_price: '',
      buy_price: '',
      sell_price: '',
      stock_quantity: '',
      total_qty: '',
      location: 'Store',
      description: '',
      subcategory: '',
      delivery_charges: '0'
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      full_name: product.full_name || '',
      type: product.type || '',
      category_id: product.category_id?.toString() || '',
      retail_price: product.retail_price?.toString() || '',
      offer_price: product.offer_price?.toString() || '',
      buy_price: product.buy_price?.toString() || '',
      sell_price: product.sell_price?.toString() || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      total_qty: product.total_qty?.toString() || '',
      location: product.location || 'Store',
      description: product.description || '',
      subcategory: product.subcategory || '',
      delivery_charges: product.delivery_charges?.toString() || '0'
    });
    setErrors({});
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
      alert('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product');
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const productData = {
        name: formData.name,
        full_name: formData.full_name,
        type: formData.type,
        category_id: parseInt(formData.category_id),
        retail_price: parseFloat(formData.retail_price),
        offer_price: formData.offer_price ? parseFloat(formData.offer_price) : null,
        buy_price: formData.buy_price ? parseFloat(formData.buy_price) : null,
        sell_price: formData.sell_price ? parseFloat(formData.sell_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
        total_qty: formData.total_qty ? parseInt(formData.total_qty) : parseInt(formData.stock_quantity),
        location: formData.location,
        description: formData.description,
        subcategory: formData.subcategory,
        delivery_charges: parseFloat(formData.delivery_charges),
        is_active: true
      };
      
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id, productData);
        alert('Product updated successfully');
      } else {
        await adminAPI.createProduct(productData);
        alert('Product added successfully');
      }
      
      setIsModalOpen(false);
      fetchProducts();
      fetchAnalytics();
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('Failed to save product');
    }
  };

  const handleChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectProduct = (productId: number) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      setLoading(true);
      const deletePromises = selectedProducts.map(productId =>
        adminAPI.deleteProduct(productId)
      );
      
      await Promise.all(deletePromises);
      alert(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      fetchProducts();
      fetchAnalytics();
    } catch (error) {
      console.error('Failed to delete some products:', error);
      alert('Failed to delete some products');
    } finally {
      setLoading(false);
      setBulkDeleteDialogOpen(false);
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Analytics Cards */}
      {analytics && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                      {analytics.total_products}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Products
                    </Typography>
                  </Box>
                  <ShoppingBag sx={{ fontSize: 40, color: theme.palette.primary.main, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                      {analytics.low_stock_products}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low Stock
                    </Typography>
                  </Box>
                  <Warning sx={{ fontSize: 40, color: '#ff9800', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                      PKR {analytics.total_inventory_value?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inventory Value
                    </Typography>
                  </Box>
                  <AttachMoney sx={{ fontSize: 40, color: '#4caf50', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                      {analytics.active_products}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Products
                    </Typography>
                  </Box>
                  <TrendingUp sx={{ fontSize: 40, color: '#2196f3', opacity: 0.7 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Main Product Management Card */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingBag sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h5" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                Product Management
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => { fetchProducts(); fetchAnalytics(); }}
                disabled={loading}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAdd}
              >
                Add Product
              </Button>
            </Box>
          </Box>

          {/* Search and Filter Controls */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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
              sx={{ minWidth: 300 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
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
              >
                Delete Selected ({selectedProducts.length})
              </Button>
            )}
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                      checked={products.length > 0 && selectedProducts.length === products.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Inventory</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Sale Price</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  products
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((product) => (
                      <TableRow key={product.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <Avatar
                            src={product.images?.[0] || '/placeholder-product.png'}
                            alt={product.name}
                            sx={{ width: 40, height: 40 }}
                          >
                            <PhotoCamera />
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                              {product.name}
                            </Typography>
                            {product.full_name && (
                              <Typography variant="caption" color="text.secondary">
                                {product.full_name}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={product.is_active ? 'ACTIVE' : 'INACTIVE'}
                            color={product.is_active ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {product.stock_quantity || 0}
                            </Typography>
                            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                              <Chip label="Low Stock" color="warning" size="small" />
                            )}
                            {product.stock_quantity === 0 && (
                              <Chip label="Out of Stock" color="error" size="small" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {getCategoryName(product.category_id)}
                        </TableCell>
                        <TableCell>
                          PKR {product.retail_price?.toLocaleString() || 0}
                        </TableCell>
                        <TableCell>
                          {product.offer_price ? (
                            <Typography variant="body2" sx={{ color: '#4caf50', fontWeight: 'medium' }}>
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
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(product.id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Product Name"
                value={formData.full_name}
                onChange={handleChange('full_name')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Type"
                value={formData.type}
                onChange={handleChange('type')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.category_id}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category_id}
                  onChange={handleChange('category_id')}
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
                onChange={handleChange('retail_price')}
                error={!!errors.retail_price}
                helperText={errors.retail_price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Offer Price (PKR)"
                type="number"
                value={formData.offer_price}
                onChange={handleChange('offer_price')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Buy Price (PKR)"
                type="number"
                value={formData.buy_price}
                onChange={handleChange('buy_price')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sell Price (PKR)"
                type="number"
                value={formData.sell_price}
                onChange={handleChange('sell_price')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={handleChange('stock_quantity')}
                error={!!errors.stock_quantity}
                helperText={errors.stock_quantity}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Quantity"
                type="number"
                value={formData.total_qty}
                onChange={handleChange('total_qty')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={formData.location}
                  onChange={handleChange('location')}
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
                onChange={handleChange('subcategory')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Delivery Charges (PKR)"
                type="number"
                value={formData.delivery_charges}
                onChange={handleChange('delivery_charges')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange('description')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                fullWidth
                sx={{ py: 2 }}
              >
                Upload Product Images
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingProduct ? 'Update' : 'Add'} Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <Dialog open={bulkDeleteDialogOpen} onClose={() => setBulkDeleteDialogOpen(false)}>
        <DialogTitle>Delete Selected Products</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {selectedProducts.length} selected products? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBulkDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmBulkDelete}>
            Delete {selectedProducts.length} Products
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProducts;