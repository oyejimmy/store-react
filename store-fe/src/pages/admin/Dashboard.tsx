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
  Avatar,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import Chart from 'react-apexcharts';
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
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [analyticsStats, setAnalyticsStats] = useState({
    sessions: 0,
    sessionsChange: 0,
    totalSales: 0,
    salesChange: 0,
    orders: 0,
    ordersChange: 0,
    conversionRate: 0,
    conversionChange: 0
  });
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('Fetching dashboard data...');
      
      const [products, orders, categories] = await Promise.all([
        adminAPI.getAllProducts().catch(err => {
          console.error('Products API error:', err);
          return [];
        }),
        adminAPI.getAllOrders().catch(err => {
          console.error('Orders API error:', err);
          return [];
        }),
        adminAPI.getAllCategories().catch(err => {
          console.error('Categories API error:', err);
          return [];
        })
      ]);

      console.log('Products received:', products);
      console.log('Orders received:', orders);

      // Ensure products, orders, and categories are arrays
      const safeProducts = Array.isArray(products) ? products : [];
      const safeOrders = Array.isArray(orders) ? orders : [];
      const safeCategories = Array.isArray(categories) ? categories : [];

      console.log('Products received:', safeProducts.length);
      console.log('Categories received:', safeCategories.length);
      
      const lowStock = safeProducts.filter((product: any) => {
        // Use the primary stock field from the database model
        const stockValue = Number(product.stock || product.stock_quantity || 0);
        const isLowStock = stockValue < 10;
        
        // Debug: Log all stock values
        console.log(`Product: ${product.name}, stock: ${product.stock}, stock_quantity: ${product.stock_quantity}, calculated: ${stockValue}, isLowStock: ${isLowStock}`);
        
        return isLowStock;
      }).map((product: any) => ({
        id: product.id,
        name: product.name || 'Unknown Product',
        type: product.type || 'Product',
        size: product.size || 'OS',
        material: product.material || 'N/A',
        stock: Number(product.stock || product.stock_quantity || 0),
        threshold: 10
      }));
      
      console.log('Low stock products found:', lowStock.length);
      console.log('Low stock products:', lowStock);

      setLowStockItems(lowStock);
      
      const sortedOrders = safeOrders
        .filter((order: any) => order && order.created_at)
        .sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      setRecentOrders(sortedOrders.slice(0, 3));

      // Define the specific categories to display
      const targetCategories = [
        'Rings', 'Earrings', 'Bangles', 'Anklets', 'Bracelets', 
        'Pendants', 'Ear Studs', 'Hoops', 'Wall Frame Design', 
        'Combos', 'Hair Accessories'
      ];
      
      // Build category statistics - show only category-level data
      const categoryStatsData = targetCategories.map(categoryName => {
        // Find matching category from database
        const dbCategory = safeCategories.find((cat: any) => 
          cat.name.toLowerCase() === categoryName.toLowerCase()
        );
        
        // Get products for this category (by name matching if no category_id match)
        const categoryProducts = safeProducts.filter((product: any) => {
          if (dbCategory && product.category_id === dbCategory.id) {
            return true;
          }
          // Fallback: match by product type or name
          return product.type?.toLowerCase() === categoryName.toLowerCase() ||
                 product.name?.toLowerCase().includes(categoryName.toLowerCase());
        });
        
        // Calculate total products available (not sold)
        const availableProducts = categoryProducts.filter((product: any) => 
          product.status !== 'sold' && product.is_active !== false
        );
        
        // Calculate total sold products
        const soldProducts = categoryProducts.filter((product: any) => 
          product.status === 'sold'
        );
        
        return {
          category: categoryName,
          totalProducts: categoryProducts.length, // Total products in category
          totalStock: availableProducts.length,   // Available products (Stock Available)
          totalSold: soldProducts.length          // Sold products (Total Sold)
        };
      });
      
      setCategoryStats(categoryStatsData);

      setStats({
        totalProducts: safeProducts.length,
        totalOrders: safeOrders.length,
        totalRevenue: safeOrders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0),
        totalCustomers: new Set(safeOrders.map((order: any) => order.customer_email).filter(Boolean)).size,
        lowStockProducts: lowStock.length,
        pendingOrders: safeOrders.filter((order: any) => order.status === 'pending').length,
      });

      // Generate analytics data
      generateAnalyticsData(safeOrders);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setSnackbar({ open: true, message: `Failed to fetch dashboard data: ${errorMessage}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const generateAnalyticsData = (orders: any[]) => {
    try {
      // Generate last 30 days data
      const today = new Date();
      const chartData = [];
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const dayOrders = orders.filter(order => {
          if (!order || !order.created_at) return false;
          try {
            const orderDate = new Date(order.created_at);
            return orderDate.toDateString() === date.toDateString();
          } catch (e) {
            return false;
          }
        });
        
        const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
        const sessions = Math.floor(Math.random() * 200) + 50; // Simulated sessions data
        
        chartData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: date.toISOString().split('T')[0],
          orders: dayOrders.length,
          revenue: dayRevenue,
          sessions: sessions
        });
      }
      
      setAnalyticsData(chartData);
      
      // Calculate analytics stats with percentage changes
      const totalOrders = orders.length || 0;
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total_amount || 0), 0);
      const totalSessions = chartData.reduce((sum, day) => sum + day.sessions, 0);
      const conversionRate = totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0;
      
      // Simulate previous period data for percentage calculations
      const prevOrders = Math.max(1, Math.floor(totalOrders * (0.8 + Math.random() * 0.4)));
      const prevRevenue = Math.max(1, Math.floor(totalRevenue * (0.7 + Math.random() * 0.6)));
      const prevSessions = Math.max(1, Math.floor(totalSessions * (0.6 + Math.random() * 0.8)));
      const prevConversion = prevSessions > 0 ? (prevOrders / prevSessions) * 100 : 0;
      
      const analyticsStats = {
        sessions: totalSessions,
        sessionsChange: prevSessions > 0 ? ((totalSessions - prevSessions) / prevSessions) * 100 : 0,
        totalSales: totalRevenue,
        salesChange: prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0,
        orders: totalOrders,
        ordersChange: prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0,
        conversionRate: conversionRate,
        conversionChange: prevConversion > 0 ? ((conversionRate - prevConversion) / prevConversion) * 100 : 0
      };
      
      setAnalyticsStats(analyticsStats);
      console.log('Analytics stats updated:', analyticsStats);
    } catch (error) {
      console.error('Error generating analytics data:', error);
      // Set default analytics data
      setAnalyticsData([]);
      setAnalyticsStats({
        sessions: 0,
        sessionsChange: 0,
        totalSales: 0,
        salesChange: 0,
        orders: 0,
        ordersChange: 0,
        conversionRate: 0,
        conversionChange: 0
      });
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

  const getChartOptions = () => ({
    chart: {
      type: 'area' as const,
      height: 350,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      background: 'transparent'
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth' as const,
      width: 3
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    xaxis: {
      categories: analyticsData.map(d => d.date),
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: [
      {
        title: {
          text: 'Revenue (PKR)',
          style: {
            color: '#6b7280',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px'
          },
          formatter: (value: number) => `PKR ${value.toLocaleString()}`
        }
      },
      {
        opposite: true,
        title: {
          text: 'Orders',
          style: {
            color: '#6b7280',
            fontSize: '12px'
          }
        },
        labels: {
          style: {
            colors: '#6b7280',
            fontSize: '12px'
          }
        }
      }
    ],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    colors: ['#3b82f6', '#059669'],
    legend: {
      show: false
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number, { seriesIndex }: any) => {
          if (seriesIndex === 0) {
            return `PKR ${value.toLocaleString()}`;
          }
          return `${value} orders`;
        }
      }
    }
  });

  const getChartSeries = () => [
    {
      name: 'Revenue',
      data: analyticsData.map(d => d.revenue),
      yAxisIndex: 0
    },
    {
      name: 'Orders',
      data: analyticsData.map(d => d.orders),
      yAxisIndex: 1
    }
  ];

  const AnalyticsCard = ({ title, value, change, icon, color }: any) => (
    <Card sx={{
      height: '100%',
      borderRadius: 3,
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e5e7eb',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: `${color}15`,
            color: color
          }}>
            {icon}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ 
              color: change >= 0 ? '#059669' : '#dc2626',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center'
            }}>
              {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 1, fontWeight: 500 }}>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

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

      {/* Analytics Dashboard */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BarChart sx={{ mr: 2, color: '#4a5568', fontSize: 28 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
              Analytics Overview
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Last 30 days performance metrics
            </Typography>
          </Box>
        </Box>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <AnalyticsCard
            title="Sessions"
            value={analyticsStats.sessions.toLocaleString()}
            change={analyticsStats.sessionsChange}
            icon={<Visibility sx={{ fontSize: 24 }} />}
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <AnalyticsCard
            title="Total Sales"
            value={`PKR ${analyticsStats.totalSales.toLocaleString()}`}
            change={analyticsStats.salesChange}
            icon={<MonetizationOn sx={{ fontSize: 24 }} />}
            color="#059669"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <AnalyticsCard
            title="Orders"
            value={analyticsStats.orders.toString()}
            change={analyticsStats.ordersChange}
            icon={<ShoppingCart sx={{ fontSize: 24 }} />}
            color="#7c3aed"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <AnalyticsCard
            title="Conversion Rate"
            value={`${analyticsStats.conversionRate.toFixed(1)}%`}
            change={analyticsStats.conversionChange}
            icon={<TrendingUp sx={{ fontSize: 24 }} />}
            color="#d97706"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <AnalyticsCard
            title="Total Products"
            value={stats.totalProducts.toString()}
            subtitle="Items in catalog"
            icon={<Inventory sx={{ fontSize: 24 }} />}
            color="#8b5cf6"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <AnalyticsCard
            title="Total Customers"
            value={stats.totalCustomers.toString()}
            subtitle="Registered users"
            icon={<Groups sx={{ fontSize: 24 }} />}
            color="#ec4899"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <AnalyticsCard
            title="Low Stock"
            value={stats.lowStockProducts.toString()}
            subtitle="Items need restocking"
            icon={<Warning sx={{ fontSize: 24 }} />}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <AnalyticsCard
            title="Pending Orders"
            value={stats.pendingOrders.toString()}
            subtitle="Awaiting processing"
            icon={<PendingActions sx={{ fontSize: 24 }} />}
            color="#10b981"
          />
        </Grid>
      </Grid>

      {/* Interactive Chart */}
      <Card sx={{
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        mb: 5
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1f2937' }}>
                Sales & Orders Trend
              </Typography>
              <Typography variant="body2" sx={{ color: '#6b7280' }}>
                Daily performance over the selected period
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#3b82f6', borderRadius: '50%', mr: 1 }} />
                <Typography variant="caption" sx={{ color: '#6b7280' }}>Revenue</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ width: 12, height: 12, backgroundColor: '#059669', borderRadius: '50%', mr: 1 }} />
                <Typography variant="caption" sx={{ color: '#6b7280' }}>Orders</Typography>
              </Box>
            </Box>
          </Box>
          
          {analyticsData.length > 0 ? (
            <Box sx={{ mt: 2 }}>
              <Chart
                options={getChartOptions()}
                series={getChartSeries()}
                type="area"
                height={350}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
              <CircularProgress />
            </Box>
          )}
        </CardContent>
      </Card>


      {/* Quick Insights */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 6 }}>
        <NotificationsActive sx={{ mr: 2, color: '#4a5568', fontSize: 28 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
            Quick Insights
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            Important updates and notifications
          </Typography>
        </Box>
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
                      <TableCell>Product Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Material</TableCell>
                      <TableCell>In Stock</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell sx={{ fontWeight: 'medium' }}>{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.size}</TableCell>
                        <TableCell>{item.material}</TableCell>
                        <TableCell>
                          <Chip
                            label={item.stock}
                            color={item.stock === 0 ? 'error' : item.stock < 3 ? 'warning' : 'success'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: '100%', mr: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min((item.stock / (item.threshold || 10)) * 100, 100)}
                                color={item.stock === 0 ? 'error' : item.stock < 5 ? 'warning' : 'success'}
                                sx={{ height: 8, borderRadius: 5 }}
                              />
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {Math.min(Math.floor((item.stock / (item.threshold || 10)) * 100), 100)}%
                            </Typography>
                          </Box>
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
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Product Details</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Size</TableCell>
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
                                          <Box sx={{ position: 'relative', mr: 2 }}>
                                            <Avatar 
                                              src={item.product?.image_url || item.product?.images?.[0]?.url} 
                                              sx={{ 
                                                width: 60, 
                                                height: 60, 
                                                borderRadius: 2,
                                                border: '2px solid #e5e7eb',
                                                '& img': {
                                                  objectFit: 'cover'
                                                }
                                              }}
                                            >
                                              <ShoppingBag sx={{ fontSize: 24 }} />
                                            </Avatar>
                                            {item.product?.images?.length > 1 && (
                                              <Box sx={{
                                                position: 'absolute',
                                                bottom: -4,
                                                right: -4,
                                                backgroundColor: '#3b82f6',
                                                color: 'white',
                                                borderRadius: '50%',
                                                width: 20,
                                                height: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                              }}>
                                                +{item.product.images.length - 1}
                                              </Box>
                                            )}
                                          </Box>
                                          <Box sx={{ flex: 1 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                                              {item.product?.name || item.product_name || 'Unknown Product'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                                              SKU: {item.product?.sku || item.sku || 'N/A'}
                                            </Typography>
                                            {item.product?.category && (
                                              <Chip 
                                                label={item.product.category}
                                                size="small"
                                                sx={{ 
                                                  backgroundColor: '#f3f4f6', 
                                                  color: '#374151',
                                                  fontSize: '0.7rem',
                                                  height: 20
                                                }}
                                              />
                                            )}
                                          </Box>
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Box>
                                          {item.size || item.product?.size ? (
                                            <Chip 
                                              label={item.size || item.product?.size}
                                              size="small"
                                              sx={{ 
                                                backgroundColor: '#dbeafe', 
                                                color: '#1e40af',
                                                fontWeight: 600,
                                                fontSize: '0.75rem'
                                              }}
                                            />
                                          ) : (
                                            <Typography variant="caption" sx={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                              No size specified
                                            </Typography>
                                          )}
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                          <Chip 
                                            label={item.quantity} 
                                            size="small" 
                                            sx={{ 
                                              backgroundColor: '#e0e7ff', 
                                              color: '#4f46e5',
                                              fontWeight: 600,
                                              minWidth: 40
                                            }}
                                          />
                                        </Box>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                                          PKR {(item.price || 0).toLocaleString()}
                                        </Typography>
                                      </TableCell>
                                      <TableCell>
                                        <Typography variant="body1" sx={{ fontWeight: 700, color: '#059669' }}>
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