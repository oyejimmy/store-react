import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
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
  Grid,
  Typography,
  CircularProgress,
  Paper,
  TablePagination,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Refresh, Visibility, Person } from "@mui/icons-material";
import { adminAPI } from "../../services/api";

// Color constants
const COLORS = {
  offWhite: "#F8FAFC",
  deepNavy: "#1E1B4B",
  silver: "#94A3B8",
};

const tableHeadingColor = {
  backgroundColor: COLORS.deepNavy,
  color: COLORS.offWhite,
  fontWeight: 600,
};

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  username?: string;
  hashed_password?: string;
}

const AdminUsers: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<{
    id: number;
    field: string;
    value: boolean;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllUsers();
      setUsers(data);
    } catch (error) {
      // Error handling would be done here
      console.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleToggleStatus = (userId: any, active: boolean) => {
    setUserToUpdate({ id: userId, field: "is_active", value: active });
    setConfirmDialogOpen(true);
  };

  const handleToggleAdmin = (userId: any, currentAdminStatus: boolean) => {
    setUserToUpdate({
      id: userId,
      field: "is_admin",
      value: !currentAdminStatus,
    });
    setConfirmDialogOpen(true);
  };

  const confirmUpdate = async () => {
    if (!userToUpdate) return;

    try {
      await adminAPI.updateUser(userToUpdate.id, {
        [userToUpdate.field]: userToUpdate.value,
      });
      setUsers(
        users.map((user) =>
          user.id === userToUpdate.id
            ? { ...user, [userToUpdate.field]: userToUpdate.value }
            : user
        )
      );
      // Success message would be shown here
    } catch (error) {
      // Error handling would be done here
      console.error("Failed to update user");
    } finally {
      setConfirmDialogOpen(false);
      setUserToUpdate(null);
    }
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

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "success" : "error";
  };

  const getRoleColor = (isAdmin: boolean) => {
    return isAdmin ? "secondary" : "primary";
  };

  const calculateAccountAge = (createdAt: string) => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        minHeight: "100vh",
        backgroundColor: theme.palette.mode === "dark" ? "#0f172a" : COLORS.offWhite,
      }}
    >
      {/* Header with Refresh Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 3,
          background: `linear-gradient(135deg, ${COLORS.deepNavy} 0%, #3730a3 100%)`,
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(30, 27, 75, 0.2)",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: COLORS.offWhite,
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
          }}
        >
          User Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchUsers}
          disabled={loading}
          size={isMobile ? "small" : "medium"}
          sx={{
            borderColor: COLORS.offWhite,
            color: COLORS.offWhite,
            backgroundColor: "rgba(248, 250, 252, 0.1)",
            "&:hover": {
              borderColor: COLORS.offWhite,
              backgroundColor: "rgba(248, 250, 252, 0.2)",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ 
          overflowX: "auto", 
          borderRadius: 2, 
          boxShadow: 3,
          backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
        }}
      >
        <Table size={isMobile ? "small" : "medium"}>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeadingColor}>Name</TableCell>
              <TableCell sx={tableHeadingColor}>Email</TableCell>
              {!isMobile && <TableCell sx={tableHeadingColor}>Phone</TableCell>}
              <TableCell sx={tableHeadingColor}>Status</TableCell>
              <TableCell sx={tableHeadingColor}>Role</TableCell>
              {!isTablet && (
                <TableCell sx={tableHeadingColor}>Join Date</TableCell>
              )}
              <TableCell sx={tableHeadingColor}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={isMobile ? 5 : isTablet ? 6 : 7}
                  sx={{ textAlign: "center", py: 4 }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow 
                    key={user.id} 
                    hover
                    sx={{
                      backgroundColor: theme.palette.mode === "dark" 
                        ? "#1e293b" 
                        : "#ffffff",
                      "&:hover": {
                        backgroundColor: theme.palette.mode === "dark" 
                          ? "#2d3748" 
                          : "#f8fafc",
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {user.full_name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{user.email}</Typography>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography variant="body2">
                          {user.phone || "N/A"}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip
                        label={user.is_active ? "ACTIVE" : "INACTIVE"}
                        color={getStatusColor(user.is_active)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.is_admin ? "ADMIN" : "CUSTOMER"}
                        color={getRoleColor(user.is_admin)}
                        size="small"
                      />
                    </TableCell>
                    {!isTablet && (
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(user.created_at).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="View Details">
                          <IconButton
                            color="info"
                            onClick={() => handleViewUser(user)}
                            size="small"
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Toggle Status">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={user.is_active}
                                onChange={(e) =>
                                  handleToggleStatus(user.id, e.target.checked)
                                }
                                size="small"
                                color="success"
                              />
                            }
                            label=""
                          />
                        </Tooltip>
                        <Tooltip title="Toggle Admin">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={user.is_admin}
                                onChange={() =>
                                  handleToggleAdmin(user.id, user.is_admin)
                                }
                                size="small"
                                color="secondary"
                              />
                            }
                            label=""
                          />
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
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc",
          }}
        />
      </TableContainer>

      {/* User Details Dialog */}
      <Dialog
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ 
          color: theme.palette.mode === "dark" ? COLORS.offWhite : COLORS.deepNavy,
          backgroundColor: theme.palette.mode === "dark" ? COLORS.deepNavy : "#f8fafc",
        }}>
          User Details
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Card
                sx={{
                  marginBottom: 2,
                  background: theme.palette.mode === "dark" 
                    ? "linear-gradient(135deg, #1e293b, #2d3748)" 
                    : "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      marginRight: 2,
                      backgroundColor: COLORS.deepNavy,
                    }}
                  >
                    <Person sx={{ fontSize: 32, color: COLORS.offWhite }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ color: COLORS.deepNavy, fontWeight: "bold" }}
                    >
                      {selectedUser.full_name || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ color: COLORS.silver, mt: 0.5 }}>
                      {selectedUser.email}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={selectedUser.is_active ? "ACTIVE" : "INACTIVE"}
                        color={getStatusColor(selectedUser.is_active)}
                        size="small"
                      />
                      <Chip
                        label={selectedUser.is_admin ? "ADMIN" : "CUSTOMER"}
                        color={getRoleColor(selectedUser.is_admin)}
                        size="small"
                      />
                    </Stack>
                  </Box>
                </Box>
              </Card>

              <Card sx={{ p: 2, backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff" }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.mode === "dark" ? COLORS.offWhite : COLORS.deepNavy }}>
                  Complete User Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      User ID:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {selectedUser.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Username:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {selectedUser.username || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Full Name:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {selectedUser.full_name || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Email Address:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {selectedUser.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Phone Number:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {selectedUser.phone || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Account Status:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={selectedUser.is_active ? "ACTIVE" : "INACTIVE"}
                        color={getStatusColor(selectedUser.is_active)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      User Role:
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={
                          selectedUser.is_admin ? "ADMINISTRATOR" : "CUSTOMER"
                        }
                        color={getRoleColor(selectedUser.is_admin)}
                        size="small"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Admin Privileges:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {selectedUser.is_admin ? "✅ Yes" : "❌ No"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Account Created:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {new Date(selectedUser.created_at).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Registration Date:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Registration Time:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {new Date(selectedUser.created_at).toLocaleTimeString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Account Age:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
                      {calculateAccountAge(selectedUser.created_at)} days
                    </Typography>
                  </Grid>
                </Grid>

                {selectedUser.hashed_password && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: theme.palette.mode === "dark" ? "#2d3748" : "#f8f9fa",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: COLORS.deepNavy }}>
                      Security Information:
                    </Typography>
                    <Typography variant="caption" sx={{ color: theme.palette.mode === "dark" ? COLORS.offWhite : COLORS.silver }}>
                      Password Hash:{" "}
                      {selectedUser.hashed_password.substring(0, 20)}...
                    </Typography>
                  </Box>
                )}
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc" }}>
          <Button onClick={() => setIsModalVisible(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#ffffff",
          },
        }}
      >
        <DialogTitle sx={{ color: theme.palette.mode === "dark" ? COLORS.offWhite : COLORS.deepNavy }}>
          Confirm Change
        </DialogTitle>
        <DialogContent>
          {userToUpdate && (
            <Typography sx={{ color: theme.palette.mode === "dark" ? COLORS.offWhite : "inherit" }}>
              Are you sure you want to{" "}
              {userToUpdate.field === "is_admin"
                ? `${userToUpdate.value ? "grant" : "remove"} admin privileges`
                : `set user to ${userToUpdate.value ? "active" : "inactive"}`}
              ?
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: theme.palette.mode === "dark" ? "#1e293b" : "#f8fafc" }}>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button color="primary" variant="contained" onClick={confirmUpdate}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;