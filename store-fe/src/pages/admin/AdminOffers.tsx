import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
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
  Tooltip,
  useMediaQuery,
  useTheme,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Image as ImageIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

interface Offer {
  id: number;
  title: string;
  type: string;
  discount: number;
  validFrom: string;
  validUntil: string;
  status: string;
  description?: string;
}

const tableHeadingColor = {
  backgroundColor: "#2c6e49",
  color: "#ffffff",
  fontWeight: 600,
};

const AdminOffers: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerToDelete, setOfferToDelete] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    discount: 0,
    validFrom: null as Date | null,
    validUntil: null as Date | null,
    description: "",
  });

  const [errors, setErrors] = useState<any>({});

  // Mock data
  const offers: Offer[] = [
    {
      id: 1,
      title: "Under 299 Sale",
      type: "under-299",
      discount: 20,
      validFrom: "2024-01-01",
      validUntil: "2024-01-31",
      status: "active",
    },
    {
      id: 2,
      title: "Special Deals",
      type: "special-deals",
      discount: 15,
      validFrom: "2024-01-15",
      validUntil: "2024-02-15",
      status: "active",
    },
  ];

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.title.trim()) newErrors.title = "Offer title is required";
    if (!formData.type) newErrors.type = "Offer type is required";
    if (formData.discount <= 0 || formData.discount > 100)
      newErrors.discount = "Discount must be between 1 and 100";
    if (!formData.validFrom) newErrors.validFrom = "Start date is required";
    if (!formData.validUntil) newErrors.validUntil = "End date is required";
    if (
      formData.validFrom &&
      formData.validUntil &&
      formData.validFrom > formData.validUntil
    )
      newErrors.validUntil = "End date must be after start date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdd = () => {
    setEditingOffer(null);
    setFormData({
      title: "",
      type: "",
      discount: 0,
      validFrom: null,
      validUntil: null,
      description: "",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      type: offer.type,
      discount: offer.discount,
      validFrom: new Date(offer.validFrom),
      validUntil: new Date(offer.validUntil),
      description: offer.description || "",
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setOfferToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!offerToDelete) return;

    // Here you would call your API to delete the offer
    console.log("Deleting offer:", offerToDelete);
    setDeleteDialogOpen(false);
    setOfferToDelete(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      // Here you would call your API to save the offer
      console.log("Saving offer:", formData);

      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Failed to save offer:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    setFormData({ ...formData, [field]: date });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
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

  const getStatusColor = (status: string) => {
    return status === "active" ? "success" : "error";
  };

  const getTypeLabel = (type: string) => {
    return type.replace(/-/g, " ").toUpperCase();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          p: { xs: 1, sm: 2, md: 3 },
          minHeight: "100vh",
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
            Offer Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
            size={isMobile ? "small" : "medium"}
            sx={{
             borderColor: "#2c6e49",
              color: "#2c6e49",
              backgroundColor: "rgb(224, 220, 220)",
              "&:hover": {
                borderColor: "#2c6e49",
                backgroundColor: "rgb(230, 232, 210)",
              },
            }}
          >
            Add Offer
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ overflowX: "auto", borderRadius: 2, boxShadow: 3 }}
        >
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeadingColor}>Product Title</TableCell>
                <TableCell sx={tableHeadingColor}>Type</TableCell>
                <TableCell sx={tableHeadingColor}>Discount</TableCell>
                {!isMobile && (
                  <TableCell sx={tableHeadingColor}>Valid From</TableCell>
                )}
                {!isTablet && (
                  <TableCell sx={tableHeadingColor}>Valid Until</TableCell>
                )}
                <TableCell sx={tableHeadingColor}>Status</TableCell>
                <TableCell sx={tableHeadingColor}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {offers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((offer) => (
                  <TableRow key={offer.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {offer.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getTypeLabel(offer.type)}
                        color="primary"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{offer.discount}%</Typography>
                    </TableCell>
                    {!isMobile && (
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(offer.validFrom).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    )}
                    {!isTablet && (
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(offer.validUntil).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip
                        label={offer.status.toUpperCase()}
                        color={getStatusColor(offer.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        <Tooltip title="Edit Offer">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(offer)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Offer">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(offer.id)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={offers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Add/Edit Offer Dialog */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>{editingOffer ? "Edit Offer" : "Add Offer"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Offer Title"
                  value={formData.title}
                  onChange={handleChange("title")}
                  error={!!errors.title}
                  helperText={errors.title}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!errors.type} required>
                  <InputLabel>Offer Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleChange("type")}
                    label="Offer Type"
                  >
                    <MenuItem value="under-299">Under 299</MenuItem>
                    <MenuItem value="special-deals">Special Deals</MenuItem>
                    <MenuItem value="deal-of-month">Deal of the Month</MenuItem>
                  </Select>
                  {errors.type && (
                    <Typography variant="caption" color="error">
                      {errors.type}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Discount Percentage"
                  type="number"
                  value={formData.discount}
                  onChange={handleChange("discount")}
                  error={!!errors.discount}
                  helperText={errors.discount}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                    inputProps: { min: 0, max: 100 },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Valid From"
                  value={formData.validFrom}
                  onChange={handleDateChange("validFrom")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.validFrom,
                      helperText: errors.validFrom,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Valid Until"
                  value={formData.validUntil}
                  onChange={handleDateChange("validUntil")}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.validUntil,
                      helperText: errors.validUntil,
                      required: true,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={handleChange("description")}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? "Saving..." : editingOffer ? "Update" : "Add"} Offer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Offer</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this offer? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button color="error" variant="contained" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default AdminOffers;
