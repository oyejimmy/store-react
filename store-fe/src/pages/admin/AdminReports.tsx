import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  MonetizationOn,
  ShoppingBag,
  Person,
  Star,
  ContentCopy,
  Delete,
} from "@mui/icons-material";

// Define the types for your data to resolve TypeScript errors.
interface Product {
  name: string;
}

interface Item {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  order_number: string;
  items: Item[];
  category: string;
  actual_rate: number;
  sold_rate: number;
  created_at: string;
  customer_name: string;
  status: "delivered" | "shipped" | "processing" | "pending";
}

const tableHeadingColor = {
  backgroundColor: "#2c6e49",
  color: "#ffffff",
  fontWeight: 600,
};

// Mock API service to replace adminAPI
const mockAdminAPI = {
  getAllOrders: (): Promise<Order[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: "1",
            order_number: "ORD-101",
            items: [{ product: { name: "Wireless Headphones" }, quantity: 1 }],
            category: "Rings",
            actual_rate: 100,
            sold_rate: 12000,
            created_at: "2023-01-15T10:00:00Z",
            customer_name: "Ahmed Khan",
            status: "delivered",
          },
          {
            id: "2",
            order_number: "ORD-102",
            items: [{ product: { name: "Smartphone Case" }, quantity: 2 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 3500,
            created_at: "2023-01-16T11:30:00Z",
            customer_name: "Sara Ali",
            status: "shipped",
          },
          {
            id: "3",
            order_number: "ORD-103",
            items: [{ product: { name: "Laptop Stand" }, quantity: 1 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 8000,
            created_at: "2023-01-17T14:00:00Z",
            customer_name: "Usman Raza",
            status: "processing",
          },
          {
            id: "4",
            order_number: "ORD-104",
            items: [{ product: { name: "Gaming Mouse" }, quantity: 3 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 15000,
            created_at: "2023-01-18T09:00:00Z",
            customer_name: "Fatima Zafar",
            status: "pending",
          },
          {
            id: "5",
            order_number: "ORD-105",
            items: [{ product: { name: "Bluetooth Keyboard" }, quantity: 1 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 7500,
            created_at: "2023-01-19T16:00:00Z",
            customer_name: "Imran Malik",
            status: "delivered",
          },
          {
            id: "6",
            order_number: "ORD-106",
            items: [{ product: { name: "Monitor" }, quantity: 1 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 50000,
            created_at: "2023-01-20T17:00:00Z",
            customer_name: "Khadija Hassan",
            status: "shipped",
          },
          {
            id: "7",
            order_number: "ORD-107",
            items: [{ product: { name: "Webcam" }, quantity: 1 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 4500,
            created_at: "2023-01-21T18:00:00Z",
            customer_name: "Zainab Siddiqui",
            status: "processing",
          },
          {
            id: "8",
            order_number: "ORD-108",
            items: [{ product: { name: "Speaker" }, quantity: 1 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 9000,
            created_at: "2023-01-22T19:00:00Z",
            customer_name: "Ali Raza",
            status: "pending",
          },
          {
            id: "9",
            order_number: "ORD-109",
            items: [{ product: { name: "Mouse Pad" }, quantity: 1 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 1500,
            created_at: "2023-01-23T20:00:00Z",
            customer_name: "Bilal Ahmed",
            status: "delivered",
          },
          {
            id: "10",
            order_number: "ORD-110",
            items: [{ product: { name: "Headphones" }, quantity: 1 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 6000,
            created_at: "2023-01-24T21:00:00Z",
            customer_name: "Mariam Sohail",
            status: "shipped",
          },
          {
            id: "11",
            order_number: "ORD-111",
            items: [{ product: { name: "Earphones" }, quantity: 1 }],
            category: "Cases",
            actual_rate: 100,
            sold_rate: 2500,
            created_at: "2023-01-25T22:00:00Z",
            customer_name: "Fahad Mehmood",
            status: "processing",
          },
        ]);
      }, 1000);
    });
  },
};

const AdminReports = () => {
  const [reportData, setReportData] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const orders = await mockAdminAPI.getAllOrders();
      setReportData(orders);
    } catch (error) {
      console.error("Failed to fetch report data", error);
    } finally {
      setLoading(false);
    }
  };

  const totalSales = reportData.reduce(
    (sum, order) => sum + (order.sold_rate || 0),
    0
  );
  const totalCost = reportData.reduce(
    (sum, order) => sum + (order.actual_rate || 0),
    0
  );
  const totalProfit = reportData.reduce(
    (sum, order) => sum + ((order.sold_rate || 0) - (order.actual_rate || 0)),
    0
  );
  const productsSold = reportData.reduce(
    (sum, order) =>
      sum +
      (order.items?.reduce((itemSum, item) => itemSum + item.quantity, 0) || 0),
    0
  );

  const getStatusChip = (status: Order["status"]) => {
    const statusMap: {
      [key in Order["status"]]: {
        text: string;
        color: "success" | "info" | "warning";
      };
    } = {
      delivered: { text: "Done", color: "success" },
      shipped: { text: "Work in progress", color: "info" },
      processing: { text: "Work in progress", color: "info" },
      pending: { text: "Not started", color: "warning" },
    };
    const statusInfo = statusMap[status] || { text: status, color: "default" };
    return <Chip label={statusInfo.text} color={statusInfo.color} />;
  };

  const formatTableDataForExport = () => {
    const headers = [
      "Order#",
      "Product Name",
      "Total QTY",
      "Order Date",
      "Customer",
      "Status",
      "Actual Rate",
      "Sold Rate",
      "Profit",
    ];
    const data = reportData.map((row) => [
      row.order_number,
      row.items?.[0]?.product?.name || "Multiple Items",
      row.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0,
      new Date(row.created_at).toLocaleDateString("en-GB"),
      row.customer_name,
      getStatusChip(row.status).props.label,
      row.actual_rate || 0,
      row.sold_rate || 0,
      (row.sold_rate || 0) - (row.actual_rate || 0),
    ]);
    return { headers, data };
  };

  const handleCopy = () => {
    const { headers, data } = formatTableDataForExport();
    const tableString = [
      headers.join("\t"),
      ...data.map((row) => row.join("\t")),
    ].join("\n");
    navigator.clipboard
      .writeText(tableString)
      .then(() => alert("Table data copied to clipboard!"))
      .catch((err) => console.error("Could not copy text: ", err));
  };

  const handleExportCSV = () => {
    const { headers, data } = formatTableDataForExport();
    const csv = Papa.unparse({ fields: headers, data });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "reports.csv");
  };

  const handleExportExcel = () => {
    const { headers, data } = formatTableDataForExport();
    const csv = Papa.unparse({ fields: headers, data });
    const blob = new Blob([csv], { type: "application/vnd.ms-excel" });
    saveAs(blob, "reports.xls");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Admin Reports", 14, 15);
    const { headers, data } = formatTableDataForExport();
    doc.autoTable({
      head: [headers],
      body: data,
      startY: 20,
    });
    doc.save("reports.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      {/* CDN scripts for export libraries */}
      <script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/papaparse/5.3.0/papaparse.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 3,
          background: "linear-gradient(135deg, #4CAF50 0%, #81C784 100%)",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Reports
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Button
            onClick={handleCopy}
            variant="outlined"
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
            Copy
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outlined"
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
            CSV
          </Button>
          <Button
            onClick={handleExportExcel}
            variant="outlined"
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
            Excel
          </Button>
          <Button
            onClick={handleExportPDF}
            variant="outlined"
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
            PDF
          </Button>
          <Button
            onClick={handlePrint}
            variant="outlined"
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
            Print
          </Button>
        </Stack>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: "12px", boxShadow: 3, textAlign: "center" }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "12px",
                  backgroundColor: "#1890ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "white",
                }}
              >
                <BarChart sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="#333">
                PKR {totalSales.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="#666">
                Total Sales
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: "12px", boxShadow: 3, textAlign: "center" }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "12px",
                  backgroundColor: "#ff4d4f",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "white",
                }}
              >
                <MonetizationOn sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="#333">
                PKR {totalCost.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="#666">
                Total Cost
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: "12px", boxShadow: 3, textAlign: "center" }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "12px",
                  backgroundColor: "#722ed1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "white",
                }}
              >
                <ShoppingBag sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="#333">
                {productsSold}
              </Typography>
              <Typography variant="body2" color="#666">
                Products Sold
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{ borderRadius: "12px", boxShadow: 3, textAlign: "center" }}
          >
            <CardContent>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: "12px",
                  backgroundColor: "#fa8c16",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "white",
                }}
              >
                <Person sx={{ fontSize: 30 }} />
              </Box>
              <Typography variant="h5" fontWeight="bold" color="#333">
                PKR {totalProfit.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="#666">
                Total Profit
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Reports Table */}
      <>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Table
              size="small"
              sx={{ borderRadius: 3, boxShadow: 3, p: 2, overflow: "hidden" }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeadingColor}>Order#</TableCell>
                  <TableCell sx={tableHeadingColor}>Product Name</TableCell>
                  <TableCell sx={tableHeadingColor}>Total QTY</TableCell>
                  <TableCell sx={tableHeadingColor}>Order Date</TableCell>
                  <TableCell sx={tableHeadingColor}>Customer</TableCell>
                  <TableCell sx={tableHeadingColor}>Status</TableCell>
                  <TableCell sx={tableHeadingColor}>Actual Rate</TableCell>
                  <TableCell sx={tableHeadingColor}>Sold Rate</TableCell>
                  <TableCell sx={tableHeadingColor}>Profit</TableCell>
                  <TableCell sx={tableHeadingColor}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {row.order_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {row.items?.[0]?.product?.name || "Multiple Items"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {row.items?.reduce(
                          (sum, item) => sum + (item.quantity || 0),
                          0
                        ) || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(row.created_at).toLocaleDateString("en-GB")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {row.customer_name}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(row.status)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        PKR {row.actual_rate || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        PKR {row.sold_rate || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="success.main"
                      >
                        PKR {(row.sold_rate || 0) - (row.actual_rate || 0)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="text"
                          size="small"
                          sx={{ color: "#faad14", minWidth: "auto", p: 0 }}
                        >
                          <Star sx={{ fontSize: 18 }} />
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          sx={{ color: "#1890ff", minWidth: "auto", p: 0 }}
                        >
                          <ContentCopy sx={{ fontSize: 18 }} />
                        </Button>
                        <Button
                          variant="text"
                          size="small"
                          sx={{ color: "#ff4d4f", minWidth: "auto", p: 0 }}
                        >
                          <Delete sx={{ fontSize: 18 }} />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </>
    </Box>
  );
};

export default AdminReports;
