import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { createGuestOrder, createUserOrder } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';
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
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  Snackbar
} from '@mui/material';
import { 
  Person,
  LocationOn,
  CreditCard,
  CheckCircle,
  Phone,
  Wallet
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.orders);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState<any>({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    mobileNumber: '',
    cnic: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  const subtotal = items.reduce((total, item) => {
    const originalPrice = item.product.original_price || item.product.retail_price || item.price;
    const offerPrice = item.product.offer_price || item.price;
    return total + (offerPrice * item.quantity);
  }, 0);
  const deliveryCharges = subtotal >= 2999 ? 0 : 150;
  const total = subtotal + deliveryCharges;

  const steps = ['Contact Info', 'Shipping', 'Payment'];

  const validateStep = (step: number) => {
    const newErrors: any = {};
    
    if (step === 0) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone is required';
    } else if (step === 1) {
      if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.postalCode) newErrors.postalCode = 'Postal code is required';
    } else if (step === 2) {
      if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
        if (!formData.mobileNumber) newErrors.mobileNumber = 'Mobile number is required';
        if (!formData.cnic) newErrors.cnic = 'CNIC is required';
      } else if (paymentMethod === 'card') {
        if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
        if (!formData.expiry) newErrors.expiry = 'Expiry date is required';
        if (!formData.cvv) newErrors.cvv = 'CVV is required';
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

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const processPayment = async (orderData: any, allData: any) => {
    if (paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') {
      const txnId = `TXN${Date.now()}`;
      setSnackbar({ open: true, message: `Send PKR ${total} to 03121999696 via ${paymentMethod.toUpperCase()}. Reference: ${txnId}`, severity: 'info' });
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
        formData.postalCode
      ].filter(Boolean);
      const shipping_address = addressParts.join(', ');

      const orderData: any = {
        customer_name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address,
        payment_method: paymentMethod,
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const paymentResult = await processPayment(orderData, formData);
      
      if (paymentResult.success) {
        if (paymentResult.transaction_id) {
          orderData.transaction_id = paymentResult.transaction_id;
          orderData.payment_status = 'pending';
        }

        if (isAuthenticated) {
          await dispatch(createUserOrder(orderData)).unwrap();
        } else {
          await dispatch(createGuestOrder(orderData)).unwrap();
        }

        dispatch(clearCart());
        setSnackbar({ open: true, message: 'Order placed successfully!', severity: 'success' });
        setTimeout(() => navigate('/order-confirmation'), 2000);
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to place order. Please try again.', severity: 'error' });
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Box sx={{ p: 3, pt: 12, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      
      <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {currentStep === 0 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person /> Contact Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleChange('firstName')}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleChange('lastName')}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {currentStep === 1 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn /> Shipping Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address Line 1"
                        value={formData.addressLine1}
                        onChange={handleChange('addressLine1')}
                        error={!!errors.addressLine1}
                        helperText={errors.addressLine1}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address Line 2 (Optional)"
                        value={formData.addressLine2}
                        onChange={handleChange('addressLine2')}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="City"
                        value={formData.city}
                        onChange={handleChange('city')}
                        error={!!errors.city}
                        helperText={errors.city}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="State"
                        value={formData.state}
                        onChange={handleChange('state')}
                        error={!!errors.state}
                        helperText={errors.state}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Postal Code"
                        value={formData.postalCode}
                        onChange={handleChange('postalCode')}
                        error={!!errors.postalCode}
                        helperText={errors.postalCode}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {currentStep === 2 && (
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCard /> Payment Method
                  </Typography>
                  <FormControl component="fieldset" sx={{ mb: 3 }}>
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="cod"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Wallet sx={{ color: 'success.main' }} />
                            <Box>
                              <Typography variant="body1" fontWeight="bold">Cash on Delivery (COD)</Typography>
                              <Typography variant="body2" color="text.secondary">Pay when you receive your order</Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="easypaisa"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ color: 'success.main' }} />
                            <Box>
                              <Typography variant="body1" fontWeight="bold">EasyPaisa</Typography>
                              <Typography variant="body2" color="text.secondary">Pay securely with EasyPaisa mobile wallet</Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="jazzcash"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ color: 'warning.main' }} />
                            <Box>
                              <Typography variant="body1" fontWeight="bold">JazzCash</Typography>
                              <Typography variant="body2" color="text.secondary">Pay securely with JazzCash mobile wallet</Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <FormControlLabel
                        value="card"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CreditCard sx={{ color: 'primary.main' }} />
                            <Box>
                              <Typography variant="body1" fontWeight="bold">Credit/Debit Card</Typography>
                              <Typography variant="body2" color="text.secondary">Secure payment with SSL encryption</Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </RadioGroup>
                  </FormControl>
                  
                  {(paymentMethod === 'easypaisa' || paymentMethod === 'jazzcash') && (
                    <Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        {paymentMethod === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'} Payment
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Mobile Number"
                            placeholder="03XXXXXXXXX"
                            value={formData.mobileNumber}
                            onChange={handleChange('mobileNumber')}
                            error={!!errors.mobileNumber}
                            helperText={errors.mobileNumber}
                            InputProps={{
                              startAdornment: <InputAdornment position="start"><Phone /></InputAdornment>
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="CNIC (Last 4 digits)"
                            placeholder="1234"
                            value={formData.cnic}
                            onChange={handleChange('cnic')}
                            error={!!errors.cnic}
                            helperText={errors.cnic}
                            inputProps={{ maxLength: 4 }}
                          />
                        </Grid>
                      </Grid>
                      <Alert severity="info" sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircle />
                          <Box>
                            <Typography variant="body2">
                              Payment will be sent to: <strong>03121999696 (SadaPay)</strong>
                            </Typography>
                            <Typography variant="caption">
                              You will receive payment confirmation on your mobile number.
                            </Typography>
                          </Box>
                        </Box>
                      </Alert>
                    </Box>
                  )}

                  {paymentMethod === 'card' && (
                    <Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>Card Details</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Card Number"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleChange('cardNumber')}
                            error={!!errors.cardNumber}
                            helperText={errors.cardNumber}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="Expiry Date"
                            placeholder="MM/YY"
                            value={formData.expiry}
                            onChange={handleChange('expiry')}
                            error={!!errors.expiry}
                            helperText={errors.expiry}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            fullWidth
                            label="CVV"
                            placeholder="123"
                            value={formData.cvv}
                            onChange={handleChange('cvv')}
                            error={!!errors.cvv}
                            helperText={errors.cvv}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={currentStep === 0}
                  onClick={handlePrev}
                >
                  Previous
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button variant="contained" onClick={handleNext}>
                    Next
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                  >
                    Place Order
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h5" gutterBottom>Order Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {items.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Box
                  component="img"
                  src={item.image_url}
                  alt={item.name}
                  sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 1 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2">{item.name}</Typography>
                  <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                  PKR {item.price * item.quantity}
                </Typography>
              </Box>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>PKR {subtotal}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Delivery Charges:</Typography>
              <Typography>{deliveryCharges === 0 ? 'FREE' : `PKR ${deliveryCharges}`}</Typography>
            </Box>
            {subtotal >= 2999 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" color="success.main">🚚 Free delivery on orders above PKR 2999</Typography>
              </Box>
            )}
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" sx={{ color: theme.palette.primary.main }}>
                PKR {total}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </Box>
  );
};

export default CheckoutPage;