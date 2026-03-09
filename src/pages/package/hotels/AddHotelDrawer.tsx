// React Imports
import { useEffect } from "react";

// MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import FormHelperText from "@mui/material/FormHelperText";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";
import { useForm, Controller } from "react-hook-form";

// Types Imports
import type { Hotel } from "@/services/hotelService";

// Hooks Imports
import { useCreateHotel, useUpdateHotel } from "@/hooks/useHotels";

type Props = {
  open: boolean;
  handleClose: () => void;
  hotel?: Hotel | null; // For edit mode
};

type HotelFormData = {
  name: string;
  city: string;
  star_rating: number;
  address: string;
};

// Common city options for autocomplete
const cityOptions = ["Makkah", "Madinah"];

const AddHotelDrawer = (props: Props) => {
  // Props
  const { open, handleClose, hotel } = props;

  const isEditMode = !!hotel;

  // Hooks
  const createHotel = useCreateHotel();
  const updateHotel = useUpdateHotel();

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<HotelFormData>({
    defaultValues: {
      name: "",
      city: "Makkah",
      star_rating: 3,
      address: "",
    },
  });

  // Reset form when hotel changes (for edit mode)
  useEffect(() => {
    if (hotel) {
      resetForm({
        name: hotel.name,
        city: hotel.city,
        star_rating: hotel.star_rating,
        address: hotel.address,
      });
    } else {
      resetForm({
        name: "",
        city: "Makkah",
        star_rating: 3,
        address: "",
      });
    }
  }, [hotel, resetForm]);

  const onSubmit = async (data: HotelFormData) => {
    try {
      if (isEditMode && hotel) {
        await updateHotel.mutateAsync({
          id: hotel.id,
          data,
        });
      } else {
        await createHotel.mutateAsync(data);
      }
      handleClose();
      resetForm({
        name: "",
        city: "Makkah",
        star_rating: 3,
        address: "",
      });
    } catch (error) {
      console.error("Failed to save hotel:", error);
    }
  };

  const handleReset = () => {
    handleClose();
    resetForm({
      name: "",
      city: "Makkah",
      star_rating: 3,
      address: "",
    });
  };

  const isLoading = createHotel.isPending || updateHotel.isPending;
  const error = createHotel.error || updateHotel.error;

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleReset}
      ModalProps={{ keepMounted: true }}
      sx={{ "& .MuiDrawer-paper": { width: { xs: 300, sm: 400 } } }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 5,
        }}
      >
        <Typography variant="h5">
          {isEditMode ? "Edit Hotel" : "Add Hotel"}
        </Typography>
        <IconButton size="small" onClick={handleReset}>
          <i className="ri-close-line" style={{ fontSize: "1.5rem" }} />
        </IconButton>
      </Box>
      <Divider />
      <PerfectScrollbar
        options={{ wheelPropagation: false, suppressScrollX: true }}
      >
        <Box sx={{ p: 5 }}>
          <Box
            component="form"
            onSubmit={handleSubmit((data) => onSubmit(data))}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {error && (
              <Alert severity="error">
                {error instanceof Error ? error.message : "Failed to save hotel"}
              </Alert>
            )}

            <Typography
              color="text.primary"
              sx={{ fontWeight: 500 }}
            >
              Hotel Information
            </Typography>

            <Controller
              name="name"
              control={control}
              rules={{ required: "Hotel name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Hotel Name"
                  placeholder="Hotel Makkah Royal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="city"
              control={control}
              rules={{ required: "City is required" }}
              render={({ field: { onChange, value, ...field } }) => (
                <Autocomplete
                  {...field}
                  freeSolo
                  options={cityOptions}
                  value={value || ""}
                  onChange={(_, newValue) => {
                    onChange(newValue || "");
                  }}
                  onInputChange={(_, newInputValue) => {
                    onChange(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City*"
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      placeholder="Type or select a city"
                    />
                  )}
                />
              )}
            />

            <FormControl fullWidth error={!!errors.star_rating}>
              <InputLabel id="star_rating">Star Rating*</InputLabel>
              <Controller
                name="star_rating"
                control={control}
                rules={{
                  required: "Star rating is required",
                  min: { value: 1, message: "Minimum 1 star" },
                  max: { value: 5, message: "Maximum 5 stars" },
                }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Star Rating*"
                    labelId="star_rating"
                    value={field.value || 3}
                  >
                    <MenuItem value={1}>1 Star</MenuItem>
                    <MenuItem value={2}>2 Stars</MenuItem>
                    <MenuItem value={3}>3 Stars</MenuItem>
                    <MenuItem value={4}>4 Stars</MenuItem>
                    <MenuItem value={5}>5 Stars</MenuItem>
                  </Select>
                )}
              />
              {errors.star_rating && (
                <FormHelperText>{errors.star_rating.message}</FormHelperText>
              )}
            </FormControl>

            <Controller
              name="address"
              control={control}
              rules={{ required: "Address is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Address"
                  placeholder="Jalan Ibrahim, Makkah"
                  multiline
                  rows={3}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Button
                variant="contained"
                type="submit"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={16} /> : null}
              >
                {isEditMode ? "Update" : "Add"} Hotel
              </Button>
              <Button
                variant="outlined"
                color="error"
                type="reset"
                onClick={handleReset}
                disabled={isLoading}
              >
                Discard
              </Button>
            </Box>
          </Box>
        </Box>
      </PerfectScrollbar>
    </Drawer>
  );
};

export default AddHotelDrawer;
