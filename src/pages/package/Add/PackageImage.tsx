"use client";

// React Imports
import { useState, useCallback } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import type { BoxProps } from "@mui/material/Box";

// Third-party Imports
import { useDropzone } from "react-dropzone";

// Component Imports
import CustomAvatar from "@core/components/mui/Avatar";

// Service Imports
import { uploadFile } from "@/services/uploadService";
import { getApiUrl } from "@/services/apiClient";

// Styled Component Imports
import AppReactDropzone from "@/libs/styles/AppReactDropzone";

// Type Imports
import type { PackageFormState } from "@/types/packageTypes";

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  "& .dropzone": {
    minHeight: "unset",
    padding: theme.spacing(12),
    [theme.breakpoints.down("sm")]: {
      paddingInline: theme.spacing(5),
    },
  },
}));

type PackageImageProps = {
  form: Pick<PackageFormState, "thumbnail_url">;
  onChange: (patch: Partial<PackageFormState>) => void;
};

const ACCEPT_IMAGE = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
};

const PackageImage = ({ form, onChange }: PackageImageProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setUploadError(null);
      setUploading(true);
      try {
        const { url } = await uploadFile(file, "packages");
        onChange({ thumbnail_url: url });
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT_IMAGE,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
    disabled: uploading,
  });

  const handleRemoveThumbnail = () => {
    onChange({ thumbnail_url: "" });
    setUploadError(null);
  };

  const thumbnailUrl = form.thumbnail_url?.trim() || "";

  return (
    <Dropzone>
      <Card>
        <CardHeader
          title="Package Image"
          subheader="Upload thumbnail (max 10 MB). JPG, PNG, WebP, GIF."
        />
        <CardContent>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <div className="flex items-center flex-col gap-2 text-center">
              {uploading ? (
                <CircularProgress size={48} />
              ) : (
                <CustomAvatar variant="rounded" skin="light" color="secondary">
                  <i className="ri-upload-2-line" />
                </CustomAvatar>
              )}
              <Typography variant="h4">
                {uploading
                  ? "Uploading…"
                  : isDragActive
                    ? "Drop the image here"
                    : "Drag and drop your image here, or browse"}
              </Typography>
              {!uploading && (
                <Button variant="outlined" size="small">
                  Browse Image
                </Button>
              )}
            </div>
          </div>

          {uploadError && (
            <Typography color="error" variant="body2" className="mts-2">
              {uploadError}
            </Typography>
          )}

          {thumbnailUrl ? (
            <div className="mts-4 flex items-center gap-3 flex-wrap">
              <div className="relative">
                <img
                  src={thumbnailUrl.startsWith("http") ? thumbnailUrl : `${getApiUrl()}${thumbnailUrl}`}
                  alt="Thumbnail"
                  className="rounded border"
                  style={{ maxWidth: 160, maxHeight: 120, objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  onClick={handleRemoveThumbnail}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <i className="ri-close-line text-xl" />
                </IconButton>
              </div>
              <Button
                color="error"
                variant="outlined"
                size="small"
                onClick={handleRemoveThumbnail}
              >
                Remove thumbnail
              </Button>
            </div>
          ) : null}

          <TextField
            fullWidth
            label="Thumbnail URL (optional)"
            placeholder="https://… or upload above"
            value={form.thumbnail_url}
            onChange={(e) => onChange({ thumbnail_url: e.target.value })}
            className="mts-4"
          />
        </CardContent>
      </Card>
    </Dropzone>
  );
};

export default PackageImage;
