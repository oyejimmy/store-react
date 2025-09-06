import React, { useState, useEffect } from "react";
import {
  Box,
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Snackbar,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Upload,
  Visibility,
  Image as ImageIcon,
  Category,
  Inventory,
} from "@mui/icons-material";
import { adminAPI } from "../../../services/api";

interface Collection {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  image?: string;
  total_products: number;
  conditions?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

const tableHeadingColor = {
  backgroundColor: "#1E1B4B",
  color: "#ffffff",
  fontWeight: 600,
};

const AdminCollections: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const [viewingCollection, setViewingCollection] = useState<Collection | null>(
    null
  );
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<number | null>(
    null
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "",
    conditions: "",
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getAllCollections();
      setCollections(data);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
      showSnackbar("Failed to fetch collections");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.name.trim()) newErrors.name = "Collection name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    setEditingCollection(null);
    setFormData({
      name: "",
      description: "",
      icon: "",
      conditions: "",
    });
    setSelectedImageFile(null);
    setImagePreview(null);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name || "",
      description: collection.description || "",
      icon: collection.icon || "",
      conditions: collection.conditions || "",
    });
    setSelectedImageFile(null);
    setImagePreview(
      collection.image ? getImageUrl(collection.image) || null : null
    );
    setErrors({});
    setIsModalOpen(true);
  };

  const handleView = (collection: Collection) => {
    setViewingCollection(collection);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setCollectionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!collectionToDelete) return;

    try {
      await adminAPI.deleteCollection(collectionToDelete);
      showSnackbar("Collection deleted successfully");
      fetchCollections();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to delete collection";
      showSnackbar(errorMessage);
    } finally {
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsUploading(true);
      const collectionData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon.trim() || null,
        conditions: formData.conditions.trim() || null,
      };

      let savedCollection;
      if (editingCollection) {
        savedCollection = await adminAPI.updateCollection(
          editingCollection.id,
          collectionData
        );
      } else {
        savedCollection = await adminAPI.createCollection(collectionData);
      }

      // Upload image if selected
      if (selectedImageFile && savedCollection) {
        await adminAPI.uploadCollectionImage(
          savedCollection.id,
          selectedImageFile
        );
      }

      showSnackbar(
        editingCollection
          ? "Collection updated successfully"
          : "Collection added successfully"
      );
      setIsModalOpen(false);
      fetchCollections();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail || "Failed to save collection";
      showSnackbar(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        showSnackbar("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        showSnackbar("File size must be less than 5MB");
        return;
      }

      setSelectedImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageFile(null);
    setImagePreview(null);
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

  const getConditionsColor = (conditions: string | undefined) => {
    if (!conditions) return "default";
    const lowerConditions = conditions.toLowerCase();
    if (lowerConditions.includes("new")) return "success";
    if (lowerConditions.includes("used")) return "warning";
    if (lowerConditions.includes("refurbished")) return "info";
    return "default";
  };

  const getImageUrl = (imagePath: string | undefined): string | undefined => {
    if (!imagePath) return undefined;
    const baseUrl =
      process.env.REACT_APP_API_URL?.replace("/api", "") ||
      "http://localhost:8000";
    return `${baseUrl}/static/${imagePath}`;
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
      }}
    >
      {/* Header with Add Button */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          p: 3,
          background: "#1E1B4B",
          borderRadius: 3,
          boxShadow: "0 8px 32px rgba(30, 27, 75, 0.2)",
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
          Collections Management
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchCollections}
            disabled={loading}
            size={isMobile ? "small" : "medium"}
            sx={{
              borderColor: "#94A3B8",
              color: "#94A3B8",
              backgroundColor: "#F8FAFC",
              "&:hover": {
                borderColor: "#1E1B4B",
                backgroundColor: "#E2E8F0",
              },
            }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            size={isMobile ? "small" : "medium"}
            sx={{
              backgroundColor: "#1E1B4B",
              "&:hover": {
                backgroundColor: "#2D2A6B",
              },
            }}
          >
            Add Collection
          </Button>
        </Box>
      </Box>

      {collections.length === 0 && !loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "300px",
            backgroundColor: "#F8FAFC",
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            color="#94A3B8"
            sx={{ textAlign: "center" }}
          >
            This product is currently out of stock or not available
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ overflowX: "auto", borderRadius: 2, boxShadow: 3 }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeadingColor}>Image</TableCell>
                <TableCell sx={tableHeadingColor}>Name</TableCell>
                {!isMobile && (
                  <TableCell sx={tableHeadingColor}>Description</TableCell>
                )}
                <TableCell sx={tableHeadingColor}>Products</TableCell>
                {!isTablet && (
                  <TableCell sx={tableHeadingColor}>Conditions</TableCell>
                )}
                <TableCell sx={tableHeadingColor}>Status</TableCell>
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
                collections
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((collection) => (
                    <TableRow key={collection.id} hover>
                      <TableCell>
                        <Avatar
                          src={getImageUrl(collection.image)}
                          sx={{ width: 40, height: 40 }}
                        >
                          {!collection.image && <Category />}
                        </Avatar>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {collection.name}
                        </Typography>
                        {collection.icon && (
                          <Typography variant="caption" color="#94A3B8">
                            {collection.icon}
                          </Typography>
                        )}
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {collection.description || "No description"}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <Chip
                          icon={<Inventory />}
                          label={`${collection.total_products}`}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      {!isTablet && (
                        <TableCell>
                          {collection.conditions ? (
                            <Chip
                              label={collection.conditions}
                              color={
                                getConditionsColor(collection.conditions) as any
                              }
                              size="small"
                            />
                          ) : (
                            <Typography variant="caption" color="#94A3B8">
                              Not specified
                            </Typography>
                          )}
                        </TableCell>
                      )}
                      <TableCell>
                        <Chip
                          label={collection.is_active ? "ACTIVE" : "INACTIVE"}
                          color={getStatusColor(collection.is_active)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.5}>
                          <Tooltip title="View Details">
                            <IconButton
                              color="info"
                              onClick={() => handleView(collection)}
                              size="small"
                            >
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Collection">
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(collection)}
                              size="small"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Collection">
                            <IconButton
                              color="error"
                              onClick={() => handleDelete(collection.id)}
                              size="small"
                            >
                              <Delete />
                            </IconButton>
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
            count={collections.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      {/* Add/Edit Collection Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCollection ? "Edit Collection" : "Add Collection"}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Collection Name"
                value={formData.name}
                onChange={handleChange("name")}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange("description")}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Icon (Emoji)"
                value={formData.icon}
                onChange={handleChange("icon")}
                placeholder="💍"
                helperText="Optional emoji icon"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Product Conditions</InputLabel>
                <Select
                  value={formData.conditions}
                  onChange={handleChange("conditions")}
                  label="Product Conditions"
                >
                  <MenuItem value="">Not specified</MenuItem>
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Used">Used</MenuItem>
                  <MenuItem value="Refurbished">Refurbished</MenuItem>
                  <MenuItem value="New & Used">New & Used</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Collection Image
                </Typography>
                {imagePreview && (
                  <Box sx={{ mb: 2, textAlign: "center" }}>
                    <Avatar
                      src={imagePreview}
                      sx={{ width: 120, height: 120, margin: "auto", mb: 1 }}
                    >
                      <ImageIcon />
                    </Avatar>
                    <Button
                      size="small"
                      color="error"
                      onClick={handleRemoveImage}
                      startIcon={<Delete />}
                    >
                      Remove Image
                    </Button>
                  </Box>
                )}
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image-upload-input"
                  type="file"
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload-input">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Upload />}
                    fullWidth
                    sx={{ py: 2, borderColor: "#94A3B8", color: "#94A3B8" }}
                  >
                    {selectedImageFile
                      ? "Change Image"
                      : "Upload Collection Image"}
                  </Button>
                </label>
                <Typography
                  variant="caption"
                  color="#94A3B8"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={20} /> : null}
            sx={{
              backgroundColor: "#1E1B4B",
              "&:hover": {
                backgroundColor: "#2D2A6B",
              },
            }}
          >
            {isUploading ? "Saving..." : editingCollection ? "Update" : "Add"}{" "}
            Collection
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Collection Dialog */}
      <Dialog
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Collection Details</DialogTitle>
        <DialogContent>
          {viewingCollection && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Avatar
                  src={getImageUrl(viewingCollection.image)}
                  sx={{ width: 80, height: 80, margin: "auto", mb: 2 }}
                >
                  {!viewingCollection.image && <Category />}
                </Avatar>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {viewingCollection.icon} {viewingCollection.name}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="#94A3B8" paragraph>
                  {viewingCollection.description || "No description provided"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Total Products:</Typography>
                <Chip
                  icon={<Inventory />}
                  label={viewingCollection.total_products}
                  color="primary"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Status:</Typography>
                <Chip
                  label={viewingCollection.is_active ? "Active" : "Inactive"}
                  color={getStatusColor(viewingCollection.is_active)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Conditions:</Typography>
                {viewingCollection.conditions ? (
                  <Chip
                    label={viewingCollection.conditions}
                    color={
                      getConditionsColor(viewingCollection.conditions) as any
                    }
                  />
                ) : (
                  <Typography variant="body2" color="#94A3B8">
                    Not specified
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="#94A3B8">
                  Created:{" "}
                  {new Date(viewingCollection.created_at).toLocaleDateString()}
                  {viewingCollection.updated_at && (
                    <>
                      {" "}
                      | Updated:{" "}
                      {new Date(
                        viewingCollection.updated_at
                      ).toLocaleDateString()}
                    </>
                  )}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
          {viewingCollection && (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => {
                setIsViewModalOpen(false);
                handleEdit(viewingCollection);
              }}
              sx={{
                backgroundColor: "#1E1B4B",
                "&:hover": {
                  backgroundColor: "#2D2A6B",
                },
              }}
            >
              Edit Collection
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Collection</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this collection? This action cannot
            be undone. Collections with active products cannot be deleted.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={confirmDelete}
            sx={{
              backgroundColor: "#1E1B4B",
              "&:hover": {
                backgroundColor: "#2D2A6B",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Custom Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box
          sx={{
            backgroundColor: "#1E1B4B",
            color: "white",
            padding: "12px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body1">{snackbarMessage}</Typography>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default AdminCollections;