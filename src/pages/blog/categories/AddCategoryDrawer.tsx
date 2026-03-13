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
import type { BlogCategory } from "@/services/blogCategoryService";

// Hooks Imports
import { useCreateBlogCategory, useUpdateBlogCategory } from "@/hooks/useBlogCategories";

type Props = {
  open: boolean;
  handleClose: () => void;
  category?: BlogCategory | null; // For edit mode
};

type CategoryFormData = {
  name: string;
  slug: string;
};

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const AddCategoryDrawer = (props: Props) => {
  // Props
  const { open, handleClose, category } = props;

  const isEditMode = !!category;

  // Hooks
  const createCategory = useCreateBlogCategory();
  const updateCategory = useUpdateBlogCategory();

  const {
    control,
    reset: resetForm,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  // Watch name to auto-generate slug
  const nameValue = watch("name");

  useEffect(() => {
    if (!isEditMode && nameValue) {
      const autoSlug = generateSlug(nameValue);
      setValue("slug", autoSlug);
    }
  }, [nameValue, isEditMode, setValue]);

  // Reset form when category changes (for edit mode)
  useEffect(() => {
    if (category) {
      resetForm({
        name: category.name,
        slug: category.slug,
      });
    } else {
      resetForm({
        name: "",
        slug: "",
      });
    }
  }, [category, resetForm]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditMode && category) {
        await updateCategory.mutateAsync({
          id: category.id,
          data,
        });
      } else {
        await createCategory.mutateAsync(data);
      }
      handleClose();
      resetForm({
        name: "",
        slug: "",
      });
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const handleReset = () => {
    handleClose();
    resetForm({
      name: "",
      slug: "",
    });
  };

  const isLoading = createCategory.isPending || updateCategory.isPending;
  const error = createCategory.error || updateCategory.error;

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
          {isEditMode ? "Edit Category" : "Add Category"}
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
                {error instanceof Error
                  ? error.message
                  : "Failed to save category"}
              </Alert>
            )}

            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              Category Information
            </Typography>

            <Controller
              name="name"
              control={control}
              rules={{ required: "Category name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Category Name"
                  placeholder="Tips Umrah"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />

            <Controller
              name="slug"
              control={control}
              rules={{
                required: "Slug is required",
                pattern: {
                  value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                  message:
                    "Slug must be lowercase letters, numbers, and hyphens only",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Slug"
                  placeholder="tips-umrah"
                  error={!!errors.slug}
                  helperText={
                    errors.slug?.message ||
                    "URL-friendly identifier (auto-generated from name)"
                  }
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
                {isEditMode ? "Update" : "Add"} Category
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

export default AddCategoryDrawer;
