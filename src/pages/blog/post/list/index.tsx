import { useState, useMemo } from "react";
import Grid from "@mui/material/Grid2";
import PostCard from "./PostCard";
import PostListTable from "./PostListTable";
import { useBlogPostList } from "@/hooks/useBlogPosts";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { useBlogTags } from "@/hooks/useBlogTags";

export type PostListFilters = {
  status: string;
  category_id: string;
  tag_id: string;
};

const BlogPostListPage = () => {
  const [filters, setFilters] = useState<PostListFilters>({
    status: "",
    category_id: "",
    tag_id: "",
  });
  const [globalFilter, setGlobalFilter] = useState("");

  const listParams = useMemo(
    () => ({
      limit: 1000,
      offset: 0,
      ...(filters.status && { status: filters.status }),
      ...(filters.category_id && { category_id: filters.category_id }),
      ...(filters.tag_id && { tag_id: filters.tag_id }),
      sort_by: "newest" as const,
    }),
    [filters]
  );

  const { data: listData, isLoading, error } = useBlogPostList(listParams);
  const { data: categories = [] } = useBlogCategories();
  const { data: tags = [] } = useBlogTags();

  const posts = useMemo(() => listData?.data ?? [], [listData?.data]);
  const total = listData?.total ?? 0;

  const stats = useMemo(() => {
    const draft = posts.filter((p) => p.status === "draft").length;
    const published = posts.filter((p) => p.status === "published").length;
    const scheduled = posts.filter((p) => p.status === "scheduled").length;
    return { total, draft, published, scheduled };
  }, [posts, total]);

  const categoryMap = useMemo(() => {
    const m: Record<string, string> = {};
    categories.forEach((c) => {
      m[c.id] = c.name;
    });
    return m;
  }, [categories]);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PostCard stats={stats} loading={isLoading} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <PostListTable
          posts={posts}
          categoryMap={categoryMap}
          filters={filters}
          setFilters={setFilters}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          categories={categories}
          tags={tags}
          isLoading={isLoading}
          error={error}
        />
      </Grid>
    </Grid>
  );
};

export default BlogPostListPage;
