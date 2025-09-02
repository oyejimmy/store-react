import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from "@mui/material";
import {
  Person,
  Edit,
  Save,
  Cancel,
  ShoppingBag,
  Phone,
  Email,
  Visibility,
  PhotoCamera,
  CalendarToday,
  Badge,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { getCurrentUser } from "../../store/slices/authSlice";
import api, { orderAPI } from "../../services/api";

const ProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const [editing, setEditing] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        username: user.username || "",
      });
      setProfileImage((user as any).profile_image || null);
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const data = await orderAPI.getUserOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders");
    }
  };

  const handleSave = async () => {
    try {
      const updateData = {
        ...formData,
        profile_image: profileImage,
      };
      await api.put("/auth/profile", updateData);
      dispatch(getCurrentUser() as any);
      setEditing(false);
    } catch (error) {
      alert("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      username: user?.username || "",
    });
    setEditing(false);
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

  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setOrderDetailOpen(true);
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        p: 3,
        py: 4,
        overflow: "hidden",
        transition: "background-color 0.3s ease",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: theme.palette.text.primary,
          transition: "color 0.3s ease",
        }}
      >
        My Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: "fit-content",
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <CardContent sx={{ textAlign: "center" }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  src={profileImage || undefined}
                  variant="square"
                  sx={{
                    width: 150,
                    height: 150,
                    mx: "auto",
                    mb: 2,
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontSize: "3rem",
                    cursor: editing ? "pointer" : "default",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                  }}
                  onClick={
                    editing
                      ? () =>
                          document
                            .getElementById("profile-image-input")
                            ?.click()
                      : undefined
                  }
                >
                  {!profileImage && <Person sx={{ fontSize: "4rem" }} />}
                </Avatar>
                {editing && (
                  <>
                    <input
                      id="profile-image-input"
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () =>
                            setProfileImage(reader.result as string);
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <IconButton
                      onClick={() =>
                        document.getElementById("profile-image-input")?.click()
                      }
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        "&:hover": { bgcolor: theme.palette.primary.dark },
                        width: 36,
                        height: 36,
                        transition: "background-color 0.3s ease",
                      }}
                    >
                      <PhotoCamera sx={{ fontSize: 18 }} />
                    </IconButton>
                    {profileImage && (
                      <IconButton
                        onClick={() => setProfileImage(null)}
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          left: 8,
                          bgcolor: theme.palette.error.main,
                          color: theme.palette.error.contrastText,
                          "&:hover": { bgcolor: theme.palette.error.dark },
                          width: 36,
                          height: 36,
                          transition: "background-color 0.3s ease",
                        }}
                      >
                        ✕
                      </IconButton>
                    )}
                  </>
                )}
              </Box>
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  color: theme.palette.text.primary,
                  transition: "color 0.3s ease",
                }}
              >
                {user?.full_name || "User"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ transition: "color 0.3s ease" }}
              >
                @{user?.username || "username"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
                sx={{ transition: "color 0.3s ease" }}
              >
                Member since{" "}
                {new Date(user?.created_at || Date.now()).toLocaleDateString()}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: "center",
                  mt: 1,
                }}
              >
                <Chip
                  label={user?.is_admin ? "Admin" : "Customer"}
                  color={user?.is_admin ? "secondary" : "primary"}
                />
                <Chip
                  label={user?.is_active ? "Active" : "Inactive"}
                  color={user?.is_active ? "success" : "error"}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  Profile Information
                </Typography>
                {!editing ? (
                  <Button
                    startIcon={<Edit />}
                    onClick={() => setEditing(true)}
                    variant="outlined"
                    sx={{ transition: "all 0.3s ease" }}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      startIcon={<Save />}
                      onClick={handleSave}
                      variant="contained"
                      sx={{ transition: "all 0.3s ease" }}
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<Cancel />}
                      onClick={handleCancel}
                      variant="outlined"
                      sx={{ transition: "all 0.3s ease" }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <Person sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <Email sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <Badge sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!editing}
                    InputProps={{
                      startAdornment: (
                        <Phone sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: theme.palette.divider,
                      borderRadius: 2,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "grey.50",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CalendarToday
                        sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                      />
                      <Typography variant="subtitle2" color="primary.main">
                        Account Created
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      fontWeight={500}
                      sx={{
                        color: theme.palette.text.primary,
                        transition: "color 0.3s ease",
                      }}
                    >
                      {new Date(
                        user?.created_at || Date.now()
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: theme.palette.divider,
                      borderRadius: 2,
                      bgcolor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.05)"
                          : "grey.50",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Person
                        sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                      />
                      <Typography variant="subtitle2" color="primary.main">
                        Account Status
                      </Typography>
                    </Box>
                    <Chip
                      label={user?.is_active ? "Active" : "Inactive"}
                      color={user?.is_active ? "success" : "error"}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Order History */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              transition: "background-color 0.3s ease, box-shadow 0.3s ease",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <ShoppingBag sx={{ mr: 1, color: "primary.main" }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  Order History
                </Typography>
              </Box>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  transition: "background-color 0.3s ease",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: theme.palette.text.primary,
                          transition: "color 0.3s ease",
                        }}
                      >
                        Order #
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.primary,
                          transition: "color 0.3s ease",
                        }}
                      >
                        Date
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.primary,
                          transition: "color 0.3s ease",
                        }}
                      >
                        Items
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.primary,
                          transition: "color 0.3s ease",
                        }}
                      >
                        Total
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.primary,
                          transition: "color 0.3s ease",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.primary,
                          transition: "color 0.3s ease",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell
                          sx={{
                            color: theme.palette.text.primary,
                            transition: "color 0.3s ease",
                          }}
                        >
                          {order.order_number}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme.palette.text.primary,
                            transition: "color 0.3s ease",
                          }}
                        >
                          {new Date(order.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme.palette.text.primary,
                            transition: "color 0.3s ease",
                          }}
                        >
                          {order.items?.length || 0} items
                        </TableCell>
                        <TableCell
                          sx={{
                            color: theme.palette.text.primary,
                            transition: "color 0.3s ease",
                          }}
                        >
                          PKR {order.total_amount}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={order.status?.toUpperCase() || "PENDING"}
                            color={getStatusColor(order.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => viewOrderDetails(order)}
                            color="primary"
                            sx={{ transition: "color 0.3s ease" }}
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          sx={{ textAlign: "center", py: 4 }}
                        >
                          <Typography
                            color="text.secondary"
                            sx={{ transition: "color 0.3s ease" }}
                          >
                            No orders found. Start shopping to see your orders
                            here!
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailOpen}
        onClose={() => setOrderDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            transition: "background-color 0.3s ease",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: theme.palette.text.primary,
            transition: "color 0.3s ease",
          }}
        >
          Order Details - {selectedOrder?.order_number}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.primary,
                      transition: "color 0.3s ease",
                    }}
                  >
                    Order Date:
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.primary,
                      transition: "color 0.3s ease",
                    }}
                  >
                    Status:
                  </Typography>
                  <Chip
                    label={selectedOrder.status?.toUpperCase() || "PENDING"}
                    color={getStatusColor(selectedOrder.status) as any}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.primary,
                      transition: "color 0.3s ease",
                    }}
                  >
                    Shipping Address:
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {selectedOrder.shipping_address}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  color: theme.palette.text.primary,
                  transition: "color 0.3s ease",
                }}
              >
                Order Items
              </Typography>
              {selectedOrder.items?.map((item: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      transition: "color 0.3s ease",
                    }}
                  >
                    {item.product_name} x {item.quantity}
                  </Typography>
                  <Typography
                    sx={{
                      color: theme.palette.text.primary,
                      transition: "color 0.3s ease",
                    }}
                  >
                    PKR {item.price * item.quantity}
                  </Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  Total:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.text.primary,
                    transition: "color 0.3s ease",
                  }}
                >
                  PKR {selectedOrder.total_amount}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOrderDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProfilePage;
