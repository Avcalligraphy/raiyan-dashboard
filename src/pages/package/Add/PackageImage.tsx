"use client";

// React Imports
import { useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import type { BoxProps } from "@mui/material/Box";

// Third-party Imports
import { useDropzone } from "react-dropzone";

// Component Imports
import Link from "@components/Link";
import CustomAvatar from "@core/components/mui/Avatar";

// Styled Component Imports
import AppReactDropzone from "@/libs/styles/AppReactDropzone";

// Type Imports
import type { PackageFormState } from "@/types/packageTypes";

type FileProp = {
  name: string;
  type: string;
  size: number;
};

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  "& .dropzone": {
    minHeight: "unset",
    padding: theme.spacing(12),
    [theme.breakpoints.down("sm")]: {
      paddingInline: theme.spacing(5),
    },
    "&+.MuiList-root .MuiListItem-root .file-name": {
      fontWeight: theme.typography.body1.fontWeight,
    },
  },
}));

type PackageImageProps = {
  form: Pick<PackageFormState, "thumbnail_url">;
  onChange: (patch: Partial<PackageFormState>) => void;
};

/**
 * Package image UI (dropzone + file list). Upload functionality not wired to backend yet;
 * thumbnail_url can be set via "Add media from URL" or left empty.
 */
const PackageImage = ({ form, onChange }: PackageImageProps) => {
  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)));
    },
  });

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          width={38}
          height={38}
          alt={file.name}
          src={URL.createObjectURL(file as File)}
        />
      );
    }
    return <i className="ri-file-text-line" />;
  };

  const handleRemoveFile = (file: FileProp) => {
    setFiles((prev) => prev.filter((f) => f.name !== file.name));
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <Dropzone>
      <Card>
        <CardHeader
          title="Package Image"
          action={
            <Typography
              component={Link}
              href="#"
              color="primary.main"
              className="font-medium"
              onClick={(e) => e.preventDefault()}
            >
              Add media from URL
            </Typography>
          }
          sx={{ "& .MuiCardHeader-action": { alignSelf: "center" } }}
        />
        <CardContent>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <div className="flex items-center flex-col gap-2 text-center">
              <CustomAvatar variant="rounded" skin="light" color="secondary">
                <i className="ri-upload-2-line" />
              </CustomAvatar>
              <Typography variant="h4">
                Drag and Drop Your Image Here.
              </Typography>
              <Typography color="text.disabled">or</Typography>
              <Button variant="outlined" size="small">
                Browse Image
              </Button>
            </div>
          </div>
          {files.length > 0 ? (
            <>
              <List>
                {files.map((file) => (
                  <ListItem key={file.name} className="pis-4 plb-3">
                    <div className="file-details">
                      <div className="file-preview">
                        {renderFilePreview(file)}
                      </div>
                      <div>
                        <Typography
                          className="file-name font-medium"
                          color="text.primary"
                        >
                          {file.name}
                        </Typography>
                        <Typography className="file-size" variant="body2">
                          {Math.round(file.size / 100) / 10 > 1000
                            ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                            : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
                        </Typography>
                      </div>
                    </div>
                    <IconButton onClick={() => handleRemoveFile(file)}>
                      <i className="ri-close-line text-xl" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <div className="buttons">
                <Button
                  color="error"
                  variant="outlined"
                  onClick={handleRemoveAllFiles}
                >
                  Remove All
                </Button>
                <Button variant="contained">Upload Files</Button>
              </div>
            </>
          ) : null}
          <TextField
            fullWidth
            label="Thumbnail URL (optional)"
            placeholder="https://…"
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
