import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  useTheme,
  Chip,
  Divider,
  Alert,
  InputAdornment,
  Fade,
  Slide,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Send,
  AccessTime,
  Person,
  Subject as SubjectIcon,
  Message,
} from "@mui/icons-material";
import { BrandName, COLORS } from "../../utils/constant";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

// ========== KEYFRAME ANIMATIONS ==========
// Background animation for gradient
const backgroundAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ========== STYLED COMPONENTS ==========
// Styled component for animated background
const AnimatedBackground = styled(Box)<{ mode: "light" | "dark" }>`
  min-height: 100vh;
  background: ${({ mode }) =>
    mode === "light"
      ? `linear-gradient(270deg, ${COLORS.offWhite}, ${COLORS.silver}, ${COLORS.offWhite})`
      : `linear-gradient(270deg, ${COLORS.deepNavy}, #0a1929, ${COLORS.deepNavy})`};
  background-size: 200% 200%;
  animation: ${backgroundAnimation} 15s ease infinite;
  padding-top: 12;
  padding-bottom: 8;
  transition: background-color 0.3s ease;
`;

const ContactPage: React.FC = () => {
  const theme = useTheme();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.subject) newErrors.subject = "Subject is required";
    if (!formData.message) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Simulate form submission
      setIsSubmitted(true);
      setTimeout(() => {
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setIsSubmitted(false);
      }, 2000);
    } catch (error) {
      alert("Failed to send message. Please try again.");
    }
  };

  const handleChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({ ...formData, [field]: e.target.value });
      if (errors[field]) {
        setErrors({ ...errors, [field]: "" });
      }
    };
  const accentColor =
    theme.palette.mode === "light" ? COLORS.deepNavy : COLORS.offWhite;

  return (
    <AnimatedBackground mode={theme.palette.mode as "light" | "dark"}>
      <Box
        sx={{
          p: 8,
          maxWidth: 1200,
          mx: "auto",
          minHeight: "100vh",
        }}
      >
        <Fade in={true} timeout={800}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h2"
              sx={{
                textAlign: "center",
                color: theme.palette.text.primary,
                mb: 5,
                fontWeight: "bold",
                textTransform: "uppercase",
                textShadow: `2px 2px 4px ${accentColor}40`,
                fontSize: { xs: "2rem", md: "3rem" },
                letterSpacing: "2px",
                position: "relative",
                "&::after": {
                  content: '""',
                  display: "block",
                  width: "100px",
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                  margin: "10px auto 0",
                  boxShadow: `0 2px 10px ${accentColor}40`,
                },
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.text.secondary,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              Get in touch with us - we'd love to hear from you!
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4}>
          {/* Contact Form */}
          <Grid item xs={12} lg={8}>
            <Slide direction="right" in={true} timeout={800}>
              <Card
                sx={{
                  borderRadius: 3,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Send
                      sx={{
                        mr: 2,
                        color: theme.palette.primary.main,
                        fontSize: 32,
                      }}
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      Send us a Message
                    </Typography>
                  </Box>

                  {isSubmitted && (
                    <Alert severity="success" sx={{ mb: 3 }}>
                      Sending your message...
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={formData.firstName}
                          onChange={handleChange("firstName")}
                          error={!!errors.firstName}
                          helperText={errors.firstName}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person
                                  sx={{ color: theme.palette.text.secondary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
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
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person
                                  sx={{ color: theme.palette.text.secondary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
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
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Email
                                  sx={{ color: theme.palette.text.secondary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
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
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Phone
                                  sx={{ color: theme.palette.text.secondary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Subject"
                          value={formData.subject}
                          onChange={handleChange("subject")}
                          error={!!errors.subject}
                          helperText={errors.subject}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SubjectIcon
                                  sx={{ color: theme.palette.text.secondary }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Message"
                          multiline
                          rows={6}
                          value={formData.message}
                          onChange={handleChange("message")}
                          error={!!errors.message}
                          helperText={errors.message}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Message
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    alignSelf: "flex-start",
                                    mt: 1,
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ mb: 3 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          startIcon={<Send />}
                          sx={{
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            },
                            px: 4,
                            py: 1.5,
                            fontSize: "1.1rem",
                          }}
                        >
                          Send Message
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} lg={4}>
            <Slide direction="left" in={true} timeout={800}>
              <Box>
                <Card
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        Get in Touch
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 3 }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            mr: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Email sx={{ fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ color: theme.palette.text.primary }}
                          >
                            Email
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            support@saiyaara.com
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 3 }}
                      >
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            mr: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Phone sx={{ fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ color: theme.palette.text.primary }}
                          >
                            Phone
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            +91-XXXXXXXXXX
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                        <Box
                          sx={{
                            p: 1.5,
                            borderRadius: "50%",
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            mr: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 0.5,
                          }}
                        >
                          <LocationOn sx={{ fontSize: 20 }} />
                        </Box>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            sx={{ color: theme.palette.text.primary }}
                          >
                            Address
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {BrandName.name} Store
                            <br />
                            123 Jewelry Street
                            <br />
                            Mumbai, Maharashtra 400001
                            <br />
                            India
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AccessTime
                        sx={{ mr: 2, color: theme.palette.primary.main }}
                      />
                      <Typography
                        variant="h6"
                        sx={{ color: theme.palette.text.primary }}
                      >
                        Business Hours
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <strong>Monday - Friday:</strong> 9:00 AM - 8:00 PM
                      </Typography>
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <strong>Saturday:</strong> 10:00 AM - 6:00 PM
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        <strong>Sunday:</strong> 11:00 AM - 5:00 PM
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    borderRadius: 3,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: theme.palette.text.primary }}
                    >
                      Response Time
                    </Typography>
                    <Chip
                      label="Typically within 24 hours"
                      color="primary"
                      variant="filled"
                      sx={{ mb: 2 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      We strive to respond to all inquiries within one business
                      day. For urgent matters, please call us directly.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Slide>
          </Grid>
        </Grid>
      </Box>
    </AnimatedBackground>
  );
};

export default ContactPage;
