import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  CircularProgress,
  Paper,
  Alert,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Avatar
} from "@mui/material";
import {
  ShoppingBag,
  Person,
  AttachMoney,
  TrendingUp,
  Visibility,
  Warning,
  ShoppingCart,
  Inventory,
  Groups,
  MonetizationOn,
  LocalOffer,
  PendingActions,
  BarChart,
  Assessment,
  Speed,
  NotificationsActive,
  Analytics,
  RecentActors,
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Info
} from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';
import { adminAPI } from "../../services/api";

const AdminDashboard: React.FC = () => {
  const theme = useTheme();

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
  });
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [products, orders] = await Promise.all([
        adminAPI.getAllProducts(),
        adminAPI.getAllOrders()
      ]);

      const lowStock = products.filter((product: any) =>
        (product.stock_quantity || product.stock || 0) < 10
      ).map((product: any) => ({
        id: product.id,
        name: product.name,
        stock: product.stock_quantity || product.stock || 0,
        threshold: 10
      }));

      setLowStockItems(lowStock);
      const sortedOrders = orders.sort((a: any, b: any) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setRecentOrders(sortedOrders.slice(0, 3));

      const categories = ['Anklets', 'Bangles', 'Bracelets', 'Combos', 'Ear Studs', 'Earrings', 'Hoops', 'Pendants', 'Rings', 'Wall Frame Design', 'Hair Accessories'];
      const categoryData = categories.map(category => {
        const categoryProducts = products.filter((product: any) =>
          product.subcategory?.toLowerCase().includes(category.toLowerCase()) ||
          product.category?.toLowerCase().includes(category.toLowerCase())
        );
        return {
          category,
          totalProducts: categoryProducts.length,
          totalStock: categoryProducts.reduce((sum: number, product: any) => sum + (product.stock_quantity || product.stock || 0), 0),
          totalSold: categoryProducts.reduce((sum: number, product: any) => sum + (product.sold || 0), 0)
        };
      });
      setCategoryStats(categoryData);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0),
        totalCustomers: new Set(orders.map((order: any) => order.customer_email)).size,
        lowStockProducts: lowStock.length,
        pendingOrders: orders.filter((order: any) => order.status === 'pending').length,
      });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch dashboard data', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "secondary";
      case "delivered":
        return "success";
      default:
        return "default";
    }
  };

  const handleActionClick = (event: React.MouseEvent<HTMLElement>, order: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleViewDetails = async () => {
    try {
      setLoadingDetails(true);
      const details = await adminAPI.getOrderDetails(selectedOrder.id);
      setOrderDetails(details);
      setOrderDetailsOpen(true);
      handleActionClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to fetch order details', severity: 'error' });
      handleActionClose();
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await adminAPI.updateOrderStatus(selectedOrder.id, { status: newStatus });
      setSnackbar({ open: true, message: `Order status updated to ${newStatus}`, severity: 'success' });
      // Refresh data after status update
      fetchDashboardData();
      handleActionClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update order status', severity: 'error' });
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await adminAPI.deleteOrder(selectedOrder.id);
      setSnackbar({ open: true, message: 'Order deleted successfully', severity: 'success' });
      // Refresh data after deletion
      fetchDashboardData();
      handleActionClose();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete order', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const StatCard = ({ title, value, icon, gradient, textColor = '#fff', subtitle }: any) => (
    <Card sx={{
      height: '100%',
      background: gradient,
      color: textColor,
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }
    }}>
      <CardContent sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" sx={{ color: textColor, opacity: 0.9, mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: textColor, fontWeight: 'bold', mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: textColor, opacity: 0.8 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{
            color: textColor,
            fontSize: 40,
            opacity: 0.9,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, minHeight: '100vh' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, color: '#1a202c' }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.7, color: '#4a5568' }}>
          Welcome back! Here's what's happening with your store today.
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Assessment sx={{ mr: 2, color: '#4a5568', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
          Key Metrics & Performance Indicators
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            subtitle="Items in catalog"
            icon={<Inventory />}
            gradient="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            subtitle="Orders received"
            icon={<ShoppingCart />}
            gradient="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Revenue"
            value={`PKR ${stats.totalRevenue.toLocaleString()}`}
            subtitle="Total earnings"
            icon={<MonetizationOn />}
            gradient="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            subtitle="Registered users"
            icon={<Groups />}
            gradient="#7b1fa2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockProducts}
            subtitle="Need restocking"
            icon={<Warning />}
            gradient="#f57c00"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2}>
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            subtitle="Awaiting processing"
            icon={<PendingActions />}
            gradient="#455a64"
          />
        </Grid>
      </Grid>

      {/* Quick Insights */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <NotificationsActive sx={{ mr: 2, color: '#4a5568', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
          Quick Insights
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} lg={6}>
          <Card sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#fed7d7',
                  mr: 2
                }}>
                  <TrendingUp sx={{ color: '#e53e3e', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a202c' }}>Low Stock Alerts</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Items running low in inventory
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#e53e3e', mb: 2 }}>
                {stats.lowStockProducts}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                products need immediate restocking
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Stock</TableCell>
                      <TableCell>Level</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.stock}
                            color={item.stock === 0 ? 'error' : item.stock < 5 ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min((item.stock / item.threshold) * 100, 100)}
                            color={item.stock === 0 ? 'error' : item.stock < 5 ? 'warning' : 'success'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card sx={{
            height: '100%',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#bee3f8',
                  mr: 2
                }}>
                  <PendingActions sx={{ color: '#3182ce', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a202c' }}>Pending Orders</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Orders awaiting your attention
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3182ce', mb: 2 }}>
                {stats.pendingOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                orders need processing
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.totalOrders > 0 ? (stats.pendingOrders / stats.totalOrders) * 100 : 0}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#e2e8f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#3182ce'
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Statistics */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Analytics sx={{ mr: 2, color: '#4a5568', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
          Category Performance
        </Typography>
      </Box>
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12}>
          <Card sx={{
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: '#e6f3ff',
                  mr: 2
                }}>
                  <Analytics sx={{ color: '#2563eb', fontSize: 24 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a202c' }}>Category Statistics</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Performance breakdown by product categories
                  </Typography>
                </Box>
              </Box>
              <TableContainer>
                <Table sx={{ '& .MuiTableHead-root': { backgroundColor: '#f8fafc' } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>Total Products</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>Stock Available</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>Total Sold</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryStats.map((category, index) => (
                      <TableRow 
                        key={category.category}
                        sx={{ 
                          '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                          '&:hover': { backgroundColor: '#f5f5f5' },
                          transition: 'background-color 0.2s ease'
                        }}
                      >
                        <TableCell sx={{ 
                          fontWeight: 600, 
                          color: '#1f2937',
                          fontSize: '0.875rem',
                          borderLeft: '4px solid #3b82f6',
                          pl: 2
                        }}>
                          {category.category}
                        </TableCell>
                        <TableCell sx={{ color: '#4b5563', fontWeight: 500 }}>
                          {category.totalProducts}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={category.totalStock}
                            size="small"
                            sx={{
                              backgroundColor: category.totalStock > 50 ? '#dcfce7' : category.totalStock > 20 ? '#fef3c7' : '#fee2e2',
                              color: category.totalStock > 50 ? '#166534' : category.totalStock > 20 ? '#92400e' : '#dc2626',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={category.totalSold} 
                            size="small"
                            sx={{
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              fontWeight: 600,
                              fontSize: '0.75rem'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <RecentActors sx={{ mr: 2, color: '#4a5568', fontSize: 28 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
          Recent Activity
        </Typography>
      </Box>
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: '#f0f9ff',
              mr: 2
            }}>
              <RecentActors sx={{ color: '#0ea5e9', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a202c' }}>Recent Orders</Typography>
              <Typography variant="body2" color="text.secondary">
                Latest customer orders and transactions
              </Typography>
            </Box>
          </Box>
          <TableContainer>
            <Table sx={{ '& .MuiTableHead-root': { backgroundColor: '#f8fafc' } }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>Order ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#374151', fontSize: '0.875rem', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order, index) => (
                  <TableRow 
                    key={order.id}
                    sx={{ 
                      '&:nth-of-type(odd)': { backgroundColor: '#fafafa' },
                      '&:hover': { backgroundColor: '#f5f5f5' },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell sx={{ 
                      fontWeight: 600, 
                      color: '#1f2937',
                      fontSize: '0.875rem',
                      borderLeft: '4px solid #10b981',
                      pl: 2
                    }}>
                      #{order.order_number || `ORD-${order.id}`}
                    </TableCell>
                    <TableCell sx={{ color: '#4b5563', fontWeight: 500 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          backgroundColor: '#e0e7ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          <Person sx={{ fontSize: 16, color: '#4f46e5' }} />
                        </Box>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937' }}>
                            {order.customer_name || 'N/A'}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6b7280' }}>
                            {order.customer_email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <MonetizationOn sx={{ fontSize: 16, color: '#059669', mr: 1 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>
                          PKR {(order.total_amount || 0).toLocaleString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status?.toUpperCase() || 'PENDING'}
                        size="small"
                        sx={{
                          backgroundColor: 
                            order.status === 'delivered' ? '#dcfce7' :
                            order.status === 'shipped' ? '#dbeafe' :
                            order.status === 'processing' ? '#fef3c7' :
                            '#fee2e2',
                          color: 
                            order.status === 'delivered' ? '#166534' :
                            order.status === 'shipped' ? '#1e40af' :
                            order.status === 'processing' ? '#92400e' :
                            '#dc2626',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#4b5563' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6b7280' }}>
                        {new Date(order.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Tooltip title="More actions">
                        <IconButton
                          onClick={(e) => handleActionClick(e, order)}
                          sx={{
                            backgroundColor: '#f3f4f6',
                            '&:hover': {
                              backgroundColor: '#e5e7eb',
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                          size="small"
                        >
                          <MoreVert sx={{ fontSize: 18, color: '#4b5563' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleActionClose}
            PaperProps={{
              sx: {
                borderRadius: 2,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid #e5e7eb'
              }
            }}
          >
            <MenuItem onClick={handleViewDetails} sx={{ py: 1.5, px: 2 }}>
              <Info sx={{ mr: 2, fontSize: 18, color: '#3b82f6' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>View Details</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleUpdateStatus('processing')} sx={{ py: 1.5, px: 2 }}>
              <Edit sx={{ mr: 2, fontSize: 18, color: '#f59e0b' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Mark Processing</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleUpdateStatus('shipped')} sx={{ py: 1.5, px: 2 }}>
              <CheckCircle sx={{ mr: 2, fontSize: 18, color: '#10b981' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Mark Shipped</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleUpdateStatus('delivered')} sx={{ py: 1.5, px: 2 }}>
              <CheckCircle sx={{ mr: 2, fontSize: 18, color: '#059669' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>Mark Delivered</Typography>
            </MenuItem>
            <MenuItem onClick={handleDeleteOrder} sx={{ py: 1.5, px: 2, color: '#dc2626' }}>
              <Delete sx={{ mr: 2, fontSize: 18, color: '#dc2626' }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#dc2626' }}>Delete Order</Typography>
            </MenuItem>
          </Menu>

          {/* Order Details Dialog */}
          <Dialog 
            open={orderDetailsOpen} 
            onClose={() => setOrderDetailsOpen(false)}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 3,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }
            }}
          >
            <DialogTitle sx={{ 
              backgroundColor: '#f8fafc', 
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Info sx={{ mr: 2, color: '#3b82f6' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Order Details - #{orderDetails?.order_number || selectedOrder?.order_number || selectedOrder?.id}
              </Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
              {loadingDetails ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
                  <CircularProgress />
                </Box>
              ) : orderDetails ? (
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={3}>
                    {/* Customer Information */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ backgroundColor: '#e0e7ff', color: '#4f46e5', mr: 2 }}>
                              <Person />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                              Customer Information
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Name</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {orderDetails.customer_name || 'N/A'}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Email</Typography>
                            <Typography variant="body1">
                              {orderDetails.customer_email || 'No email provided'}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Phone</Typography>
                            <Typography variant="body1">
                              {orderDetails.customer_phone || 'No phone provided'}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Address</Typography>
                            <Typography variant="body1">
                              {orderDetails.customer_address || 'No address provided'}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Order Information */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{ backgroundColor: '#dcfce7', color: '#166534', mr: 2 }}>
                              <ShoppingBag />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                              Order Information
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Order Number</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              #{orderDetails.order_number || orderDetails.id}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Total Amount</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#059669' }}>
                              PKR {(orderDetails.total_amount || 0).toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Status</Typography>
                            <Chip
                              label={orderDetails.status?.toUpperCase() || 'PENDING'}
                              size="small"
                              sx={{
                                backgroundColor: 
                                  orderDetails.status === 'delivered' ? '#dcfce7' :
                                  orderDetails.status === 'shipped' ? '#dbeafe' :
                                  orderDetails.status === 'processing' ? '#fef3c7' :
                                  '#fee2e2',
                                color: 
                                  orderDetails.status === 'delivered' ? '#166534' :
                                  orderDetails.status === 'shipped' ? '#1e40af' :
                                  orderDetails.status === 'processing' ? '#92400e' :
                                  '#dc2626',
                                fontWeight: 600
                              }}
                            />
                          </Box>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Order Date</Typography>
                            <Typography variant="body1">
                              {new Date(orderDetails.created_at).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>Order Time</Typography>
                            <Typography variant="body1">
                              {new Date(orderDetails.created_at).toLocaleTimeString('en-US')}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Order Items */}
                    <Grid item xs={12}>
                      <Card sx={{ borderRadius: 2, border: '1px solid #e5e7eb' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ backgroundColor: '#fef3c7', color: '#92400e', mr: 2 }}>
                              <Inventory />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                              Order Items ({orderDetails.items?.length || 0})
                            </Typography>
                          </Box>
                          {orderDetails.items && orderDetails.items.length > 0 ? (
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Product</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Quantity</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Unit Price</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Total</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {orderDetails.items.map((item: any, index: number) => (
                                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9fafb' } }}>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Avatar 
                                            src={item.product?.image_url} 
                                            sx={{ width: 40, height: 40, mr: 2, borderRadius: 1 }}
                                          >
                                            <ShoppingBag />
                                          </Avatar>
                                          <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                              {item.product?.name || item.product_name || 'Unknown Product'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                              SKU: {item.product?.sku || 'N/A'}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Chip 
                                          label={item.quantity} 
                                          size="small" 
                                          sx={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          PKR {(item.price || 0).toLocaleString()}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#059669' }}>
                                          PKR {((item.quantity || 0) * (item.price || 0)).toLocaleString()}
                                        </Typography>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                                No items found for this order
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: '#6b7280' }}>
                    No order details available
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
              <Button 
                onClick={() => setOrderDetailsOpen(false)}
                variant="outlined"
                sx={{ 
                  color: '#6b7280',
                  borderColor: '#d1d5db',
                  '&:hover': { backgroundColor: '#f3f4f6', borderColor: '#9ca3af' }
                }}
              >
                Close
              </Button>
              <Button
                onClick={() => handleDeleteOrder()}
                variant="contained"
                color="error"
                sx={{ ml: 2 }}
                startIcon={<Delete />}
              >
                Delete Order
              </Button>
            </DialogActions>
          </Dialog>
        </CardContent>
      </Card>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 8 }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;