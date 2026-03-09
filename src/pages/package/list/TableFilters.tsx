// React Imports
import { useCallback } from "react";

// MUI Imports
import Grid from "@mui/material/Grid2";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

export type PackageFilterParams = {
  category?: string;
  status?: string;
  is_published?: boolean;
};

type TableFiltersProps = {
  category: string;
  status: string;
  is_published: string; // '' | 'true' | 'false'
  onFiltersChange: (params: PackageFilterParams) => void;
};

const CATEGORIES = ["", "Reguler", "Premium", "Berbakti", "Ramadhan"];
const STATUSES = ["", "Available", "Full", "Coming Soon"];
const PUBLISH_OPTIONS = [
  { value: "", label: "All" },
  { value: "true", label: "Published" },
  { value: "false", label: "Draft" },
];

const TableFilters = ({
  category,
  status,
  is_published,
  onFiltersChange,
}: TableFiltersProps) => {
  const handleCategory = useCallback(
    (v: string) => {
      onFiltersChange({ category: v || undefined, status, is_published: is_published === "true" ? true : is_published === "false" ? false : undefined });
    },
    [onFiltersChange, status, is_published]
  );
  const handleStatus = useCallback(
    (v: string) => {
      onFiltersChange({ category, status: v || undefined, is_published: is_published === "true" ? true : is_published === "false" ? false : undefined });
    },
    [onFiltersChange, category, is_published]
  );
  const handlePublished = useCallback(
    (v: string) => {
      onFiltersChange({
        category,
        status,
        is_published: v === "true" ? true : v === "false" ? false : undefined,
      });
    },
    [onFiltersChange, category, status]
  );
  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="filter-category">Category</InputLabel>
            <Select
              labelId="filter-category"
              label="Category"
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {CATEGORIES.filter(Boolean).map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="filter-status">Status</InputLabel>
            <Select
              labelId="filter-status"
              label="Status"
              value={status}
              onChange={(e) => handleStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {STATUSES.filter(Boolean).map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="filter-published">Published</InputLabel>
            <Select
              labelId="filter-published"
              label="Published"
              value={is_published}
              onChange={(e) => handlePublished(e.target.value)}
            >
              {PUBLISH_OPTIONS.map((o) => (
                <MenuItem key={o.value || "all"} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
