import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  createGuestOrder,
  createUserOrder,
} from "../../store/slices/orderSlice";
import { clearCart } from "../../store/slices/cartSlice";
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  Snackbar,
  useTheme,
  Fade,
  Slide,
  Grow,
  Zoom,
  Container,
  Chip,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  Person,
  LocationOn,
  CreditCard,
  CheckCircle,
  Phone,
  Wallet,
  LocalShipping,
  Security,
  Diamond,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { loading } = useSelector((state: RootState) => state.orders);

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [formData, setFormData] = useState<any>({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    mobileNumber: "",
    cnic: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info",
  });

  const subtotal = items.reduce((total, item) => {
    const offerPrice = item.product.offer_price || item.price;
    return total + offerPrice * item.quantity;
  }, 0);
  const deliveryCharges = subtotal >= 2999 ? 0 : 150;
  const total = subtotal + deliveryCharges;

  const steps = ["Contact Info", "Shipping", "Payment"];

  const validateStep = (step: number) => {
    const newErrors: any = {};

    if (step === 0) {
      if (!formData.firstName) newErrors.firstName = "First name is required";
      if (!formData.lastName) newErrors.lastName = "Last name is required";
      if (!formData.email) newErrors.email = "Email is required";
      if (!formData.phone) newErrors.phone = "Phone is required";
    } else if (step === 1) {
      if (!formData.addressLine1)
        newErrors.addressLine1 = "Address is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.postalCode)
        newErrors.postalCode = "Postal code is required";
    } else if (step === 2) {
      if (paymentMethod === "easypaisa" || paymentMethod === "jazzcash") {
        if (!formData.mobileNumber)
          newErrors.mobileNumber = "Mobile number is required";
        if (!formData.cnic) newErrors.cnic = "CNIC is required";
      } else if (paymentMethod === "card") {
        if (!formData.cardNumber)
          newErrors.cardNumber = "Card number is required";
        if (!formData.expiry) newErrors.expiry = "Expiry date is required";
        if (!formData.cvv) newErrors.cvv = "CVV is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    };

  const processPayment = async (orderData: any, formData: any) => {
    if (paymentMethod === "easypaisa" || paymentMethod === "jazzcash") {
      const txnId = `TXN${Date.now()}`;
      setSnackbar({
        open: true,
        message: `Send PKR ${total} to 03121999696 via ${paymentMethod.toUpperCase()}. Reference: ${txnId}`,
        severity: "info",
      });
      return { success: true, transaction_id: txnId };
    }
    return { success: true };
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    try {
      const customer_name = `${formData.firstName} ${formData.lastName}`.trim();
      const addressParts = [
        formData.addressLine1,
        formData.addressLine2,
        formData.city,
        formData.state,
        formData.postalCode,
      ].filter(Boolean);
      const shipping_address = addressParts.join(", ");

      const orderData: any = {
        customer_name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address,
        payment_method: paymentMethod,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const paymentResult = await processPayment(orderData, formData);

      if (paymentResult.success) {
        if (paymentResult.transaction_id) {
          orderData.transaction_id = paymentResult.transaction_id;
          orderData.payment_status = "pending";
        }

        if (isAuthenticated) {
          await dispatch(createUserOrder(orderData)).unwrap();
        } else {
          await dispatch(createGuestOrder(orderData)).unwrap();
        }

        dispatch(clearCart());
        setSnackbar({
          open: true,
          message: "Order placed successfully!",
          severity: "success",
        });
        setTimeout(() => navigate("/order-confirmation"), 2000);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to place order. Please try again.",
        severity: "error",
      });
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const formatCurrency = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };
  const paymentMethods: Record<string, keyof typeof theme.palette> = {
    cod: "primary",
    easypaisa: "success",
    jazzcash: "warning",
    card: "error",
  };
  const selectedColor = (
    theme.palette[paymentMethods[paymentMethod]] as { main: string }
  ).main;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        p: 2.5,
        overflow: "hidden",
        transition: "background-color 0.3s ease",
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header Section */}
        <Fade in={true} timeout={800}>
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Diamond
                sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  background:
                    theme.palette.mode === "light"
                      ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, #4C4A73 100%)`
                      : `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, #CBD5E1 100%)`,
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Checkout
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.secondary, mb: 3 }}
            >
              Complete your purchase with secure checkout
            </Typography>
          </Box>
        </Fade>

        <Stepper
          activeStep={currentStep}
          sx={{
            mb: 6,
            "& .MuiStepLabel-label": {
              fontWeight: 600,
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    "&.Mui-completed": {
                      color: theme.palette.success.main,
                    },
                    "&.Mui-active": {
                      color: theme.palette.primary.main,
                    },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Slide direction="right" in={true} timeout={800}>
              <Card
                sx={{
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[4],
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {currentStep === 0 && (
                    <Grow in={true} timeout={800}>
                      <Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 3 }}
                        >
                          <Person
                            sx={{
                              fontSize: 32,
                              color: theme.palette.primary.main,
                              mr: 2,
                            }}
                          />
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            Contact Information
                          </Typography>
                        </Box>
                        <Grid container spacing={3}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="First Name"
                              value={formData.firstName}
                              onChange={handleChange("firstName")}
                              error={!!errors.firstName}
                              helperText={errors.firstName}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Last Name"
                              value={formData.lastName}
                              onChange={handleChange("lastName")}
                              error={!!errors.lastName}
                              helperText={errors.lastName}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange("email")}
                              error={!!errors.email}
                              helperText={errors.email}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              value={formData.phone}
                              onChange={handleChange("phone")}
                              error={!!errors.phone}
                              helperText={errors.phone}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grow>
                  )}

                  {currentStep === 1 && (
                    <Grow in={true} timeout={800}>
                      <Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 3 }}
                        >
                          <LocationOn
                            sx={{
                              fontSize: 32,
                              color: theme.palette.primary.main,
                              mr: 2,
                            }}
                          />
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            Shipping Address
                          </Typography>
                        </Box>
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Address Line 1"
                              value={formData.addressLine1}
                              onChange={handleChange("addressLine1")}
                              error={!!errors.addressLine1}
                              helperText={errors.addressLine1}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Address Line 2 (Optional)"
                              value={formData.addressLine2}
                              onChange={handleChange("addressLine2")}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="City"
                              value={formData.city}
                              onChange={handleChange("city")}
                              error={!!errors.city}
                              helperText={errors.city}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="State"
                              value={formData.state}
                              onChange={handleChange("state")}
                              error={!!errors.state}
                              helperText={errors.state}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Postal Code"
                              value={formData.postalCode}
                              onChange={handleChange("postalCode")}
                              error={!!errors.postalCode}
                              helperText={errors.postalCode}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 2,
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Box>
                    </Grow>
                  )}

                  {currentStep === 2 && (
                    <Grow in={true} timeout={800}>
                      <Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mb: 3 }}
                        >
                          <CreditCard
                            sx={{
                              fontSize: 32,
                              color: theme.palette.primary.main,
                              mr: 2,
                            }}
                          />
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 600,
                              color: theme.palette.text.primary,
                            }}
                          >
                            Payment Method
                          </Typography>
                        </Box>
                        <FormControl
                          component="fieldset"
                          sx={{ mb: 4, width: "100%" }}
                        >
                          <RadioGroup
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                          >
                            {[
                              {
                                value: "cod",
                                label: "Cash on Delivery (COD)",
                                icon: <Wallet />,
                                description: "Pay when you receive your order",
                                color: "success",
                              },
                              {
                                value: "easypaisa",
                                label: "EasyPaisa",
                                icon: <Phone />,
                                description:
                                  "Pay securely with EasyPaisa mobile wallet",
                                color: "info",
                              },
                              {
                                value: "jazzcash",
                                label: "JazzCash",
                                icon: <Phone />,
                                description:
                                  "Pay securely with JazzCash mobile wallet",
                                color: "warning",
                              },
                              {
                                value: "card",
                                label: "Credit/Debit Card",
                                icon: <CreditCard />,
                                description:
                                  "Secure payment with SSL encryption",
                                color: "primary",
                              },
                            ].map((method) => (
                              <Card
                                key={method.value}
                                sx={{
                                  mb: 2,
                                  border:
                                    paymentMethod === method.value
                                      ? `2px solid ${selectedColor}`
                                      : `1px solid ${theme.palette.divider}`,
                                  borderRadius: 3,
                                  transition: "all 0.3s ease",
                                  "&:hover": {
                                    borderColor: selectedColor,
                                    transform: "translateY(-2px)",
                                  },
                                }}
                              >
                                <CardContent sx={{ p: 2 }}>
                                  <FormControlLabel
                                    value={method.value}
                                    control={<Radio />}
                                    label={
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 2,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            color: selectedColor,
                                          }}
                                        >
                                          {method.icon}
                                        </Box>
                                        <Box>
                                          <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                          >
                                            {method.label}
                                          </Typography>
                                          <Typography
                                            variant="body2"
                                            color="text.secondary"
                                          >
                                            {method.description}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    }
                                    sx={{ width: "100%", m: 0 }}
                                  />
                                </CardContent>
                              </Card>
                            ))}
                          </RadioGroup>
                        </FormControl>

                        {/* Payment Method Details */}
                        {(paymentMethod === "easypaisa" ||
                          paymentMethod === "jazzcash") && (
                          <Fade in={true} timeout={500}>
                            <Box>
                              <Divider sx={{ my: 3 }} />
                              <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ color: theme.palette.text.primary }}
                              >
                                {paymentMethod === "easypaisa"
                                  ? "EasyPaisa"
                                  : "JazzCash"}{" "}
                                Payment
                              </Typography>
                              <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="Mobile Number"
                                    placeholder="03XXXXXXXXX"
                                    value={formData.mobileNumber}
                                    onChange={handleChange("mobileNumber")}
                                    error={!!errors.mobileNumber}
                                    helperText={errors.mobileNumber}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          <Phone />
                                        </InputAdornment>
                                      ),
                                    }}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <TextField
                                    fullWidth
                                    label="CNIC (Last 4 digits)"
                                    placeholder="1234"
                                    value={formData.cnic}
                                    onChange={handleChange("cnic")}
                                    error={!!errors.cnic}
                                    helperText={errors.cnic}
                                    inputProps={{ maxLength: 4 }}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>
                              </Grid>
                              <Alert
                                severity="info"
                                sx={{
                                  mt: 3,
                                  borderRadius: 2,
                                  backgroundColor:
                                    theme.palette.mode === "dark"
                                      ? "rgba(2, 136, 209, 0.1)"
                                      : undefined,
                                }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <CheckCircle />
                                  <Box>
                                    <Typography variant="body2">
                                      Payment will be sent to:{" "}
                                      <strong>03121999696 (SadaPay)</strong>
                                    </Typography>
                                    <Typography variant="caption">
                                      You will receive payment confirmation on
                                      your mobile number.
                                    </Typography>
                                  </Box>
                                </Box>
                              </Alert>
                            </Box>
                          </Fade>
                        )}

                        {paymentMethod === "card" && (
                          <Fade in={true} timeout={500}>
                            <Box>
                              <Divider sx={{ my: 3 }} />
                              <Typography
                                variant="h5"
                                gutterBottom
                                sx={{ color: theme.palette.text.primary }}
                              >
                                Card Details
                              </Typography>
                              <Grid container spacing={3}>
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Card Number"
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.cardNumber}
                                    onChange={handleChange("cardNumber")}
                                    error={!!errors.cardNumber}
                                    helperText={errors.cardNumber}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    label="Expiry Date"
                                    placeholder="MM/YY"
                                    value={formData.expiry}
                                    onChange={handleChange("expiry")}
                                    error={!!errors.expiry}
                                    helperText={errors.expiry}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <TextField
                                    fullWidth
                                    label="CVV"
                                    placeholder="123"
                                    value={formData.cvv}
                                    onChange={handleChange("cvv")}
                                    error={!!errors.cvv}
                                    helperText={errors.cvv}
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                      },
                                    }}
                                  />
                                </Grid>
                              </Grid>
                            </Box>
                          </Fade>
                        )}
                      </Box>
                    </Grow>
                  )}

                  <Divider sx={{ my: 4 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      disabled={currentStep === 0}
                      onClick={handlePrev}
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                        px: 4,
                        py: 1,
                      }}
                    >
                      Previous
                    </Button>
                    {currentStep < steps.length - 1 ? (
                      <Button
                        variant="contained"
                        onClick={handleNext}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1,
                          backgroundColor: theme.palette.primary.main,
                          "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                          },
                        }}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={loading}
                        startIcon={
                          loading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <CheckCircle />
                          )
                        }
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1,
                          backgroundColor: theme.palette.success.main,
                          "&:hover": {
                            backgroundColor: theme.palette.success.dark,
                          },
                        }}
                      >
                        {loading ? "Processing..." : "Place Order"}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Slide direction="left" in={true} timeout={800}>
              <Box>
                {/* Mobile Order Summary Toggle */}
                <Box sx={{ display: { xs: "block", lg: "none" }, mb: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                    endIcon={showOrderSummary ? <ExpandLess /> : <ExpandMore />}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                    }}
                  >
                    {showOrderSummary
                      ? "Hide Order Summary"
                      : "Show Order Summary"}
                  </Button>
                </Box>

                <Box
                  sx={{
                    display: {
                      xs: showOrderSummary ? "block" : "none",
                      lg: "block",
                    },
                  }}
                >
                  <Paper
                    sx={{
                      p: 4,
                      position: "sticky",
                      top: 24,
                      borderRadius: 3,
                      backgroundColor: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: theme.shadows[4],
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <LocalShipping
                        sx={{
                          fontSize: 28,
                          color: theme.palette.primary.main,
                          mr: 2,
                        }}
                      />
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        Order Summary
                      </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ maxHeight: 300, overflow: "auto", mb: 3 }}>
                      {items.map((item, index) => (
                        <Fade
                          in={true}
                          timeout={800}
                          key={item.id}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              mb: 2,
                              alignItems: "center",
                            }}
                          >
                            <Box
                              component="img"
                              src={
                                item.image_url ||
                                "https://via.placeholder.com/60x60?text=Jewelry"
                              }
                              alt={item.name}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 2,
                                border: `1px solid ${theme.palette.divider}`,
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  color: theme.palette.text.primary,
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Qty: {item.quantity} •{" "}
                                {formatCurrency(item.price)} each
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                color: theme.palette.primary.main,
                                fontWeight: "bold",
                                minWidth: 80,
                                textAlign: "right",
                              }}
                            >
                              {formatCurrency(item.price * item.quantity)}
                            </Typography>
                          </Box>
                        </Fade>
                      ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1">Subtotal:</Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {formatCurrency(subtotal)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocalShipping
                          sx={{
                            fontSize: 20,
                            color: theme.palette.text.secondary,
                          }}
                        />
                        <Typography variant="body1">Delivery:</Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color={
                          deliveryCharges === 0
                            ? "success.main"
                            : "text.primary"
                        }
                      >
                        {deliveryCharges === 0
                          ? "FREE"
                          : formatCurrency(deliveryCharges)}
                      </Typography>
                    </Box>

                    {deliveryCharges === 0 && (
                      <Box
                        sx={{
                          mb: 2,
                          p: 2,
                          backgroundColor: theme.palette.success.light,
                          borderRadius: 2,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.success.dark,
                            textAlign: "center",
                          }}
                        >
                          🎉 Free shipping on orders over PKR 2,999!
                        </Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h6">Total Amount:</Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 700,
                        }}
                      >
                        {formatCurrency(total)}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        mt: 2,
                      }}
                    >
                      <Security
                        sx={{ fontSize: 20, color: theme.palette.success.main }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                      >
                        Secure checkout with SSL encryption
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Slide>
          </Grid>
        </Grid>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          message={snackbar.message}
          sx={{
            "& .MuiSnackbarContent-root": {
              borderRadius: 3,
            },
          }}
        />
      </Container>
    </Box>
  );
};

export default CheckoutPage;
