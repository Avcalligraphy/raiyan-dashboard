import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";

import type { BlogPostFormState } from "@/types/blogPostTypes";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import AddCategoryDrawer from "@/pages/blog/categories/AddCategoryDrawer";

type PostCategoryProps = {
  form: Pick<BlogPostFormState, "category_id">;
  onChange: (patch: Partial<BlogPostFormState>) => void;
};

const PostCategory = ({ form, onChange }: PostCategoryProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: categories = [], refetch } = useBlogCategories();

  useEffect(() => {
    if (!drawerOpen) refetch();
  }, [drawerOpen, refetch]);

  return (
    <>
      <Card>
        <CardHeader title="Category" />
        <CardContent>
          <FormControl fullWidth size="small" className="mbe-3">
            <InputLabel id="post-category-label">Category</InputLabel>
            <Select
              labelId="post-category-label"
              label="Category"
              value={form.category_id}
              onChange={(e) => onChange({ category_id: e.target.value })}
            >
              <MenuItem value="">None</MenuItem>
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            size="small"
            startIcon={<i className="ri-add-line" />}
            onClick={() => setDrawerOpen(true)}
          >
            Add category
          </Button>
        </CardContent>
      </Card>
      <AddCategoryDrawer
        open={drawerOpen}
        handleClose={() => setDrawerOpen(false)}
        category={null}
      />
    </>
  );
};

export default PostCategory;
