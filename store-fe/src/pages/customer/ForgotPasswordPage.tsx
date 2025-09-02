import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Email, ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";

const ForgotPasswordPage: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

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
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
          boxShadow: theme.shadows[6],
          backgroundColor: theme.palette.background.paper,
          transition: "background-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: theme.palette.primary.main,
                mb: 1,
                fontWeight: 600,
                transition: "color 0.3s ease",
              }}
            >
              Forgot Password
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                transition: "color 0.3s ease",
              }}
            >
              Enter your email to reset your password
            </Typography>
          </Box>

          {success ? (
            <Box sx={{ textAlign: "center" }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset link sent to your email!
              </Alert>
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 3,
                  transition: "color 0.3s ease",
                }}
              >
                Check your inbox and follow the instructions to reset your
                password.
              </Typography>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                startIcon={<ArrowBack />}
                fullWidth
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Back to Login
              </Button>
            </Box>
          ) : (
            <>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: theme.palette.text.secondary }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 3,
                    "& .MuiInputBase-root": {
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "inherit",
                      transition: "background-color 0.3s ease",
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    height: 48,
                    mb: 3,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    "&:hover": {
                      backgroundColor: theme.palette.primary.dark,
                    },
                    transition: "background-color 0.3s ease, color 0.3s ease",
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Send Reset Link"}
                </Button>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  component={Link}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                    transition: "color 0.3s ease",
                  }}
                >
                  <ArrowBack fontSize="small" />
                  Back to Login
                </Typography>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPasswordPage;
