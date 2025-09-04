import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  TablePagination,
  Tooltip,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  ContentCopy,
  AttachMoney,
  PendingActions,
  Receipt,
  AccountBalance,
} from "@mui/icons-material";
import { adminAPI } from "../../services/api";

interface Payment {
  id: number;
  order_number: string;
  customer_name: string;
  date: string;
  status: string;
  total_amount: number;
  payment_method?: string;
  payment_status?: string;
  customer_email?: string;
  customer_phone?: string;
  user_id?: number;
  transaction_id?: string;
  payment_gateway?: string;
  currency?: string;
  payment_date?: string;
  items_count?: number;
  delivery_charges?: number;
  shipping_address?: string;
}

interface PaymentAnalytics {
  totalReceived: number;
  totalPending: number;
  totalRecords: number;
  totalAmount: number;
}

const tableHeadingColor = {
  backgroundColor: "#2c6e49",
  color: "#ffffff",
  fontWeight: 600,
};

const AdminPayments: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [payments, setPayments] = useState<Payment[]>([]);
  const [analytics, setAnalytics] = useState<PaymentAnalytics>({
    totalReceived: 0,
    totalPending: 0,
    totalRecords: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentToDelete, setPaymentToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    status: "",
    payment_method: "",
    payment_status: "",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    calculateAnalytics();
  }, [payments]);

  const calculateAnalytics = () => {
    const totalReceived = payments
      .filter((p) => p.status === "Completed" || p.status === "Received")
      .reduce((sum, payment) => sum + payment.total_amount, 0);

    const totalPending = payments
      .filter((p) => p.status === "Submitted")
      .reduce((sum, payment) => sum + payment.total_amount, 0);

    const totalRecords = payments.length;
    const totalAmount = payments.reduce(
      (sum, payment) => sum + payment.total_amount,
      0
    );

    setAnalytics({
      totalReceived,
      totalPending,
      totalRecords,
      totalAmount,
    });
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const orders = await adminAPI.getAllOrders();
      // Transform orders to payment records
      const paymentData = orders.map((order: any) => ({
        id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        date: order.created_at,
        status: getPaymentStatus(order.payment_status, order.status),
        total_amount: order.total_amount,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        customer_email: order.customer_email,
        customer_phone: order.customer_phone,
        user_id: order.user_id,
        transaction_id: order.transaction_id,
        payment_gateway: order.payment_gateway,
        currency: order.currency,
        payment_date: order.payment_date,
        items_count: order.items_count,
        delivery_charges: order.delivery_charges,
        shipping_address: order.shipping_address,
      }));
      setPayments(paymentData);
    } catch (error) {
      console.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatus = (paymentStatus: string, orderStatus: string) => {
    if (paymentStatus === "paid" && orderStatus === "delivered")
      return "Completed";
    if (paymentStatus === "paid") return "Received";
    return "Submitted";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Received":
        return "primary";
      case "Submitted":
        return "warning";
      default:
        return "default";
    }
  };

  const handleViewPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setViewModalOpen(true);
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setFormData({
      status: payment.status,
      payment_method: payment.payment_method || "",
      payment_status: payment.payment_status || "",
    });
    setEditModalOpen(true);
  };

  const handleCopyPayment = (payment: Payment) => {
    const paymentInfo = `Order: ${payment.order_number}\nCustomer: ${payment.customer_name}\nAmount: PKR ${payment.total_amount}\nStatus: ${payment.status}`;
    navigator.clipboard.writeText(paymentInfo);
    console.log("Payment information copied to clipboard");
  };

  const handleDeletePayment = (paymentId: number) => {
    setPaymentToDelete(paymentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!paymentToDelete) return;

    try {
      setLoading(true);
      // In a real app, you'd call an API to delete the payment
      setPayments(payments.filter((p) => p.id !== paymentToDelete));
      console.log("Payment record deleted successfully");
    } catch (error) {
      console.error("Failed to delete payment record");
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setPaymentToDelete(null);
    }
  };

  const handleUpdatePayment = async () => {
    try {
      setLoading(true);
      if (!selectedPayment) return;

      // Update payment in the list
      const updatedPayments = payments.map((p) =>
        p.id === selectedPayment.id ? { ...p, ...formData } : p
      );
      setPayments(updatedPayments);
      console.log("Payment updated successfully");
      setEditModalOpen(false);
      setFormData({ status: "", payment_method: "", payment_status: "" });
    } catch (error) {
      console.error("Failed to update payment");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });
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

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        minHeight: "100vh",
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
          Payments Managments
        </Typography>
        <Button
          variant="contained"
          onClick={() => console.log("New payment feature coming soon")}
          sx={{
            borderColor: "#2c6e49",
            color: "#2c6e49",
            backgroundColor: "rgb(224, 220, 220)",
            "&:hover": {
              borderColor: "#2c6e49",
              backgroundColor: "rgb(230, 232, 210)",
            },
          }}
        >
          + New Payment
        </Button>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
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
                      color: theme.palette.success.main,
                    }}
                  >
                    PKR {analytics.totalReceived.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Received Amount
                  </Typography>
                </Box>
                <AttachMoney
                  sx={{
                    fontSize: 40,
                    color: theme.palette.success.main,
                    opacity: 0.7,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
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
                      color: theme.palette.warning.main,
                    }}
                  >
                    PKR {analytics.totalPending.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pending Amount
                  </Typography>
                </Box>
                <PendingActions
                  sx={{
                    fontSize: 40,
                    color: theme.palette.warning.main,
                    opacity: 0.7,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
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
                    sx={{ fontWeight: "bold", color: theme.palette.info.main }}
                  >
                    {analytics.totalRecords}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Records
                  </Typography>
                </Box>
                <Receipt
                  sx={{
                    fontSize: 40,
                    color: theme.palette.info.main,
                    opacity: 0.7,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
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
                      color: theme.palette.primary.main,
                    }}
                  >
                    PKR {analytics.totalAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Amount
                  </Typography>
                </Box>
                <AccountBalance
                  sx={{
                    fontSize: 40,
                    color: theme.palette.primary.main,
                    opacity: 0.7,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", borderRadius: 2, boxShadow: 3 }}
      >
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadingColor}>Order#</TableCell>
              <TableCell sx={tableHeadingColor}>Customer Name</TableCell>
              {!isMobile && <TableCell sx={tableHeadingColor}>Date</TableCell>}
              <TableCell sx={tableHeadingColor}>Status</TableCell>
              <TableCell sx={tableHeadingColor}>Total amount</TableCell>
              <TableCell sx={tableHeadingColor}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 5 : 6}
                  sx={{ textAlign: "center", py: 4 }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              payments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="#333"
                      >
                        {payment.order_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {payment.customer_name}
                      </Typography>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(payment.date).toLocaleDateString("en-GB")}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={getStatusColor(payment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        PKR {payment.total_amount || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="View Details">
                          <IconButton
                            color="info"
                            onClick={() => handleViewPayment(payment)}
                            size="small"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Status">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditPayment(payment)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy Info">
                          <IconButton
                            color="success"
                            onClick={() => handleCopyPayment(payment)}
                            size="small"
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeletePayment(payment.id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={payments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Payment Dialog */}
      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Visibility sx={{ mr: 1, verticalAlign: "middle" }} />
          Payment & Order Details
        </DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Order ID
                      </Typography>
                      <Typography variant="body1">
                        #{selectedPayment.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Order Number
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.order_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Order Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedPayment.date).toLocaleDateString(
                          "en-GB"
                        )}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Order Status
                      </Typography>
                      <Chip
                        label={selectedPayment.status}
                        color={getStatusColor(selectedPayment.status) as any}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Customer Name
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.customer_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.customer_email || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.customer_phone || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        User Type
                      </Typography>
                      <Chip
                        label={
                          selectedPayment.user_id
                            ? "Registered User"
                            : "Guest Order"
                        }
                        color={selectedPayment.user_id ? "primary" : "warning"}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Payment Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Payment Method
                      </Typography>
                      <Chip
                        label={selectedPayment.payment_method || "COD"}
                        color="primary"
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Payment Status
                      </Typography>
                      <Chip
                        label={selectedPayment.payment_status || "Pending"}
                        color={
                          selectedPayment.payment_status === "paid"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Transaction ID
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.transaction_id || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Payment Gateway
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.payment_gateway || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Currency
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.currency || "PKR"}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">
                        Payment Date
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.payment_date
                          ? new Date(
                              selectedPayment.payment_date
                            ).toLocaleDateString("en-GB")
                          : "Pending"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          backgroundColor: "#f0f2f5",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="#d4af37"
                          fontWeight="bold"
                        >
                          PKR {selectedPayment.total_amount || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Total Amount
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          backgroundColor: "#f0f2f5",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="#1890ff"
                          fontWeight="bold"
                        >
                          {selectedPayment.items_count || "N/A"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Items Count
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box
                        sx={{
                          textAlign: "center",
                          p: 2,
                          backgroundColor: "#f0f2f5",
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          color="#52c41a"
                          fontWeight="bold"
                        >
                          {selectedPayment.delivery_charges || 0}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Delivery Charges
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {selectedPayment.shipping_address && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Shipping Address
                      </Typography>
                      <Typography variant="body1">
                        {selectedPayment.shipping_address}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Payment Dialog */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange("status")}
                  label="Payment Status"
                >
                  <MenuItem value="Submitted">Submitted</MenuItem>
                  <MenuItem value="Received">Received</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.payment_method}
                  onChange={handleChange("payment_method")}
                  label="Payment Method"
                >
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Online">Online</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdatePayment}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#d4af37",
              "&:hover": { backgroundColor: "#b8860b" },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Payment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this payment record? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPayments;
