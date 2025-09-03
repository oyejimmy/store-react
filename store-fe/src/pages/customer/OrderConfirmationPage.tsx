import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Box,
  Divider,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Paper,
  Grid,
} from "@mui/material";
import {
  CheckCircle,
  ShoppingCart,
  Home,
  Download,
  CameraAlt,
  Email,
  LocalShipping,
  CalendarToday,
  SupportAgent,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

const OrderConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const orderNumber =
    "ORD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  const componentRef = useRef<HTMLDivElement>(null);
  const [showFireworks, setShowFireworks] = useState(true);

  // Handle PDF generation
  const handleGeneratePdf = useReactToPrint({
    pageContent: () => componentRef.current,
    pageStyle: `
      @page { size: landscape; margin: 10mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; } 
      }
    `,
    documentTitle: `Order_Confirmation_${orderNumber}`,
  } as any);

  // Handle screenshot capture
  const handleCaptureScreenshot = () => {
    if (componentRef.current) {
      html2canvas(componentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#f5f8fa",
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `Order_Confirmation_${orderNumber}.png`;
        link.click();
      });
    }
  };

  // Hide fireworks after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const steps = ["Order Confirmed", "Processing", "Shipped", "Delivered"];

  return (
    <Box
      sx={{
        padding: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f8fa 0%, #e6eeff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {showFireworks && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9999,
          }}
        >
          <Fireworks autorun={{ speed: 3, duration: 10000 }} />
        </Box>
      )}

      <Paper
        ref={componentRef}
        elevation={6}
        sx={{
          borderRadius: 3,
          background: "white",
          padding: 4,
          width: "95%",
          maxWidth: "1200px",
          position: "relative",
          zIndex: 1,
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #2c3e50 0%, #3498db 100%)",
          },
        }}
      >
        <Grid container spacing={4}>
          {/* Left Column - Order Details */}
          <Grid item xs={12} md={6}>
            {/* Header Section */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <CheckCircle
                sx={{
                  fontSize: 64,
                  color: "#27ae60",
                  mb: 2,
                  filter: "drop-shadow(0 4px 8px rgba(39, 174, 96, 0.3))",
                }}
              />
              <Typography
                variant="h4"
                sx={{
                  color: "#2c3e50",
                  mb: 1,
                  fontWeight: "bold",
                }}
              >
                Order Confirmed!
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#7f8c8d",
                  fontSize: 16,
                  maxWidth: 400,
                  mx: "auto",
                }}
              >
                Thank you for your purchase. Your order has been successfully
                placed.
              </Typography>
            </Box>

            {/* Order Details */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 4,
                p: 2,
                borderRadius: 2,
                background: "#f8f9fa",
                border: "1px solid #e9ecef",
              }}
            >
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ color: "#2c3e50" }}
                >
                  ORDER NUMBER
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#2980b9",
                    fontWeight: "bold",
                    mt: 1,
                  }}
                >
                  {orderNumber}
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center", flex: 1 }}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ color: "#2c3e50" }}
                >
                  ORDER DATE
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 1,
                  }}
                >
                  <CalendarToday
                    sx={{ color: "#2980b9", mr: 1, fontSize: 20 }}
                  />
                  <Typography variant="body1" sx={{ color: "#2c3e50" }}>
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Progress Stepper */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  color: "#2c3e50",
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Order Status
              </Typography>
              <Stepper
                activeStep={0}
                alternativeLabel
                sx={{
                  "& .MuiStepLabel-label": {
                    fontWeight: 500,
                    color: "#2c3e50 !important",
                    fontSize: "0.75rem",
                  },
                  "& .Mui-completed": {
                    color: "#27ae60 !important",
                  },
                  "& .Mui-active": {
                    color: "#2980b9 !important",
                  },
                }}
              >
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mt: 4,
              }}
            >
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Home />}
                  onClick={() => navigate("/")}
                  sx={{
                    px: 3,
                    py: 1,
                    background: "#2c3e50",
                    fontWeight: "bold",
                    borderRadius: 2,
                    "&:hover": {
                      background: "#34495e",
                    },
                  }}
                >
                  Continue Shopping
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ShoppingCart />}
                  onClick={() => navigate("/my-orders")}
                  sx={{
                    px: 3,
                    py: 1,
                    borderColor: "#2980b9",
                    color: "#2980b9",
                    fontWeight: "bold",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#2980b9",
                      background: "rgba(41, 128, 185, 0.04)",
                    },
                  }}
                >
                  View Orders
                </Button>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={handleGeneratePdf}
                  size="medium"
                  sx={{
                    borderColor: "#27ae60",
                    color: "#27ae60",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#27ae60",
                      background: "rgba(39, 174, 96, 0.04)",
                    },
                  }}
                >
                  Download PDF
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CameraAlt />}
                  onClick={handleCaptureScreenshot}
                  size="medium"
                  sx={{
                    borderColor: "#f39c12",
                    color: "#f39c12",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: "#f39c12",
                      background: "rgba(243, 156, 18, 0.04)",
                    },
                  }}
                >
                  Save as Image
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Important Information */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#2c3e50",
                  mb: 3,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                What to Expect Next
              </Typography>

              <List sx={{ maxWidth: 500, margin: "0 auto" }}>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: "#2980b9" }}>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Confirmation"
                    secondary="You will receive an email with your order details"
                    primaryTypographyProps={{
                      fontWeight: "medium",
                      color: "#2c3e50",
                    }}
                    secondaryTypographyProps={{ color: "#7f8c8d" }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: "#2980b9" }}>
                    <LocalShipping />
                  </ListItemIcon>
                  <ListItemText
                    primary="Tracking Information"
                    secondary="We'll send tracking info once your order ships"
                    primaryTypographyProps={{
                      fontWeight: "medium",
                      color: "#2c3e50",
                    }}
                    secondaryTypographyProps={{ color: "#7f8c8d" }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: "#27ae60" }}>
                    <CalendarToday />
                  </ListItemIcon>
                  <ListItemText
                    primary="Delivery Estimate"
                    secondary="Estimated delivery time: 3-5 business days"
                    primaryTypographyProps={{
                      fontWeight: "medium",
                      color: "#2c3e50",
                    }}
                    secondaryTypographyProps={{ color: "#7f8c8d" }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40, color: "#f39c12" }}>
                    <SupportAgent />
                  </ListItemIcon>
                  <ListItemText
                    primary="Customer Support"
                    secondary="Contact us for any questions about your order"
                    primaryTypographyProps={{
                      fontWeight: "medium",
                      color: "#2c3e50",
                    }}
                    secondaryTypographyProps={{ color: "#7f8c8d" }}
                  />
                </ListItem>
              </List>

              <Box
                sx={{
                  mt: 4,
                  p: 2,
                  borderRadius: 2,
                  background: "#e8f4fc",
                  border: "1px solid #bee5eb",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "#0c5460", textAlign: "center" }}
                >
                  <strong>Need help?</strong> Contact our support team at
                  support@example.com or call us at (800) 123-4567
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OrderConfirmationPage;
