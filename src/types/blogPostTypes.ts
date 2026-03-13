export type BlogPostFormState = {
  title: string
  slug: string
  category_id: string
  content: string
  featured_image: string
  meta_title: string
  meta_description: string
  status: string
  scheduled_at: string
  tag_ids: string[]
}

export const initialBlogPostFormState: BlogPostFormState = {
  title: "",
  slug: "",
  category_id: "",
  content: "",
  featured_image: "",
  meta_title: "",
  meta_description: "",
  status: "draft",
  scheduled_at: "",
  tag_ids: [],
}
