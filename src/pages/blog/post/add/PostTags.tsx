import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

import type { BlogPostFormState } from "@/types/blogPostTypes";
import { useBlogTags } from "@/hooks/useBlogTags";
import AddTagsDrawer from "@/pages/blog/tags/AddTagsDrawer";

type PostTagsProps = {
  form: Pick<BlogPostFormState, "tag_ids">;
  onChange: (patch: Partial<BlogPostFormState>) => void;
};

const PostTags = ({ form, onChange }: PostTagsProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: tags = [], refetch } = useBlogTags();

  useEffect(() => {
    if (!drawerOpen) refetch();
  }, [drawerOpen, refetch]);

  const handleRemoveTag = (tagId: string) => {
    onChange({ tag_ids: form.tag_ids.filter((id) => id !== tagId) });
  };

  return (
    <>
      <Card>
        <CardHeader title="Tags" />
        <CardContent>
          <FormControl fullWidth size="small" className="mbe-3">
            <InputLabel id="post-tags-label">Tags</InputLabel>
            <Select
              labelId="post-tags-label"
              label="Tags"
              multiple
              value={form.tag_ids}
              onChange={(e) => {
                const v = e.target.value;
                onChange({ tag_ids: typeof v === "string" ? [] : v });
              }}
              renderValue={(selected) => (
                <Box className="flex flex-wrap gap-1">
                  {(selected as string[]).map((id) => {
                    const t = tags.find((x) => x.id === id);
                    return t ? (
                      <Chip
                        key={t.id}
                        size="small"
                        label={t.name}
                        onDelete={() => handleRemoveTag(t.id)}
                      />
                    ) : null;
                  })}
                </Box>
              )}
            >
              {tags.map((t) => (
                <MenuItem key={t.id} value={t.id}>
                  {t.name}
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
            Add tag
          </Button>
        </CardContent>
      </Card>
      <AddTagsDrawer
        open={drawerOpen}
        handleClose={() => setDrawerOpen(false)}
        tag={null}
      />
    </>
  );
};

export default PostTags;
