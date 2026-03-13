import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";

import PostAddHeader from "./PostAddHeader";
import PostInformation from "./PostInformation";
import PostCategory from "./PostCategory";
import PostTags from "./PostTags";
import {
  initialBlogPostFormState,
  type BlogPostFormState,
} from "@/types/blogPostTypes";
import { useCreateBlogPost } from "@/hooks/useBlogPosts";

const BlogPostAddPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<BlogPostFormState>(initialBlogPostFormState);
  const createPost = useCreateBlogPost();

  const onChange = useCallback((patch: Partial<BlogPostFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const submit = useCallback(
    async (status: "draft" | "published") => {
      if (!form.title.trim() || !form.slug.trim()) {
        return;
      }
      try {
        const effectiveStatus =
          status === "draft"
            ? "draft"
            : form.status === "scheduled"
              ? "scheduled"
              : "published";
        await createPost.mutateAsync({
          title: form.title.trim(),
          slug: form.slug.trim(),
          category_id: form.category_id || undefined,
          content: form.content || "",
          featured_image: form.featured_image || undefined,
          meta_title: form.meta_title || undefined,
          meta_description: form.meta_description || undefined,
          status: effectiveStatus,
          scheduled_at:
            effectiveStatus === "scheduled" && form.scheduled_at
              ? new Date(form.scheduled_at).toISOString()
              : undefined,
          tag_ids: form.tag_ids,
        });
        navigate("/blog/post", { replace: true });
      } catch (err) {
        console.error(err);
      }
    },
    [form, createPost, navigate]
  );

  const handleDiscard = useCallback(() => {
    navigate("/blog/post");
  }, [navigate]);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PostAddHeader
          title="Add post"
          subtitle="Create a new blog post"
          onDiscard={handleDiscard}
          onSaveDraft={() => submit("draft")}
          onPublish={() => submit("published")}
          isSubmitting={createPost.isPending}
        />
        {createPost.error && (
          <div className="mt-4 p-4 rounded bg-error/10 text-error">
            {createPost.error instanceof Error
              ? createPost.error.message
              : "Failed to create post."}
          </div>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <PostInformation form={form} onChange={onChange} />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <PostCategory form={form} onChange={onChange} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <PostTags form={form} onChange={onChange} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BlogPostAddPage;
