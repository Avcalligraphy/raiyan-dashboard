// React Imports
import { useEffect, useState } from "react";

// MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

// Third-party Imports
import PerfectScrollbar from "react-perfect-scrollbar";
import { useForm, Controller } from "react-hook-form";

// Type Imports
import type { User, Role } from "@/types/userTypes";
import type { UpdateUserPayload, RegisterUserPayload } from "@/types/userTypes";
import { userService, roleService } from "@/services/userService";

type Props = {
  open: boolean;
  handleClose: () => void;
  user: User | null;
  onSuccess?: () => void;
};

type EditFormValues = {
  full_name: string;
  email: string;
  role_id: string;
  is_active: boolean;
};

type AddFormValues = {
  full_name: string;
  email: string;
  password: string;
  role_id: string;
};

const defaultEditValues: EditFormValues = {
  full_name: "",
  email: "",
  role_id: "",
  is_active: true,
};

const defaultAddValues: AddFormValues = {
  full_name: "",
  email: "",
  password: "",
  role_id: "",
};

const AddUserDrawer = (props: Props) => {
  const { open, handleClose, user, onSuccess } = props;

  const isEditMode = !!user;

  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const editForm = useForm<EditFormValues>({ defaultValues: defaultEditValues });
  const addForm = useForm<AddFormValues>({ defaultValues: defaultAddValues });

  const control = isEditMode ? editForm.control : addForm.control;
  const errors = isEditMode ? editForm.formState.errors : addForm.formState.errors;
  const resetForm = isEditMode ? editForm.reset : addForm.reset;

  useEffect(() => {
    if (open) {
      setSubmitError(null);
      setLoadingRoles(true);
      roleService
        .list()
        .then(setRoles)
        .catch(() => setRoles([]))
        .finally(() => setLoadingRoles(false));
    }
  }, [open]);

  useEffect(() => {
    if (open && user) {
      editForm.reset({
        full_name: user.full_name,
        email: user.email,
        role_id: user.role_id ?? "",
        is_active: user.is_active,
      });
    } else if (open && !user) {
      editForm.reset(defaultEditValues);
      addForm.reset(defaultAddValues);
    }
  }, [open, user, editForm, addForm]);

  const onSubmitEdit = async (data: EditFormValues) => {
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      await userService.update(user!.id, {
        full_name: data.full_name.trim(),
        email: data.email.trim(),
        role_id: data.role_id || null,
        is_active: data.is_active,
      });
      handleClose();
      onSuccess?.();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const onSubmitAdd = async (data: AddFormValues) => {
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      await userService.register({
        full_name: data.full_name.trim(),
        email: data.email.trim(),
        password: data.password,
        role_id: data.role_id || null,
      });
      handleClose();
      onSuccess?.();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Create user failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    handleClose();
    editForm.reset(defaultEditValues);
    addForm.reset(defaultAddValues);
    setSubmitError(null);
  };

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
          {isEditMode ? "Edit User" : "Add User"}
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
            onSubmit={
              isEditMode
                ? editForm.handleSubmit(onSubmitEdit)
                : addForm.handleSubmit(onSubmitAdd)
            }
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {submitError && (
              <Alert severity="error">{submitError}</Alert>
            )}

            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              User Information
            </Typography>

            <Controller
              name="full_name"
              control={control}
              rules={{ required: "Full name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name"
                  placeholder="Admin User"
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="email"
                  label="Email"
                  placeholder="user@example.com"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={isEditMode}
                />
              )}
            />

            {!isEditMode && (
              <Controller
                name="password"
                control={addForm.control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "At least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    error={!!addForm.formState.errors.password}
                    helperText={addForm.formState.errors.password?.message}
                  />
                )}
              />
            )}

            <FormControl fullWidth error={!!errors.role_id} disabled={loadingRoles}>
              <InputLabel id="user-role-label">Role</InputLabel>
              <Controller
                name="role_id"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Role"
                    labelId="user-role-label"
                    value={field.value ?? ""}
                  >
                    <MenuItem value="">No role</MenuItem>
                    {roles.map((r) => (
                      <MenuItem key={r.id} value={r.id}>
                        {r.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            {isEditMode && (
              <Controller
                name="is_active"
                control={editForm.control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(_, v) => field.onChange(v)}
                      />
                    }
                    label="Active"
                  />
                )}
              />
            )}

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
                disabled={submitLoading}
                startIcon={
                  submitLoading ? <CircularProgress size={16} /> : null
                }
              >
                {isEditMode ? "Update" : "Add"} User
              </Button>
              <Button
                variant="outlined"
                color="error"
                type="button"
                onClick={handleReset}
                disabled={submitLoading}
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

export default AddUserDrawer;
