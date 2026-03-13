import { useEffect } from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import classnames from "classnames";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import type { Editor } from "@tiptap/core";

import CustomIconButton from "@core/components/mui/IconButton";
import "@/libs/styles/tiptapEditor.css";
import type { BlogPostFormState } from "@/types/blogPostTypes";

const STATUSES = ["draft", "published", "scheduled"] as const;

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5">
      <CustomIconButton
        {...(editor.isActive("bold") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames("ri-bold", { "text-textSecondary": !editor.isActive("bold") })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("underline") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames("ri-underline", { "text-textSecondary": !editor.isActive("underline") })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("italic") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames("ri-italic", { "text-textSecondary": !editor.isActive("italic") })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("strike") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames("ri-strikethrough", { "text-textSecondary": !editor.isActive("strike") })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "left" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <i className={classnames("ri-align-left", { "text-textSecondary": !editor.isActive({ textAlign: "left" }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "center" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <i className={classnames("ri-align-center", { "text-textSecondary": !editor.isActive({ textAlign: "center" }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "right" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <i className={classnames("ri-align-right", { "text-textSecondary": !editor.isActive({ textAlign: "right" }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "justify" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <i className={classnames("ri-align-justify", { "text-textSecondary": !editor.isActive({ textAlign: "justify" }) })} />
      </CustomIconButton>
    </div>
  );
};

type PostInformationProps = {
  form: BlogPostFormState;
  onChange: (patch: Partial<BlogPostFormState>) => void;
};

const PostInformation = ({ form, onChange }: PostInformationProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write your post content…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
    ],
    immediatelyRender: false,
    content: form.content || "<p></p>",
    onUpdate: ({ editor }) => onChange({ content: editor.getHTML() }),
  });

  useEffect(() => {
    if (editor && form.content !== editor.getHTML()) {
      editor.commands.setContent(form.content || "<p></p>", { emitUpdate: false });
    }
  }, [form.content, editor]);

  return (
    <Card>
      <CardHeader title="Post information" />
      <CardContent>
        <Grid container spacing={5} className="mbe-5">
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Title"
              placeholder="Tips Umrah Pertama Kali"
              value={form.title}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Slug"
              placeholder="tips-umrah-pertama"
              value={form.slug}
              onChange={(e) => onChange({ slug: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => onChange({ status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Featured image URL"
              placeholder="https://..."
              value={form.featured_image}
              onChange={(e) => onChange({ featured_image: e.target.value })}
            />
          </Grid>
          {form.status === "scheduled" && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Scheduled at"
                value={form.scheduled_at}
                onChange={(e) => onChange({ scheduled_at: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          )}
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
        <Typography className="mbe-1">Content</Typography>
        <Card className="p-0 border shadow-none">
          <CardContent className="p-0">
            <EditorToolbar editor={editor} />
            <Divider className="mli-5" />
            <EditorContent editor={editor} className="bs-[200px] overflow-y-auto flex" />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PostInformation;
