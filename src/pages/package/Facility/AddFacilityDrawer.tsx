// React Imports
import { useEffect } from "react";

// MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";
import { useForm, Controller } from "react-hook-form";

// Types Imports
import type { Facility } from "@/services/facilityService";

// Hooks Imports
import { useCreateFacility, useUpdateFacility } from "@/hooks/useFacilities";

type Props = {
  open: boolean;
  handleClose: () => void;
  facility?: Facility | null; // For edit mode
};

type FacilityFormData = {
  name: string;
  description: string;
};

const AddFacilityDrawer = (props: Props) => {
  // Props
  const { open, handleClose, facility } = props;

  const isEditMode = !!facility;

  // Hooks
  const createFacility = useCreateFacility();
  const updateFacility = useUpdateFacility();

  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<FacilityFormData>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Reset form when facility changes (for edit mode)
  useEffect(() => {
    if (facility) {
      resetForm({
        name: facility.name,
        description: facility.description,
      });
    } else {
      resetForm({
        name: "",
        description: "",
      });
    }
  }, [facility, resetForm]);

  const onSubmit = async (data: FacilityFormData) => {
    try {
      if (isEditMode && facility) {
        await updateFacility.mutateAsync({
          id: facility.id,
          data,
        });
      } else {
        await createFacility.mutateAsync(data);
      }
      handleClose();
      resetForm({
        name: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to save facility:", error);
    }
  };

  const handleReset = () => {
    handleClose();
    resetForm({
      name: "",
      description: "",
    });
  };

  const isLoading = createFacility.isPending || updateFacility.isPending;
  const error = createFacility.error || updateFacility.error;

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
          {isEditMode ? "Edit Facility" : "Add Facility"}
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
                {error instanceof Error ? error.message : "Failed to save facility"}
              </Alert>
            )}

            <Typography
              color="text.primary"
              sx={{ fontWeight: 500 }}
            >
              Facility Information
            </Typography>

            <Controller
              name="name"
              control={control}
              rules={{ required: "Facility name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Facility Name"
                  placeholder="Visa"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Description"
                  placeholder="Visa umrah included"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
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
                {isEditMode ? "Update" : "Add"} Facility
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

export default AddFacilityDrawer;
