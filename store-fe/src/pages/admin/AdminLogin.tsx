import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        // Check if user is admin
        if (response.user.is_admin) {
          navigate('/admin/dashboard');
        } else {
          setError('Access denied. Admin privileges required.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Admin Login
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="current-password"
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" align="center">
              Test Admin Credentials:
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Email: admin@store.com
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              Password: admin123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminLogin;
