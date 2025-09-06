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
  Avatar,
  Select,
  FormControl,
  useTheme,
  alpha,
  Slide,
  Fade,
  Zoom,
  Grow,
} from "@mui/material";
import Chart from "react-apexcharts";
import {
  ShoppingBag,
  Person,
  TrendingUp,
  Visibility,
  Warning,
  ShoppingCart,
  Inventory,
  Groups,
  MonetizationOn,
  PendingActions,
  BarChart,
  NotificationsActive,
  Analytics,
  RecentActors,
  MoreVert,
  Edit,
  Delete,
  CheckCircle,
  Info,
  DarkMode,
  LightMode,
  LocalShipping,
  Inventory2,
  Inventory2Outlined,
  People,
  Cancel,
  AccessTime,
  ExpandMore,
  ExpandLess
} from "@mui/icons-material";
import { adminAPI } from "../../../services/api";

const AdminDashboard: React.FC = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
  const [dateRange, setDateRange] = useState("30d");
  const isDarkMode = theme.palette.mode === 'dark';

  // Define the target categories we want to display
  const targetCategories = [
    'Rings', 'Earrings', 'Bangles', 'Anklets', 'Bracelets', 
    'Pendants', 'Ear Studs', 'Hoops', 'Wall Frame Design', 
    'Combos', 'Hair Accessories'
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [analyticsStats, setAnalyticsStats] = useState({
    sessions: 0,
    sessionsChange: 0,
    totalSales: 0,
    salesChange: 0,
    orders: 0,
    ordersChange: 0,
    conversionRate: 0,
    conversionChange: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Helper function to process orders
  const processOrders = (orders: any[]) => {
    return orders
      .filter(order => order && order.created_at)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(order => ({
        id: order.id,
        order_number: order.order_number || `#${order.id}`,
        customer_name: order.customer_name || 'Guest',
        total_amount: order.total_amount || 0,
        status: order.status || 'pending',
        created_at: order.created_at || new Date().toISOString(),
        items: order.items || []
      }));
  };

  // Helper function to process category stats
  const processCategoryStats = (categories: any[]) => {
    const formattedCategories = categories
      .filter((cat: any) => targetCategories.includes(cat.name || cat.category))
      .map((cat: any) => ({
        category: cat.name || cat.category,
        totalProducts: cat.total_products || cat.count || 0,
        totalStock: cat.total_stock || 0,
        totalSold: cat.total_sold || 0,
        revenue: cat.revenue || 0
      }));

    // Ensure all target categories are represented
    return targetCategories.map(catName => {
      const existing = formattedCategories.find((c: any) => c.category === catName);
      return existing || {
        category: catName,
        totalProducts: 0,
        totalStock: 0,
        totalSold: 0,
        revenue: 0
      };
    });
  };

  // Helper function to process low stock items
  const processLowStockItems = (items: any[]) => {
    return items.map((item: any) => {
      // Log the full item for debugging
      console.log('Processing low stock item:', item);
      
      return {
        id: item.id,
        name: item.name || item.product_name || item.title || 'Unknown Product',
        description: item.description || item.details || '',
        type: item.type || item.category || item.product_type || 'Product',
        size: item.size || item.variant_size || 'OS',
        material: item.material || item.fabric || 'N/A',
        stock: Number(item.stock || item.stock_quantity || item.available_quantity || 0),
        threshold: item.threshold || item.restock_threshold || 10,
        status: item.status || (item.stock <= 0 ? 'Out of Stock' : 'Low Stock')
      };
    });
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to get all dashboard data in parallel
      const [dashboardResponse, productsResponse, ordersResponse, categoriesResponse, inventoryResponse, usersResponse] = await Promise.allSettled([
        adminAPI.getDashboardStats().catch(err => {
          console.error('Error fetching dashboard stats:', err);
          return null;
        }),
        adminAPI.getAllProducts().catch(err => {
          console.error('Error fetching products:', err);
          return [];
        }),
        adminAPI.getAllOrders().catch(err => {
          console.error('Error fetching orders:', err);
          return [];
        }),
        adminAPI.getAllCategories().catch(err => {
          console.error('Error fetching categories:', err);
          return [];
        }),
        adminAPI.getInventoryStatus().catch(err => {
          console.error('Error fetching inventory status:', err);
          return { low_stock_items: [] };
        }),
        adminAPI.getAllUsers().catch(err => {
          console.error('Error fetching users:', err);
          return [];
        })
      ]);

      // Process dashboard stats if available
      if (dashboardResponse.status === 'fulfilled' && dashboardResponse.value) {
        const dashboardStats = dashboardResponse.value;
        
        // Update main stats
        setStats({
          totalProducts: dashboardStats.total_products || 0,
          totalOrders: dashboardStats.total_orders || 0,
          totalRevenue: dashboardStats.total_revenue || 0,
          totalCustomers: dashboardStats.total_customers || 0,
          lowStockProducts: dashboardStats.low_stock_products || 0,
          pendingOrders: dashboardStats.pending_orders || 0,
        });

        // Process recent orders
        if (Array.isArray(dashboardStats.recent_orders)) {
          setRecentOrders(processOrders(dashboardStats.recent_orders));
        }
        
        // Process category stats
        if (Array.isArray(dashboardStats.category_stats)) {
          setCategoryStats(processCategoryStats(dashboardStats.category_stats));
        }

        // Process low stock items
        if (Array.isArray(dashboardStats.low_stock_items)) {
          setLowStockItems(processLowStockItems(dashboardStats.low_stock_items));
        }
      }

      // Fallback to individual API responses if dashboard stats are incomplete
      if (ordersResponse.status === 'fulfilled' && Array.isArray(ordersResponse.value)) {
        setRecentOrders(prev => prev.length ? prev : processOrders(ordersResponse.value).slice(0, 3));
        
        // Update order-related stats
        setStats(prev => ({
          ...prev,
          totalOrders: ordersResponse.value.length,
          pendingOrders: ordersResponse.value.filter((o: any) => 
            o.status && ['pending', 'processing', 'shipped'].includes(o.status.toLowerCase())
          ).length
        }));
      }

      // Process products if available
      if (productsResponse.status === 'fulfilled' && Array.isArray(productsResponse.value)) {
        setStats(prev => ({
          ...prev,
          totalProducts: productsResponse.value.length
        }));
      }

      // Process users if available
      if (usersResponse.status === 'fulfilled' && Array.isArray(usersResponse.value)) {
        setStats(prev => ({
          ...prev,
          totalCustomers: usersResponse.value.length
        }));
      }

      // Process inventory if available
      if (inventoryResponse.status === 'fulfilled' && inventoryResponse.value) {
        const inventory = inventoryResponse.value;
        if (Array.isArray(inventory.low_stock_items)) {
          setLowStockItems(prev => prev.length ? prev : processLowStockItems(inventory.low_stock_items));
          setStats(prev => ({
            ...prev,
            lowStockProducts: inventory.low_stock_items.length
          }));
        }
      }

      // Process categories if available
      if (categoriesResponse.status === 'fulfilled' && Array.isArray(categoriesResponse.value)) {
        if (!categoryStats.length) {
          setCategoryStats(processCategoryStats(categoriesResponse.value));
        }
      }
    } catch (err) {
      console.error('Error in fetchDashboardData:', err);
      setError('Failed to load dashboard data. Please check your connection and try again.');
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

        const dayOrders = orders.filter((order) => {
          if (!order || !order.created_at) return false;
          try {
            const orderDate = new Date(order.created_at);
            return orderDate.toDateString() === date.toDateString();
          } catch (e) {
            return false;
          }
        });

        const dayRevenue = dayOrders.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0
        );
        const sessions = Math.floor(Math.random() * 200) + 50; // Simulated sessions data

        chartData.push({
          date: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          fullDate: date.toISOString().split("T")[0],
          orders: dayOrders.length,
          revenue: dayRevenue,
          sessions: sessions,
        });
      }

      setAnalyticsData(chartData);

      // Calculate analytics stats with percentage changes
      const totalOrders = orders.length || 0;
      const totalRevenue = orders.reduce(
        (sum: number, order: any) => sum + (order.total_amount || 0),
        0
      );
      const totalSessions = chartData.reduce(
        (sum, day) => sum + day.sessions,
        0
      );
      const conversionRate =
        totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0;

      // Simulate previous period data for percentage calculations
      const prevOrders = Math.max(
        1,
        Math.floor(totalOrders * (0.8 + Math.random() * 0.4))
      );
      const prevRevenue = Math.max(
        1,
        Math.floor(totalRevenue * (0.7 + Math.random() * 0.6))
      );
      const prevSessions = Math.max(
        1,
        Math.floor(totalSessions * (0.6 + Math.random() * 0.8))
      );
      const prevConversion =
        prevSessions > 0 ? (prevOrders / prevSessions) * 100 : 0;

      const analyticsStats = {
        sessions: totalSessions,
        sessionsChange:
          prevSessions > 0
            ? ((totalSessions - prevSessions) / prevSessions) * 100
            : 0,
        totalSales: totalRevenue,
        salesChange:
          prevRevenue > 0
            ? ((totalRevenue - prevRevenue) / prevRevenue) * 100
            : 0,
        orders: totalOrders,
        ordersChange:
          prevOrders > 0 ? ((totalOrders - prevOrders) / prevOrders) * 100 : 0,
        conversionRate: conversionRate,
        conversionChange:
          prevConversion > 0
            ? ((conversionRate - prevConversion) / prevConversion) * 100
            : 0,
      };

      setAnalyticsStats(analyticsStats);
    } catch (error) {
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
        conversionChange: 0,
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

  const handleActionClick = (
    event: React.MouseEvent<HTMLElement>,
    order: any
  ) => {
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
      setSnackbar({
        open: true,
        message: "Failed to fetch order details",
        severity: "error",
      });
      handleActionClose();
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateStatus = async (newStatus: string) => {
    try {
      await adminAPI.updateOrderStatus(selectedOrder.id, { status: newStatus });
      setSnackbar({
        open: true,
        message: `Order status updated to ${newStatus}`,
        severity: "success",
      });
      // Refresh data after status update
      fetchDashboardData();
      handleActionClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update order status",
        severity: "error",
      });
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await adminAPI.deleteOrder(selectedOrder.id);
      setSnackbar({
        open: true,
        message: "Order deleted successfully",
        severity: "success",
      });
      // Refresh data after deletion
      fetchDashboardData();
      handleActionClose();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete order",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getChartOptions = () => {
    const textColor = isDarkMode ? "#e5e7eb" : "#374151";
    const gridColor = isDarkMode ? "#374151" : "#e5e7eb";
    
    return {
      chart: {
        type: "area" as const,
        height: 350,
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
        background: "transparent",
        foreColor: textColor,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth" as const,
        width: 3,
      },
      grid: {
        borderColor: gridColor,
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      xaxis: {
        categories: analyticsData.map((d) => d.date),
        labels: {
          style: {
            colors: textColor,
            fontSize: "12px",
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: [
        {
          title: {
            text: "Revenue (PKR)",
            style: {
              color: textColor,
              fontSize: "12px",
            },
          },
          labels: {
            style: {
              colors: textColor,
              fontSize: "12px",
            },
            formatter: (value: number) => `PKR ${value.toLocaleString()}`,
          },
        },
        {
          opposite: true,
          title: {
            text: "Orders",
            style: {
              color: textColor,
              fontSize: "12px",
            },
          },
          labels: {
            style: {
              colors: textColor,
              fontSize: "12px",
            },
          },
        },
      ],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      colors: isDarkMode ? ["#4ade80", "#f472b6"] : ["#2c6e49", "#6E2C51"],
      legend: {
        show: false,
        labels: {
          colors: textColor,
        },
      },
      tooltip: {
        theme: isDarkMode ? "dark" : "light",
        shared: true,
        intersect: false,
        y: {
          formatter: (value: number, { seriesIndex }: any) => {
            if (seriesIndex === 0) {
              return `PKR ${value.toLocaleString()}`;
            }
            return `${value} orders`;
          },
        },
      },
    };
  };

  const getChartSeries = () => [
    {
      name: "Revenue",
      data: analyticsData.map((d) => d.revenue),
      yAxisIndex: 0,
    },
    {
      name: "Orders",
      data: analyticsData.map((d) => d.orders),
      yAxisIndex: 1,
    },
  ];

  const AnalyticsCard = ({ title, value, change, icon, color, subtitle }: any) => (
    <Slide direction="up" in={true} timeout={800}>
      <Card
        sx={{
          height: "100%",
          borderRadius: 3,
          boxShadow: isDarkMode 
            ? "0 4px 12px rgba(0,0,0,0.3)" 
            : "0 4px 12px rgba(0,0,0,0.08)",
          border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: isDarkMode 
              ? "0 8px 24px rgba(0,0,0,0.4)" 
              : "0 8px 24px rgba(0,0,0,0.12)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: alpha(color, 0.1),
                color: color,
              }}
            >
              {icon}
            </Box>
            {change !== undefined && (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: change >= 0 ? "#059669" : "#dc2626",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {change >= 0 ? "↗" : "↘"} {Math.abs(change).toFixed(1)}%
                </Typography>
              </Box>
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{ 
              color: isDarkMode ? "#9ca3af" : "#6b7280", 
              mb: 1, 
              fontWeight: 500 
            }}
          >
            {title}
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: "bold", 
              color: isDarkMode ? "#f9fafb" : "#1f2937",
              mb: subtitle ? 0.5 : 0
            }}
          >
            {value}
          </Typography>
          {subtitle && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: isDarkMode ? "#9ca3af" : "#6b7280",
                display: "block"
              }}
            >
              {subtitle}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Slide>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
          backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
        }}
      >
        <Fade in={loading} timeout={500}>
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              p: 4,
              borderRadius: 2,
              backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              boxShadow: isDarkMode 
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <CircularProgress 
              size={64}
              thickness={3}
              sx={{ 
                color: isDarkMode ? "#4ade80" : "#2c6e49",
                animationDuration: '1s'
              }} 
            />
            <Typography 
              variant="h6" 
              sx={{ 
                color: isDarkMode ? "#e5e7eb" : "#1f2937",
                fontWeight: 600,
                mt: 2
              }}
            >
              Loading Dashboard
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                color: isDarkMode ? "#9ca3af" : "#6b7280",
                textAlign: 'center',
                maxWidth: '300px'
              }}
            >
              Please wait while we prepare your dashboard...
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 }, 
      minHeight: "100vh",
      backgroundColor: isDarkMode ? "#111827" : "#f9fafb",
      transition: "background-color 0.3s ease",
    }}>
      {/* Header with Theme Toggle */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        mb: 4,
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 0 }
      }}>
        <Box>
          <Typography
            variant="h3"
            sx={{ 
              fontWeight: "bold", 
              mb: 1, 
              color: isDarkMode ? "#f9fafb" : "#000000",
              fontSize: { xs: "2rem", md: "2.5rem" }
            }}
          >
            Admin Dashboard
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              opacity: 0.7, 
              color: isDarkMode ? "#d1d5db" : "#000000",
              fontSize: { xs: "1rem", md: "1.25rem" }
            }}
          >
            Welcome back! Here&apos;s what&apos;s happening with your store today.
          </Typography>
        </Box>
      </Box>

      {/* Analytics Dashboard */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 }
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <BarChart sx={{ 
            mr: 2, 
            color: isDarkMode ? "#4ade80" : "#2c6e49", 
            fontSize: { xs: 24, md: 28 } 
          }} />
          <Box>
            <Typography
              variant="h5"
              sx={{ 
                fontWeight: "bold", 
                color: isDarkMode ? "#f9fafb" : "#000000",
                fontSize: { xs: "1.5rem", md: "1.75rem" }
              }}
            >
              Analytics Overview
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDarkMode ? "#d1d5db" : "#000000",
                fontSize: { xs: "0.875rem", md: "1rem" }
              }}
            >
              Last 30 days performance metrics
            </Typography>
          </Box>
        </Box>
        <FormControl 
          size="small" 
          sx={{ 
            minWidth: 120,
            mt: { xs: 1, sm: 0 }
          }}
        >
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            sx={{ 
              borderRadius: 2,
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              color: isDarkMode ? "#e5e7eb" : "#1f2937",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: isDarkMode ? "#374151" : "#e5e7eb",
              },
            }}
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Sessions"
            value={analyticsStats.sessions.toLocaleString()}
            change={analyticsStats.sessionsChange}
            icon={<Visibility sx={{ fontSize: 24 }} />}
            color={isDarkMode ? "#4ade80" : "#2c6e49"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Total Sales"
            value={`PKR ${analyticsStats.totalSales.toLocaleString()}`}
            change={analyticsStats.salesChange}
            icon={<MonetizationOn sx={{ fontSize: 24 }} />}
            color={isDarkMode ? "#4ade80" : "#2c6e49"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Orders"
            value={analyticsStats.orders.toString()}
            change={analyticsStats.ordersChange}
            icon={<ShoppingCart sx={{ fontSize: 24 }} />}
            color={isDarkMode ? "#f472b6" : "#6E2C51"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Conversion Rate"
            value={`${analyticsStats.conversionRate.toFixed(1)}%`}
            change={analyticsStats.conversionChange}
            icon={<TrendingUp sx={{ fontSize: 24 }} />}
            color={isDarkMode ? "#f472b6" : "#6E2C51"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Total Products"
            value={stats.totalProducts.toString()}
            subtitle="Items in catalog"
            icon={<Inventory sx={{ fontSize: 24 }} />}
            color={isDarkMode ? "#4ade80" : "#2c6e49"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Total Customers"
            value={stats.totalCustomers.toString()}
            subtitle="Registered users"
            icon={<Groups sx={{ fontSize: 24 }} />}
            color={isDarkMode ? "#f472b6" : "#6E2C51"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Low Stock"
            value={stats.lowStockProducts.toString()}
            subtitle="Items need restocking"
            icon={<Warning sx={{ fontSize: 24 }} />}
            color={isDarkMode ? "#f472b6" : "#6E2C51"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <AnalyticsCard
            title="Pending Orders"
            value={stats.pendingOrders.toString()}
            subtitle="Awaiting processing"
            icon={<PendingActions sx={{ fontSize: 24 }} />}
            color={isDarkMode ? "#4ade80" : "#2c6e49"}
          />
        </Grid>
      </Grid>

      {/* Interactive Chart */}
      <Zoom in={true} timeout={1000}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: isDarkMode 
              ? "0 4px 12px rgba(0,0,0,0.3)" 
              : "0 4px 12px rgba(0,0,0,0.08)",
            border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
            mb: 5,
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 3,
                flexDirection: { xs: "column", md: "row" },
                gap: { xs: 2, md: 0 }
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ 
                    fontWeight: "bold", 
                    color: isDarkMode ? "#f9fafb" : "#1f2937",
                    fontSize: { xs: "1.25rem", md: "1.5rem" }
                  }}
                >
                  Sales & Orders Trend
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDarkMode ? "#9ca3af" : "#6b7280",
                    fontSize: { xs: "0.875rem", md: "1rem" }
                  }}
                >
                  Daily performance over the selected period
                </Typography>
              </Box>
              <Box sx={{ 
                display: "flex", 
                gap: 2,
                mt: { xs: 1, md: 0 }
              }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: isDarkMode ? "#4ade80" : "#2c6e49",
                      borderRadius: "50%",
                      mr: 1,
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode ? "#9ca3af" : "#6b7280",
                      fontSize: { xs: "0.75rem", md: "0.875rem" }
                    }}
                  >
                    Revenue
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      backgroundColor: isDarkMode ? "#f472b6" : "#6E2C51",
                      borderRadius: "50%",
                      mr: 1,
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isDarkMode ? "#9ca3af" : "#6b7280",
                      fontSize: { xs: "0.75rem", md: "0.875rem" }
                    }}
                  >
                    Orders
                  </Typography>
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 350,
                }}
              >
                <CircularProgress 
                  sx={{ 
                    color: isDarkMode ? "#4ade80" : "#2c6e49" 
                  }} 
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Zoom>

      {/* Quick Insights */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        mb: 3, 
        mt: 6 
      }}>
        <NotificationsActive sx={{ 
          mr: 2, 
          color: isDarkMode ? "#9ca3af" : "#4a5568", 
          fontSize: { xs: 24, md: 28 } 
        }} />
        <Box>
          <Typography
            variant="h5"
            sx={{ 
              fontWeight: "bold", 
              color: isDarkMode ? "#f9fafb" : "#1a202c",
              fontSize: { xs: "1.5rem", md: "1.75rem" }
            }}
          >
            Quick Insights
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: isDarkMode ? "#9ca3af" : "#6b7280",
              fontSize: { xs: "0.875rem", md: "1rem" }
            }}
          >
            Important updates and notifications
          </Typography>
        </Box>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} lg={6}>
          <Grow in={true} timeout={1000}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: isDarkMode 
                  ? "0 4px 12px rgba(0,0,0,0.3)" 
                  : "0 4px 12px rgba(0,0,0,0.1)",
                border: isDarkMode ? "1px solid #374151" : "1px solid #e2e8f0",
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#7f1d1d" : "#fed7d7",
                      mr: 2,
                    }}
                  >
                    <TrendingUp sx={{ 
                      color: isDarkMode ? "#fca5a5" : "#e53e3e", 
                      fontSize: 24 
                    }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ 
                        fontWeight: "bold", 
                        color: isDarkMode ? "#f9fafb" : "#1a202c",
                        fontSize: { xs: "1.125rem", md: "1.25rem" }
                      }}
                    >
                      Low Stock Alerts
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: isDarkMode ? "#9ca3af" : "#6b7280",
                        fontSize: { xs: "0.875rem", md: "1rem" }
                      }}
                    >
                      Items running low in inventory
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ 
                    fontWeight: "bold", 
                    color: isDarkMode ? "#fca5a5" : "#e53e3e", 
                    mb: 2,
                    fontSize: { xs: "1.75rem", md: "2.25rem" }
                  }}
                >
                  {stats.lowStockProducts}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDarkMode ? "#9ca3af" : "#6b7280", 
                    mb: 3,
                    fontSize: { xs: "0.875rem", md: "1rem" }
                  }}
                >
                  products need immediate restocking
                </Typography>
                <TableContainer>
                  <Table size="small">
                    {lowStockItems.length > 0 && (
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontWeight: 600,
                            minWidth: '200px'
                          }}>
                            Product Name
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontWeight: 600,
                            minWidth: '250px'
                          }}>
                            Description
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontWeight: 600,
                            width: '120px'
                          }}>
                            Type
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontWeight: 600,
                            width: '80px'
                          }}>
                            Size
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontWeight: 600,
                            width: '120px'
                          }}>
                            Material
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontWeight: 600,
                            width: '100px',
                            textAlign: 'center'
                          }}>
                            In Stock
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontWeight: 600,
                            width: '120px',
                            textAlign: 'center'
                          }}>
                            Status
                          </TableCell>
                        </TableRow>
                      </TableHead>
                    )}
                    <TableBody>
                      {lowStockItems.map((item) => (
                        <TableRow key={item.id} hover>
                          <TableCell sx={{ 
                            fontWeight: "medium",
                            color: isDarkMode ? "#e5e7eb" : "#1f2937",
                            verticalAlign: 'top',
                            borderRight: `1px solid ${isDarkMode ? '#2d3748' : '#e5e7eb'}`
                          }}>
                            <Box sx={{ fontWeight: 600, mb: 0.5 }}>{item.name}</Box>
                            <Box sx={{ fontSize: '0.8rem', color: isDarkMode ? '#9ca3af' : '#6b7280' }}>
                              Type: {item.type}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#d1d5db" : "#4b5563",
                            verticalAlign: 'top',
                            borderRight: `1px solid ${isDarkMode ? '#2d3748' : '#e5e7eb'}`,
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {item.description || 'No description available'}
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#d1d5db" : "#4b5563",
                            verticalAlign: 'top',
                            borderRight: `1px solid ${isDarkMode ? '#2d3748' : '#e5e7eb'}`
                          }}>
                            {item.type}
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#d1d5db" : "#4b5563",
                            verticalAlign: 'top',
                            borderRight: `1px solid ${isDarkMode ? '#2d3748' : '#e5e7eb'}`
                          }}>
                            {item.size}
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#d1d5db" : "#4b5563",
                            verticalAlign: 'top',
                            borderRight: `1px solid ${isDarkMode ? '#2d3748' : '#e5e7eb'}`
                          }}>
                            {item.material}
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', verticalAlign: 'top', borderRight: `1px solid ${isDarkMode ? '#2d3748' : '#e5e7eb'}` }}>
                            <Tooltip title={`Threshold: ${item.threshold}`} arrow>
                              <Box>
                                <Chip
                                  label={item.stock}
                                  color={item.stock === 0 ? "error" : item.stock <= (item.threshold / 2) ? "warning" : "default"}
                                  size="small"
                                  sx={{ 
                                    minWidth: 60,
                                    fontWeight: 600,
                                    backgroundColor: item.stock === 0 
                                      ? (isDarkMode ? '#7f1d1d' : '#fef2f2')
                                      : item.stock <= (item.threshold / 2) 
                                        ? (isDarkMode ? '#78350f' : '#fffbeb')
                                        : (isDarkMode ? '#1e3a8a' : '#eff6ff'),
                                    color: item.stock === 0 
                                      ? (isDarkMode ? '#fca5a5' : '#dc2626')
                                      : item.stock <= (item.threshold / 2)
                                        ? (isDarkMode ? '#fdba74' : '#92400e')
                                        : (isDarkMode ? '#93c5fd' : '#1e40af')
                                  }}
                                />
                              </Box>
                            </Tooltip>
                          </TableCell>
                          <TableCell sx={{ textAlign: 'center', verticalAlign: 'top' }}>
                            <Chip
                              label={item.status}
                              color={item.stock === 0 ? "error" : "warning"}
                              size="small"
                              sx={{ 
                                minWidth: 100,
                                fontWeight: 500,
                                backgroundColor: item.stock === 0 
                                  ? (isDarkMode ? '#7f1d1d' : '#fef2f2')
                                  : (isDarkMode ? '#78350f' : '#fffbeb'),
                                color: item.stock === 0 
                                  ? (isDarkMode ? '#fca5a5' : '#dc2626')
                                  : (isDarkMode ? '#fdba74' : '#92400e')
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
          </Grow>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Grow in={true} timeout={1000} style={{ transitionDelay: '200ms' }}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: isDarkMode 
                  ? "0 4px 12px rgba(0,0,0,0.3)" 
                  : "0 4px 12px rgba(0,0,0,0.1)",
                border: isDarkMode ? "1px solid #374151" : "1px solid #e2e8f0",
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#1e40af" : "#bee3f8",
                      mr: 2,
                    }}
                  >
                    <PendingActions sx={{ 
                      color: isDarkMode ? "#93c5fd" : "#3182ce", 
                      fontSize: 24 
                    }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ 
                        fontWeight: "bold", 
                        color: isDarkMode ? "#f9fafb" : "#1a202c",
                        fontSize: { xs: "1.125rem", md: "1.25rem" }
                      }}
                    >
                      Pending Orders
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: isDarkMode ? "#9ca3af" : "#6b7280",
                        fontSize: { xs: "0.875rem", md: "1rem" }
                      }}
                    >
                      Orders awaiting your attention
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="h4"
                  sx={{ 
                    fontWeight: "bold", 
                    color: isDarkMode ? "#93c5fd" : "#3182ce", 
                    mb: 2,
                    fontSize: { xs: "1.75rem", md: "2.25rem" }
                  }}
                >
                  {stats.pendingOrders}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDarkMode ? "#9ca3af" : "#6b7280", 
                    mb: 3,
                    fontSize: { xs: "0.875rem", md: "1rem" }
                  }}
                >
                  orders need processing
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={
                    stats.totalOrders > 0
                      ? (stats.pendingOrders / stats.totalOrders) * 100
                      : 0
                  }
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: isDarkMode ? "#374151" : "#e2e8f0",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: isDarkMode ? "#3b82f6" : "#3182ce",
                    },
                  }}
                />
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>

      {/* Category Statistics */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        mb: 3 
      }}>
        <Analytics sx={{ 
          mr: 2, 
          color: isDarkMode ? "#9ca3af" : "#4a5568", 
          fontSize: { xs: 24, md: 28 } 
        }} />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: "bold", 
            color: isDarkMode ? "#f9fafb" : "#1a202c",
            fontSize: { xs: "1.5rem", md: "1.75rem" }
          }}
        >
          Category Performance
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12}>
          <Fade in={true} timeout={1000}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: isDarkMode 
                  ? "0 4px 12px rgba(0,0,0,0.3)" 
                  : "0 4px 12px rgba(0,0,0,0.1)",
                border: isDarkMode ? "1px solid #374151" : "1px solid #e2e8f0",
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      backgroundColor: isDarkMode ? "#1e3a8a" : "#e6f3ff",
                      mr: 2,
                    }}
                  >
                    <Analytics sx={{ 
                      color: isDarkMode ? "#93c5fd" : "#2563eb", 
                      fontSize: 24 
                    }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ 
                        fontWeight: "bold", 
                        color: isDarkMode ? "#f9fafb" : "#1a202c",
                        fontSize: { xs: "1.125rem", md: "1.25rem" }
                      }}
                    >
                      Category Statistics
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: isDarkMode ? "#9ca3af" : "#6b7280",
                        fontSize: { xs: "0.875rem", md: "1rem" }
                      }}
                    >
                      Performance breakdown by product categories
                    </Typography>
                  </Box>
                </Box>
                <TableContainer>
                  <Table
                    sx={{
                      "& .MuiTableHead-root": { 
                        backgroundColor: isDarkMode ? "#374151" : "#f8fafc",
                      },
                    }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontSize: "0.875rem",
                          }}
                        >
                          Category
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontSize: "0.875rem",
                          }}
                        >
                          Total Products
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontSize: "0.875rem",
                          }}
                        >
                          Stock Available
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: "bold",
                            color: isDarkMode ? "#e5e7eb" : "#374151",
                            fontSize: "0.875rem",
                          }}
                        >
                          Total Sold
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categoryStats.map((category) => (
                        <TableRow
                          key={category.category}
                          sx={{
                            "&:nth-of-type(odd)": { 
                              backgroundColor: isDarkMode ? "#111827" : "#fafafa",
                            },
                            "&:hover": { 
                              backgroundColor: isDarkMode ? "#1f2937" : "#f5f5f5",
                            },
                            transition: "background-color 0.2s ease",
                          }}
                        >
                          <TableCell
                            sx={{
                              fontWeight: 600,
                              color: isDarkMode ? "#f9fafb" : "#1f2937",
                              fontSize: "0.875rem",
                              borderLeft: "4px solid #3b82f6",
                              pl: 2,
                            }}
                          >
                            {category.category}
                          </TableCell>
                          <TableCell sx={{ 
                            color: isDarkMode ? "#d1d5db" : "#4b5563", 
                            fontWeight: 500 
                          }}>
                            {category.totalProducts}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={category.totalStock}
                              size="small"
                              sx={{
                                backgroundColor:
                                  category.totalStock > 50
                                    ? isDarkMode ? "#166534" : "#dcfce7"
                                    : category.totalStock > 20
                                    ? isDarkMode ? "#92400e" : "#fef3c7"
                                    : isDarkMode ? "#7f1d1d" : "#fee2e2",
                                color:
                                  category.totalStock > 50
                                    ? isDarkMode ? "#86efac" : "#166534"
                                    : category.totalStock > 20
                                    ? isDarkMode ? "#fcd34d" : "#92400e"
                                    : isDarkMode ? "#fca5a5" : "#dc2626",
                                fontWeight: 600,
                                fontSize: "0.75rem",
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={category.totalSold}
                              size="small"
                              sx={{
                                backgroundColor: isDarkMode ? "#1e40af" : "#dbeafe",
                                color: isDarkMode ? "#93c5fd" : "#1e40af",
                                fontWeight: 600,
                                fontSize: "0.75rem",
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
          </Fade>
        </Grid>
      </Grid>

      {/* Recent Orders */}
      <Box sx={{ 
        display: "flex", 
        alignItems: "center", 
        mb: 3 
      }}>
        <RecentActors sx={{ 
          mr: 2, 
          color: isDarkMode ? "#9ca3af" : "#4a5568", 
          fontSize: { xs: 24, md: 28 } 
        }} />
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: "bold", 
            color: isDarkMode ? "#f9fafb" : "#1a202c",
            fontSize: { xs: "1.5rem", md: "1.75rem" }
          }}
        >
          Recent Activity
        </Typography>
      </Box>
      
      <Fade in={true} timeout={1000}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: isDarkMode 
              ? "0 4px 12px rgba(0,0,0,0.3)" 
              : "0 4px 12px rgba(0,0,0,0.1)",
            border: isDarkMode ? "1px solid #374151" : "1px solid #e2e8f0",
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: isDarkMode ? "#0c4a6e" : "#f0f9ff",
                  mr: 2,
                }}
              >
                <RecentActors sx={{ 
                  color: isDarkMode ? "#7dd3fc" : "#0ea5e9", 
                  fontSize: 24 
                }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{ 
                    fontWeight: "bold", 
                    color: isDarkMode ? "#f9fafb" : "#1a202c",
                    fontSize: { xs: "1.125rem", md: "1.25rem" }
                  }}
                >
                  Recent Orders
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: isDarkMode ? "#9ca3af" : "#6b7280",
                    fontSize: { xs: "0.875rem", md: "1rem" }
                  }}
                >
                  Latest customer orders and transactions
                </Typography>
              </Box>
            </Box>
            <TableContainer>
              <Table 
                sx={{ 
                  "& .MuiTableHead-root": { 
                    backgroundColor: isDarkMode ? "#374151" : "#f8fafc",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: isDarkMode ? "#e5e7eb" : "#374151",
                        fontSize: "0.875rem",
                      }}
                    >
                      Order ID
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: isDarkMode ? "#e5e7eb" : "#374151",
                        fontSize: "0.875rem",
                      }}
                    >
                      Customer
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: isDarkMode ? "#e5e7eb" : "#374151",
                        fontSize: "0.875rem",
                      }}
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: isDarkMode ? "#e5e7eb" : "#374151",
                        fontSize: "0.875rem",
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: isDarkMode ? "#e5e7eb" : "#374151",
                        fontSize: "0.875rem",
                      }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: isDarkMode ? "#e5e7eb" : "#374151",
                        fontSize: "0.875rem",
                        textAlign: "center",
                      }}
                    >
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        "&:nth-of-type(odd)": { 
                          backgroundColor: isDarkMode ? "#111827" : "#fafafa",
                        },
                        "&:hover": { 
                          backgroundColor: isDarkMode ? "#1f2937" : "#f5f5f5",
                        },
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          color: isDarkMode ? "#f9fafb" : "#1f2937",
                          fontSize: "0.875rem",
                          borderLeft: "4px solid #10b981",
                          pl: 2,
                        }}
                      >
                        #{order.order_number || `ORD-${order.id}`}
                      </TableCell>
                      <TableCell sx={{ 
                        color: isDarkMode ? "#d1d5db" : "#4b5563", 
                        fontWeight: 500 
                      }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              backgroundColor: isDarkMode ? "#1e40af" : "#e0e7ff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mr: 2,
                            }}
                          >
                            <Person sx={{ 
                              fontSize: 16, 
                              color: isDarkMode ? "#93c5fd" : "#4f46e5" 
                            }} />
                          </Box>
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ 
                                fontWeight: 600, 
                                color: isDarkMode ? "#f9fafb" : "#1f2937",
                                fontSize: "0.875rem"
                              }}
                            >
                              {order.customer_name || "N/A"}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ 
                                color: isDarkMode ? "#9ca3af" : "#6b7280",
                                fontSize: "0.75rem"
                              }}
                            >
                              {order.customer_email || "No email"}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <MonetizationOn
                            sx={{ 
                              fontSize: 16, 
                              color: isDarkMode ? "#86efac" : "#059669", 
                              mr: 1 
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ 
                              fontWeight: 600, 
                              color: isDarkMode ? "#86efac" : "#059669",
                              fontSize: "0.875rem"
                            }}
                          >
                            PKR {(order.total_amount || 0).toLocaleString()}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={order.status?.toUpperCase() || "PENDING"}
                          size="small"
                          sx={{
                            backgroundColor:
                              order.status === "delivered"
                                ? isDarkMode ? "#166534" : "#dcfce7"
                                : order.status === "shipped"
                                ? isDarkMode ? "#1e40af" : "#dbeafe"
                                : order.status === "processing"
                                ? isDarkMode ? "#92400e" : "#fef3c7"
                                : isDarkMode ? "#7f1d1d" : "#fee2e2",
                            color:
                              order.status === "delivered"
                                ? isDarkMode ? "#86efac" : "#166534"
                                : order.status === "shipped"
                                ? isDarkMode ? "#93c5fd" : "#1e40af"
                                : order.status === "processing"
                                ? isDarkMode ? "#fcd34d" : "#92400e"
                                : isDarkMode ? "#fca5a5" : "#dc2626",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ 
                        color: isDarkMode ? "#d1d5db" : "#4b5563" 
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontWeight: 500,
                            fontSize: "0.875rem"
                          }}
                        >
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isDarkMode ? "#9ca3af" : "#6b7280",
                            fontSize: "0.75rem"
                          }}
                        >
                          {new Date(order.created_at).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <Tooltip title="More actions">
                          <IconButton
                            onClick={(e) => handleActionClick(e, order)}
                            sx={{
                              backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                              "&:hover": {
                                backgroundColor: isDarkMode ? "#4b5563" : "#e5e7eb",
                                transform: "scale(1.05)",
                              },
                              transition: "all 0.2s ease",
                            }}
                            size="small"
                          >
                            <MoreVert sx={{ 
                              fontSize: 18, 
                              color: isDarkMode ? "#d1d5db" : "#4b5563" 
                            }} />
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
                  boxShadow: isDarkMode 
                    ? "0 8px 24px rgba(0,0,0,0.4)" 
                    : "0 8px 24px rgba(0,0,0,0.12)",
                  border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                },
              }}
            >
              <MenuItem onClick={handleViewDetails} sx={{ py: 1.5, px: 2 }}>
                <Info sx={{ mr: 2, fontSize: 18, color: "#3b82f6" }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: isDarkMode ? "#e5e7eb" : "#1f2937"
                  }}
                >
                  View Details
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleUpdateStatus("processing")}
                sx={{ py: 1.5, px: 2 }}
              >
                <Edit sx={{ mr: 2, fontSize: 18, color: "#f59e0b" }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: isDarkMode ? "#e5e7eb" : "#1f2937"
                  }}
                >
                  Mark Processing
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleUpdateStatus("shipped")}
                sx={{ py: 1.5, px: 2 }}
              >
                <CheckCircle sx={{ mr: 2, fontSize: 18, color: "#10b981" }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: isDarkMode ? "#e5e7eb" : "#1f2937"
                  }}
                >
                  Mark Shipped
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleUpdateStatus("delivered")}
                sx={{ py: 1.5, px: 2 }}
              >
                <CheckCircle sx={{ mr: 2, fontSize: 18, color: "#059669" }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500,
                    color: isDarkMode ? "#e5e7eb" : "#1f2937"
                  }}
                >
                  Mark Delivered
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={handleDeleteOrder}
                sx={{ py: 1.5, px: 2, color: "#dc2626" }}
              >
                <Delete sx={{ mr: 2, fontSize: 18, color: "#dc2626" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#dc2626" }}
                >
                  Delete Order
                </Typography>
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
                  boxShadow: isDarkMode 
                    ? "0 20px 40px rgba(0,0,0,0.4)" 
                    : "0 20px 40px rgba(0,0,0,0.1)",
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                },
              }}
            >
              <DialogTitle
                sx={{
                  backgroundColor: isDarkMode ? "#374151" : "#f8fafc",
                  borderBottom: isDarkMode ? "1px solid #4b5563" : "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Info sx={{ mr: 2, color: "#3b82f6" }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: "bold",
                    color: isDarkMode ? "#f9fafb" : "#1f2937"
                  }}
                >
                  Order Details - #
                  {orderDetails?.order_number ||
                    selectedOrder?.order_number ||
                    selectedOrder?.id}
                </Typography>
              </DialogTitle>
              <DialogContent sx={{ p: 0 }}>
                {loadingDetails ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "300px",
                    }}
                  >
                    <CircularProgress 
                      sx={{ 
                        color: isDarkMode ? "#4ade80" : "#2c6e49" 
                      }} 
                    />
                  </Box>
                ) : orderDetails ? (
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Customer Information */}
                      <Grid item xs={12} md={6}>
                        <Card
                          sx={{
                            height: "100%",
                            borderRadius: 2,
                            border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                            backgroundColor: isDarkMode ? "#111827" : "#ffffff",
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  backgroundColor: isDarkMode ? "#1e40af" : "#e0e7ff",
                                  color: isDarkMode ? "#93c5fd" : "#4f46e5",
                                  mr: 2,
                                }}
                              >
                                <Person />
                              </Avatar>
                              <Typography
                                variant="h6"
                                sx={{ 
                                  fontWeight: "bold", 
                                  color: isDarkMode ? "#f9fafb" : "#1f2937" 
                                }}
                              >
                                Customer Information
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  color: isDarkMode ? "#9ca3af" : "#6b7280", 
                                  mb: 0.5 
                                }}
                              >
                                Name
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ 
                                  fontWeight: 600,
                                  color: isDarkMode ? "#f9fafb" : "#1f2937"
                                }}
                              >
                                {orderDetails.customer_name || "N/A"}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  color: isDarkMode ? "#9ca3af" : "#6b7280", 
                                  mb: 0.5 
                                }}
                              >
                                Email
                              </Typography>
                              <Typography 
                                variant="body1"
                                sx={{ color: isDarkMode ? "#f9fafb" : "#1f2937" }}
                              >
                                {orderDetails.customer_email ||
                                  "No email provided"}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  color: isDarkMode ? "#9ca3af" : "#6b7280", 
                                  mb: 0.5 
                                }}
                              >
                                Phone
                              </Typography>
                              <Typography 
                                variant="body1"
                                sx={{ color: isDarkMode ? "#f9fafb" : "#1f2937" }}
                              >
                                {orderDetails.customer_phone ||
                                  "No phone provided"}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  color: isDarkMode ? "#9ca3af" : "#6b7280", 
                                  mb: 0.5 
                                }}
                              >
                                Address
                              </Typography>
                              <Typography 
                                variant="body1"
                                sx={{ color: isDarkMode ? "#f9fafb" : "#1f2937" }}
                              >
                                {orderDetails.customer_address ||
                                  "No address provided"}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Order Information */}
                      <Grid item xs={12} md={6}>
                        <Card
                          sx={{
                            height: "100%",
                            borderRadius: 2,
                            border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                            backgroundColor: isDarkMode ? "#111827" : "#ffffff",
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 2,
                              }}
                            >
                              <Avatar
                                sx={{
                                  backgroundColor: isDarkMode ? "#166534" : "#dcfce7",
                                  color: isDarkMode ? "#86efac" : "#166534",
                                  mr: 2,
                                }}
                              >
                                <ShoppingBag />
                              </Avatar>
                              <Typography
                                variant="h6"
                                sx={{ 
                                  fontWeight: "bold", 
                                  color: isDarkMode ? "#f9fafb" : "#1f2937" 
                                }}
                              >
                                Order Information
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  color: isDarkMode ? "#9ca3af" : "#6b7280", 
                                  mb: 0.5 
                                }}
                              >
                                Order Number
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ 
                                  fontWeight: 600,
                                  color: isDarkMode ? "#f9fafb" : "#1f2937"
                                }}
                              >
                                #{orderDetails.order_number || orderDetails.id}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  color: isDarkMode ? "#9ca3af" : "#6b7280", 
                                  mb: 0.5 
                                }}
                              >
                                Total Amount
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ 
                                  fontWeight: "bold", 
                                  color: isDarkMode ? "#86efac" : "#059669" 
                                }}
                              >
                                PKR{" "}
                                {(
                                  orderDetails.total_amount || 0
                                ).toLocaleString()}
                              </Typography>
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  color: isDarkMode ? "#9ca3af" : "#6b7280", 
                                  mb: 0.5 
                                }}
                              >
                                Status
                              </Typography>
                              <Chip
                                label={
                                  orderDetails.status?.toUpperCase() || "PENDING"
                                }
                                size="small"
                                sx={{
                                  backgroundColor:
                                    orderDetails.status === "delivered"
                                      ? isDarkMode ? "#166534" : "#dcfce7"
                                      : orderDetails.status === "shipped"
                                      ? isDarkMode ? "#1e40af" : "#dbeafe"
                                      : orderDetails.status === "processing"
                                      ? isDarkMode ? "#92400e" : "#fef3c7"
                                      : isDarkMode ? "#7f1d1d" : "#fee2e2",
                                  color:
                                    orderDetails.status === "delivered"
                                      ? isDarkMode ? "#86efac" : "#166534"
                                      : orderDetails.status === "shipped"
                                      ? isDarkMode ? "#93c5fd" : "#1e40af"
                                      : orderDetails.status === "processing"
                                      ? isDarkMode ? "#fcd34d" : "#92400e"
                                      : isDarkMode ? "#fca5a5" : "#dc2626",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  color: isDarkMode ? "#9ca3af" : "#6b7280", 
                                  mb: 0.5 
                                }}
                              >
                                Order Date
                              </Typography>
                              <Typography 
                                variant="body1"
                                sx={{ color: isDarkMode ? "#f9fafb" : "#1f2937" }}
                              >
                                {new Date(
                                  orderDetails.created_at
                                ).toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ 
                                  color: isDarkMode ? "#9ca3af" : "#6b7280", 
                                  mb: 0.5 
                                }}
                              >
                                Order Time
                              </Typography>
                              <Typography 
                                variant="body1"
                                sx={{ color: isDarkMode ? "#f9fafb" : "#1f2937" }}
                              >
                                {new Date(
                                  orderDetails.created_at
                                ).toLocaleTimeString("en-US")}
                              </Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Order Items */}
                      <Grid item xs={12}>
                        <Card
                          sx={{ 
                            borderRadius: 2, 
                            border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                            backgroundColor: isDarkMode ? "#111827" : "#ffffff",
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                mb: 3,
                              }}
                            >
                              <Avatar
                                sx={{
                                  backgroundColor: isDarkMode ? "#92400e" : "#fef3c7",
                                  color: isDarkMode ? "#fcd34d" : "#92400e",
                                  mr: 2,
                                }}
                              >
                                <Inventory />
                              </Avatar>
                              <Typography
                                variant="h6"
                                sx={{ 
                                  fontWeight: "bold", 
                                  color: isDarkMode ? "#f9fafb" : "#1f2937" 
                                }}
                              >
                                Order Items ({orderDetails.items?.length || 0})
                              </Typography>
                            </Box>
                            {orderDetails.items &&
                            orderDetails.items.length > 0 ? (
                              <TableContainer>
                                <Table>
                                  <TableHead>
                                    <TableRow sx={{ 
                                      backgroundColor: isDarkMode ? "#374151" : "#f8fafc" 
                                    }}>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: isDarkMode ? "#e5e7eb" : "#374151",
                                        }}
                                      >
                                        Product Details
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: isDarkMode ? "#e5e7eb" : "#374151",
                                        }}
                                      >
                                        Size
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: isDarkMode ? "#e5e7eb" : "#374151",
                                        }}
                                      >
                                        Quantity
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: isDarkMode ? "#e5e7eb" : "#374151",
                                        }}
                                      >
                                        Unit Price
                                      </TableCell>
                                      <TableCell
                                        sx={{
                                          fontWeight: "bold",
                                          color: isDarkMode ? "#e5e7eb" : "#374151",
                                        }}
                                      >
                                        Total
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {orderDetails.items.map(
                                      (item: any, index: number) => (
                                        <TableRow
                                          key={index}
                                          sx={{
                                            "&:hover": {
                                              backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                                            },
                                          }}
                                        >
                                          <TableCell>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Box
                                                sx={{
                                                  position: "relative",
                                                  mr: 2,
                                                }}
                                              >
                                                <Avatar
                                                  src={
                                                    item.product?.image_url ||
                                                    item.product?.images?.[0]?.url
                                                  }
                                                  sx={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 2,
                                                    border: isDarkMode ? "2px solid #374151" : "2px solid #e5e7eb",
                                                    "& img": {
                                                      objectFit: "cover",
                                                    },
                                                  }}
                                                >
                                                  <ShoppingBag
                                                    sx={{ fontSize: 24 }}
                                                  />
                                                </Avatar>
                                                {item.product?.images?.length >
                                                  1 && (
                                                  <Box
                                                    sx={{
                                                      position: "absolute",
                                                      bottom: -4,
                                                      right: -4,
                                                      backgroundColor: "#3b82f6",
                                                      color: "white",
                                                      borderRadius: "50%",
                                                      width: 20,
                                                      height: 20,
                                                      display: "flex",
                                                      alignItems: "center",
                                                      justifyContent: "center",
                                                      fontSize: "0.75rem",
                                                      fontWeight: "bold",
                                                    }}
                                                  >
                                                    +
                                                    {item.product.images.length -
                                                      1}
                                                  </Box>
                                                )}
                                              </Box>
                                              <Box sx={{ flex: 1 }}>
                                                <Typography
                                                  variant="body1"
                                                  sx={{
                                                    fontWeight: 600,
                                                    color: isDarkMode ? "#f9fafb" : "#1f2937",
                                                    mb: 0.5,
                                                  }}
                                                >
                                                  {item.product?.name ||
                                                    item.product_name ||
                                                    "Unknown Product"}
                                                </Typography>
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    color: isDarkMode ? "#9ca3af" : "#6b7280",
                                                    display: "block",
                                                    mb: 0.5,
                                                  }}
                                                >
                                                  SKU:{" "}
                                                  {item.product?.sku ||
                                                    item.sku ||
                                                    "N/A"}
                                                </Typography>
                                                {item.product?.category && (
                                                  <Chip
                                                    label={item.product.category}
                                                    size="small"
                                                    sx={{
                                                      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
                                                      color: isDarkMode ? "#e5e7eb" : "#374151",
                                                      fontSize: "0.7rem",
                                                      height: 20,
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
                                                  label={
                                                    item.size ||
                                                    item.product?.size
                                                  }
                                                  size="small"
                                                  sx={{
                                                    backgroundColor: isDarkMode ? "#1e40af" : "#dbeafe",
                                                    color: isDarkMode ? "#93c5fd" : "#1e40af",
                                                    fontWeight: 600,
                                                    fontSize: "0.75rem",
                                                  }}
                                                />
                                              ) : (
                                                <Typography
                                                  variant="caption"
                                                  sx={{
                                                    color: isDarkMode ? "#9ca3af" : "#9ca3af",
                                                    fontStyle: "italic",
                                                  }}
                                                >
                                                  No size specified
                                                </Typography>
                                              )}
                                            </Box>
                                          </TableCell>
                                          <TableCell>
                                            <Box
                                              sx={{
                                                display: "flex",
                                                alignItems: "center",
                                              }}
                                            >
                                              <Chip
                                                label={item.quantity}
                                                size="small"
                                                sx={{
                                                  backgroundColor: isDarkMode ? "#1e40af" : "#e0e7ff",
                                                  color: isDarkMode ? "#93c5fd" : "#4f46e5",
                                                  fontWeight: 600,
                                                  minWidth: 40,
                                                }}
                                              />
                                            </Box>
                                          </TableCell>
                                          <TableCell>
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                fontWeight: 600,
                                                color: isDarkMode ? "#e5e7eb" : "#374151",
                                              }}
                                            >
                                              PKR{" "}
                                              {(item.price || 0).toLocaleString()}
                                            </Typography>
                                          </TableCell>
                                          <TableCell>
                                            <Typography
                                              variant="body1"
                                              sx={{
                                                fontWeight: 700,
                                                color: isDarkMode ? "#86efac" : "#059669",
                                              }}
                                            >
                                              PKR{" "}
                                              {(
                                                (item.quantity || 0) *
                                                (item.price || 0)
                                              ).toLocaleString()}
                                            </Typography>
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            ) : (
                              <Box sx={{ textAlign: "center", py: 4 }}>
                                <Typography
                                  variant="body2"
                                  sx={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
                                >
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
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ color: isDarkMode ? "#9ca3af" : "#6b7280" }}
                    >
                      No order details available
                    </Typography>
                  </Box>
                )}
              </DialogContent>
              <DialogActions
                sx={{
                  p: 3,
                  borderTop: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                  backgroundColor: isDarkMode ? "#374151" : "#f8fafc",
                }}
              >
                <Button
                  onClick={() => setOrderDetailsOpen(false)}
                  variant="outlined"
                  sx={{
                    color: isDarkMode ? "#e5e7eb" : "#6b7280",
                    borderColor: isDarkMode ? "#4b5563" : "#d1d5db",
                    "&:hover": {
                      backgroundColor: isDarkMode ? "#4b5563" : "#f3f4f6",
                      borderColor: isDarkMode ? "#6b7280" : "#9ca3af",
                    },
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
      </Fade>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
            color: isDarkMode ? "#f9fafb" : "#1f2937",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;