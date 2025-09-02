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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  Avatar,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { PDFViewer } from "@react-pdf/renderer";
import {
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { adminAPI } from "../../services/api";
import OrderReceipt from "../../components/admin/OrderReceipt";
import {
  PdfDownloadButton,
  generateOrderFileName,
} from "../../components/PdfDownloadButton";

const tableHeadingColor = {
  backgroundColor: "#2c6e49",
  color: "#ffffff",
  fontWeight: 600,
};

const AdminOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPdfPreviewVisible, setIsPdfPreviewVisible] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllOrders();
      setOrders(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to fetch orders",
        severity: "error",
      });
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
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    return status === "paid" ? "success" : "error";
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

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handlePreviewPdf = (order: any) => {
    setSelectedOrder(order);
    setIsPdfPreviewVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleClosePdfPreview = () => {
    setIsPdfPreviewVisible(false);
    setSelectedOrder(null);
  };

  const renderActions = (order: any) => (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Tooltip title="View Order">
        <IconButton
          size="small"
          onClick={() => handleViewOrder(order)}
          color="primary"
        >
          <VisibilityIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Preview Invoice">
        <IconButton
          size="small"
          onClick={() => handlePreviewPdf(order)}
          color="info"
        >
          <PictureAsPdfIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );

  return (
    <Box sx={{ p: 3, minHeight: "100vh" }}>
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
          Orders Management
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchOrders}
            disabled={loading}
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
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "#2c6e49",
              "&:hover": {
                backgroundColor: "#1e4a33",
              },
            }}
          >
            New Order
          </Button>
        </Box>
      </Box>

      {/* Orders Table */}
      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", borderRadius: 2, boxShadow: 3 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadingColor}>Order#</TableCell>
              <TableCell sx={tableHeadingColor}>Customer</TableCell>
              <TableCell sx={tableHeadingColor}>Total Amount</TableCell>
              <TableCell sx={tableHeadingColor}>Date</TableCell>
              <TableCell sx={tableHeadingColor}>Delivery Deadline</TableCell>
              <TableCell sx={tableHeadingColor}>Payment Status</TableCell>
              <TableCell sx={tableHeadingColor}>Order Status</TableCell>
              <TableCell sx={tableHeadingColor}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => {
                const deliveryDate = new Date(order.created_at);
                deliveryDate.setDate(deliveryDate.getDate() + 7);

                return (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {order.order_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {order.customer_name}
                      </Typography>
                      {order.customer_email && (
                        <Typography variant="caption" color="text.secondary">
                          {order.customer_email}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        PKR {order.total_amount?.toLocaleString() || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(order.created_at).toLocaleDateString("en-GB")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {deliveryDate.toLocaleDateString("en-GB")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          order.payment_status === "paid" ? "PAID" : "NOT PAID"
                        }
                        color={getPaymentStatusColor(order.payment_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status?.toUpperCase() || "PENDING"}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{renderActions(order)}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog
        open={isModalVisible}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              {/* Order Information */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "#2c6e49" }}>
                    Order Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Order Number
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {selectedOrder.order_number}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        PKR {selectedOrder.total_amount?.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Order Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedOrder.created_at).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Method
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.payment_method || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Order Status
                      </Typography>
                      <Chip
                        label={selectedOrder.status?.toUpperCase() || "PENDING"}
                        color={getStatusColor(selectedOrder.status)}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Payment Status
                      </Typography>
                      <Chip
                        label={
                          selectedOrder.payment_status === "paid"
                            ? "PAID"
                            : "NOT PAID"
                        }
                        color={getPaymentStatusColor(
                          selectedOrder.payment_status
                        )}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "#2c6e49" }}>
                    Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Customer Name
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.customer_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.customer_email || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.customer_phone || "N/A"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        User ID
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.user_id || "Guest Order"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Shipping Address
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.shipping_address || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "#2c6e49" }}>
                    Order Items
                  </Typography>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any, index: number) => (
                      <Card key={index} variant="outlined" sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: "flex", gap: 2 }}>
                            {item.product?.images?.[0] && (
                              <Avatar
                                src={item.product.images[0]}
                                alt={item.product.name}
                                sx={{ width: 80, height: 80 }}
                                variant="rounded"
                              />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Product Name
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    {item.product?.name || "Product not found"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Product ID
                                  </Typography>
                                  <Typography variant="body1">
                                    {item.product_id}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Quantity
                                  </Typography>
                                  <Typography variant="body1">
                                    {item.quantity}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Unit Price
                                  </Typography>
                                  <Typography variant="body1">
                                    PKR {item.price}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Total Price
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: "bold" }}
                                  >
                                    PKR{" "}
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString()}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Typography variant="body1" color="text.secondary">
                      No items found for this order
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          <PdfDownloadButton
            document={<OrderReceipt order={selectedOrder} />}
            fileName={generateOrderFileName(
              selectedOrder?.order_number || `order-${selectedOrder?.id}`
            )}
            buttonText="Download Invoice"
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
          />
        </DialogActions>
      </Dialog>

      {/* PDF Preview Modal */}
      <Dialog
        open={isPdfPreviewVisible}
        onClose={handleClosePdfPreview}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { height: "90vh" } }}
      >
        <DialogTitle>Invoice Preview</DialogTitle>
        <DialogContent sx={{ p: 0, height: "100%", overflow: "hidden" }}>
          {selectedOrder && (
            <Box
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
                <OrderReceipt order={selectedOrder} />
              </PDFViewer>
              <DialogActions
                sx={{ p: 2, borderTop: 1, borderColor: "divider" }}
              >
                <Button onClick={handleClosePdfPreview}>Close</Button>
                <PdfDownloadButton
                  document={<OrderReceipt order={selectedOrder} />}
                  fileName={generateOrderFileName(
                    selectedOrder.order_number || `order-${selectedOrder.id}`
                  )}
                  buttonText="Download PDF"
                  startIcon={<DownloadIcon />}
                />
              </DialogActions>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminOrders;
