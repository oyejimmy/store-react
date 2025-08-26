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
  Alert
} from "@mui/material";
import {
  ShoppingBag,
  Person,
  AttachMoney,
  TrendingUp,
  Visibility,
  Warning
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
      alert('Failed to fetch dashboard data');
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

  const StatCard = ({ title, value, icon, color }: any) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color, fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ color, fontSize: 40 }}>
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
    <Box sx={{ p: 0, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: theme.palette.primary.main, mb: 0, fontWeight: 'bold' }}>
        Admin Dashboard
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<ShoppingBag />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingBag />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Revenue"
            value={`PKR ${stats.totalRevenue}`}
            icon={<AttachMoney />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={<Person />}
            color={theme.palette.secondary.main}
          />
        </Grid>
      </Grid>

      {/* Alerts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: theme.palette.warning.main }} />
                <Typography variant="h6">Low Stock Alerts</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {stats.lowStockProducts} products need restocking
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
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingBag sx={{ mr: 1, color: theme.palette.info.main }} />
                <Typography variant="h6">Pending Orders</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {stats.pendingOrders} orders awaiting processing
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stats.totalOrders > 0 ? (stats.pendingOrders / stats.totalOrders) * 100 : 0}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Category Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>📊 Category Statistics</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell>Total Products</TableCell>
                      <TableCell>Stock Available</TableCell>
                      <TableCell>Total Sold</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categoryStats.map((category) => (
                      <TableRow key={category.category}>
                        <TableCell>
                          <Chip label={category.category} color="primary" />
                        </TableCell>
                        <TableCell>{category.totalProducts}</TableCell>
                        <TableCell>
                          <Chip
                            label={category.totalStock}
                            color={category.totalStock > 50 ? 'success' : category.totalStock > 20 ? 'warning' : 'error'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip label={category.totalSold} color="info" />
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
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Orders</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.order_number}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>PKR {order.total_amount || 0}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status?.toUpperCase() || 'PENDING'}
                        color={getStatusColor(order.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Visibility sx={{ color: theme.palette.info.main, cursor: 'pointer' }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;