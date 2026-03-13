import { useState, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import PostAddHeader from "../add/PostAddHeader";
import PostInformation from "../add/PostInformation";
import PostCategory from "../add/PostCategory";
import PostTags from "../add/PostTags";
import {
  initialBlogPostFormState,
  type BlogPostFormState,
} from "@/types/blogPostTypes";
import {
  useBlogPost,
  useBlogPostTags,
  useUpdateBlogPost,
} from "@/hooks/useBlogPosts";

const BlogPostEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<BlogPostFormState>(initialBlogPostFormState);

  const { data: post, isLoading: loadingPost, error: postError } = useBlogPost(id ?? null);
  const { data: postTags = [] } = useBlogPostTags(id ?? null);
  const updatePost = useUpdateBlogPost();

  useEffect(() => {
    if (!post) return;
    setForm({
      title: post.title ?? "",
      slug: post.slug ?? "",
      category_id: post.category_id ?? "",
      content: post.content ?? "",
      featured_image: post.featured_image ?? "",
      meta_title: post.meta_title ?? "",
      meta_description: post.meta_description ?? "",
      status: post.status ?? "draft",
      scheduled_at: post.scheduled_at
        ? new Date(post.scheduled_at).toISOString().slice(0, 16)
        : "",
      tag_ids: postTags.map((t) => t.id),
    });
  }, [post, postTags]);

  const onChange = useCallback((patch: Partial<BlogPostFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const submit = useCallback(
    async (status: "draft" | "published") => {
      if (!id || !form.title.trim() || !form.slug.trim()) return;
      const effectiveStatus =
        status === "draft"
          ? "draft"
          : form.status === "scheduled"
            ? "scheduled"
            : "published";
      try {
        await updatePost.mutateAsync({
          id,
          data: {
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
          },
        });
        navigate("/blog/post", { replace: true });
      } catch (err) {
        console.error(err);
      }
    },
    [id, form, updatePost, navigate]
  );

  const handleDiscard = useCallback(() => {
    navigate("/blog/post");
  }, [navigate]);

  if (postError || (id && !loadingPost && !post)) {
    return (
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Typography color="error">
            {postError ? postError.message : "Post not found."}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  if (loadingPost || !post) {
    return (
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Typography color="text.secondary">Loading post…</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PostAddHeader
          title="Edit post"
          subtitle={post.title}
          onDiscard={handleDiscard}
          onSaveDraft={() => submit("draft")}
          onPublish={() => submit("published")}
          isSubmitting={updatePost.isPending}
        />
        {updatePost.error && (
          <div className="mt-4 p-4 rounded bg-error/10 text-error">
            {updatePost.error instanceof Error
              ? updatePost.error.message
              : "Failed to update post."}
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

export default BlogPostEditPage;
