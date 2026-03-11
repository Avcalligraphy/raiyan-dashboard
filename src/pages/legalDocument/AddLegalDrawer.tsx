// React Imports
import { useState, useEffect } from "react";

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
import { useDropzone } from "react-dropzone";

// Type Imports
import type {
  LegalDocument,
  LegalDocumentType,
  CreateLegalDocumentPayload,
} from "@/types/legalDocumentTypes";
import { legalDocumentService } from "@/services/legalDocumentService";
import { getApiUrl } from "@/services/apiClient";

type Props = {
  open: boolean;
  handleClose: () => void;
  document: LegalDocument | null;
};

type FormValues = {
  document_name: string;
  document_number: string;
  document_type: LegalDocumentType;
  issued_date: string;
  is_active: boolean;
};

const DOCUMENT_TYPES: { value: LegalDocumentType; label: string }[] = [
  { value: "PPIU", label: "PPIU" },
  { value: "Kemenag", label: "Kemenag" },
];

const defaultValues: FormValues = {
  document_name: "",
  document_number: "",
  document_type: "PPIU",
  issued_date: "",
  is_active: true,
};

const AddLegalDrawer = (props: Props) => {
  const { open, handleClose, document } = props;

  const isEditMode = !!document;

  const [fileUrl, setFileUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    watch,
    reset: resetForm,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues });

  const documentType = watch("document_type");

  // Reset form when drawer opens or document changes (edit mode)
  useEffect(() => {
    if (open) {
      if (document) {
        resetForm({
          document_name: document.document_name,
          document_number: document.document_number,
          document_type: document.document_type,
          issued_date: document.issued_date
            ? document.issued_date.slice(0, 10)
            : "",
          is_active: document.is_active,
        });
        setFileUrl(document.file_url?.trim() ?? "");
      } else {
        resetForm(defaultValues);
        setFileUrl("");
      }
      setUploadError(null);
      setSubmitError(null);
    }
  }, [open, document, resetForm]);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const subdir = (document?.document_type ?? documentType ?? "misc")
        .toString()
        .toLowerCase();
      const { file_url } = await legalDocumentService.upload(file, subdir);
      setFileUrl(file_url);
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/jpg": [".jpg"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
    disabled: uploading,
  });

  const onSubmit = async (data: FormValues) => {
    setSubmitError(null);
    setSubmitLoading(true);
    try {
      const payload: CreateLegalDocumentPayload = {
        document_name: data.document_name.trim(),
        document_number: data.document_number.trim(),
        document_type: data.document_type,
        is_active: data.is_active,
      };
      if (fileUrl.trim()) payload.file_url = fileUrl.trim();
      if (data.issued_date.trim()) payload.issued_date = data.issued_date.trim();

      if (isEditMode && document) {
        await legalDocumentService.update(document.id, payload);
      } else {
        await legalDocumentService.create(payload);
      }
      handleClose();
      resetForm(defaultValues);
      setFileUrl("");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleReset = () => {
    handleClose();
    resetForm(defaultValues);
    setFileUrl("");
    setUploadError(null);
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
          {isEditMode ? "Edit Legal Document" : "Add Legal Document"}
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
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 5,
            }}
          >
            {submitError && (
              <Alert severity="error">
                {submitError}
              </Alert>
            )}

            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              Document Information
            </Typography>

            <Controller
              name="document_name"
              control={control}
              rules={{ required: "Document name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Document Name"
                  placeholder="e.g. Izin PPIU"
                  error={!!errors.document_name}
                  helperText={errors.document_name?.message}
                />
              )}
            />

            <Controller
              name="document_number"
              control={control}
              rules={{ required: "Document number is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Document Number"
                  placeholder="e.g. 123/PPIU/2025"
                  error={!!errors.document_number}
                  helperText={errors.document_number?.message}
                />
              )}
            />

            <FormControl fullWidth error={!!errors.document_type}>
              <InputLabel id="document_type">Document Type*</InputLabel>
              <Controller
                name="document_type"
                control={control}
                rules={{ required: "Document type is required" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Document Type*"
                    labelId="document_type"
                  >
                    {DOCUMENT_TYPES.map((t) => (
                      <MenuItem key={t.value} value={t.value}>
                        {t.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                File (PDF or JPG, max 10 MB)
              </Typography>
              <Box
                {...getRootProps()}
                sx={{
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 4,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <input {...getInputProps()} />
                {uploading ? (
                  <CircularProgress size={32} />
                ) : (
                  <Typography variant="body2">
                    {isDragActive
                      ? "Drop the file here"
                      : "Drag & drop or click to select"}
                  </Typography>
                )}
              </Box>
              {uploadError && (
                <Typography
                  color="error"
                  variant="caption"
                  component="span"
                  sx={{ display: "block", mt: 1 }}
                >
                  {uploadError}
                </Typography>
              )}
              {fileUrl ? (
                <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
                  <Button
                    component="a"
                    href={
                      fileUrl.startsWith("http")
                        ? fileUrl
                        : `${getApiUrl()}${fileUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                    color="primary"
                  >
                    View current file
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => setFileUrl("")}
                  >
                    Clear
                  </Button>
                </Box>
              ) : null}
            </Box>

            <Controller
              name="issued_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="date"
                  label="Issued Date"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />

            <Controller
              name="is_active"
              control={control}
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
                {isEditMode ? "Update" : "Add"} Document
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

export default AddLegalDrawer;
