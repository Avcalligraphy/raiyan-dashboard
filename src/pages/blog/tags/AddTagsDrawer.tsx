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
import type { BlogTag } from "@/services/blogTagService";

// Hooks Imports
import { useCreateBlogTag, useUpdateBlogTag } from "@/hooks/useBlogTags";

type Props = {
  open: boolean;
  handleClose: () => void;
  tag?: BlogTag | null; // For edit mode
};

type TagFormData = {
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

const AddTagsDrawer = (props: Props) => {
  // Props
  const { open, handleClose, tag } = props;

  const isEditMode = !!tag;

  // Hooks
  const createTag = useCreateBlogTag();
  const updateTag = useUpdateBlogTag();

  const {
    control,
    reset: resetForm,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TagFormData>({
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

  // Reset form when tag changes (for edit mode)
  useEffect(() => {
    if (tag) {
      resetForm({
        name: tag.name,
        slug: tag.slug,
      });
    } else {
      resetForm({
        name: "",
        slug: "",
      });
    }
  }, [tag, resetForm]);

  const onSubmit = async (data: TagFormData) => {
    try {
      if (isEditMode && tag) {
        await updateTag.mutateAsync({
          id: tag.id,
          data,
        });
      } else {
        await createTag.mutateAsync(data);
      }
      handleClose();
      resetForm({
        name: "",
        slug: "",
      });
    } catch (error) {
      console.error("Failed to save tag:", error);
    }
  };

  const handleReset = () => {
    handleClose();
    resetForm({
      name: "",
      slug: "",
    });
  };

  const isLoading = createTag.isPending || updateTag.isPending;
  const error = createTag.error || updateTag.error;

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
          {isEditMode ? "Edit Tag" : "Add Tag"}
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
                  : "Failed to save tag"}
              </Alert>
            )}

            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              Tag Information
            </Typography>

            <Controller
              name="name"
              control={control}
              rules={{ required: "Tag name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Tag Name"
                  placeholder="Umrah 2025"
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
                  placeholder="umrah-2025"
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
                {isEditMode ? "Update" : "Add"} Tag
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

export default AddTagsDrawer;
