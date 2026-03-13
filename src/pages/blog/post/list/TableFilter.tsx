// React Imports
// MUI Imports
import Grid from "@mui/material/Grid2";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Type Imports
import type { BlogCategory } from "@/services/blogCategoryService";
import type { BlogTag } from "@/services/blogTagService";
import type { PostListFilters } from "./index";

type TableFiltersProps = {
  filters: PostListFilters;
  setFilters: (f: PostListFilters) => void;
  categories: BlogCategory[];
  tags: BlogTag[];
};

const TableFilters = ({
  filters,
  setFilters,
  categories,
  tags,
}: TableFiltersProps) => {
  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="post-filter-status">Status</InputLabel>
            <Select
              fullWidth
              id="select-status"
              label="Status"
              labelId="post-filter-status"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
              <MenuItem value="scheduled">Scheduled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="post-filter-category">Category</InputLabel>
            <Select
              fullWidth
              id="select-category"
              labelId="post-filter-category"
              label="Category"
              value={filters.category_id}
              onChange={(e) =>
                setFilters({ ...filters, category_id: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="post-filter-tag">Tag</InputLabel>
            <Select
              fullWidth
              id="select-tag"
              labelId="post-filter-tag"
              label="Tag"
              value={filters.tag_id}
              onChange={(e) =>
                setFilters({ ...filters, tag_id: e.target.value })
              }
            >
              <MenuItem value="">All</MenuItem>
              {tags.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
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
