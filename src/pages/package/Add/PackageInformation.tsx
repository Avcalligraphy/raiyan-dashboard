// MUI Imports
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Type Imports
import type {
  PackageFormState,
  PackageStatus,
  PackageCategory,
} from "@/types/packageTypes";

const CATEGORIES: PackageCategory[] = [
  "Reguler",
  "Premium",
  "Berbakti",
  "Ramadhan",
];
const STATUSES: PackageStatus[] = ["Available", "Full", "Coming Soon"];

type PackageInformationProps = {
  form: Pick<
    PackageFormState,
    | "name"
    | "slug"
    | "category"
    | "status"
    | "badge"
    | "meta_title"
    | "meta_description"
  >;
  onChange: (patch: Partial<PackageFormState>) => void;
};

const PackageInformation = ({ form, onChange }: PackageInformationProps) => {
  return (
    <Card>
      <CardHeader title="Package information" />
      <CardContent>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Package name"
              placeholder="Umrah Premium Maret 2025"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Slug"
              placeholder="umrah-premium-maret-2025"
              value={form.slug}
              onChange={(e) => onChange({ slug: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={form.category}
                onChange={(e) => onChange({ category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) =>
                  onChange({ status: e.target.value as PackageStatus })
                }
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Badge"
              placeholder="Best Seller"
              value={form.badge}
              onChange={(e) => onChange({ badge: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Meta title"
              placeholder="SEO title"
              value={form.meta_title}
              onChange={(e) => onChange({ meta_title: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Meta description"
              placeholder="SEO description"
              multiline
              rows={2}
              value={form.meta_description}
              onChange={(e) => onChange({ meta_description: e.target.value })}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PackageInformation;
