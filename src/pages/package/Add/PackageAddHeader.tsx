// MUI Imports
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

type PackageAddHeaderProps = {
  title?: string;
  subtitle?: string;
  onDiscard?: () => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
  isSubmitting?: boolean;
};

const PackageAddHeader = ({
  title = "Add package",
  subtitle = "Create a new Umrah package",
  onDiscard,
  onSaveDraft,
  onPublish,
  isSubmitting = false,
}: PackageAddHeaderProps) => {
  return (
    <div className="flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6">
      <div>
        <Typography variant="h4" className="mbe-1">
          {title}
        </Typography>
        <Typography>{subtitle}</Typography>
      </div>
      <div className="flex flex-wrap max-sm:flex-col gap-4">
        <Button variant="outlined" color="secondary" onClick={onDiscard} disabled={isSubmitting}>
          Discard
        </Button>
        <Button variant="outlined" onClick={onSaveDraft} disabled={isSubmitting}>
          Save Draft
        </Button>
        <Button variant="contained" onClick={onPublish} disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Publish"}
        </Button>
      </div>
    </div>
  );
};

export default PackageAddHeader;
