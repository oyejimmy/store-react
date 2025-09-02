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

const tableHeadingColor = {
  backgroundColor: "#2c6e49",
  color: "#ffffff",
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

  const handleToggleStatus = (userId: number, active: boolean) => {
    setUserToUpdate({ id: userId, field: "is_active", value: active });
    setConfirmDialogOpen(true);
  };

  const handleToggleAdmin = (userId: number, currentAdminStatus: boolean) => {
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
          User Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          disabled={loading}
          size={isMobile ? "small" : "medium"}
          sx={{
            borderColor: "#2c6e49",
            color: "black",
            backgroundColor: "white",
            "&:hover": {
              borderColor: "#2c6e49",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ overflowX: "auto", borderRadius: 2, boxShadow: 3 }}
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
                  <TableRow key={user.id} hover>
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
        />
      </TableContainer>

      {/* User Details Dialog */}
      <Dialog
        open={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Card
                sx={{
                  marginBottom: 2,
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      marginRight: 2,
                      backgroundColor: "#d4af37",
                    }}
                  >
                    <Person sx={{ fontSize: 32 }} />
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ color: "#d4af37", fontWeight: "bold" }}
                    >
                      {selectedUser.full_name || "N/A"}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#666", mt: 0.5 }}>
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

              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Complete User Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      User ID:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedUser.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Username:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedUser.username || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Full Name:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedUser.full_name || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Email Address:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedUser.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Phone Number:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedUser.phone || "N/A"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
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
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
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
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Admin Privileges:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {selectedUser.is_admin ? "✅ Yes" : "❌ No"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Account Created:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {new Date(selectedUser.created_at).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Registration Date:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Registration Time:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {new Date(selectedUser.created_at).toLocaleTimeString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Account Age:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {calculateAccountAge(selectedUser.created_at)} days
                    </Typography>
                  </Grid>
                </Grid>

                {selectedUser.hashed_password && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      backgroundColor: "#f8f9fa",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: "#d4af37" }}>
                      Security Information:
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#666" }}>
                      Password Hash:{" "}
                      {selectedUser.hashed_password.substring(0, 20)}...
                    </Typography>
                  </Box>
                )}
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalVisible(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Change</DialogTitle>
        <DialogContent>
          {userToUpdate && (
            <Typography>
              Are you sure you want to{" "}
              {userToUpdate.field === "is_admin"
                ? `${userToUpdate.value ? "grant" : "remove"} admin privileges`
                : `set user to ${userToUpdate.value ? "active" : "inactive"}`}
              ?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
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
