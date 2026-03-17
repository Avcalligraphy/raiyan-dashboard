import { useEffect, useState, useCallback } from "react";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import type { BoxProps } from "@mui/material/Box";

import classnames from "classnames";
import { useDropzone } from "react-dropzone";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import type { Editor } from "@tiptap/core";

import CustomIconButton from "@core/components/mui/IconButton";
import CustomAvatar from "@core/components/mui/Avatar";
import { uploadFile } from "@/services/uploadService";
import { getApiUrl } from "@/services/apiClient";
import AppReactDropzone from "@/libs/styles/AppReactDropzone";
import "@/libs/styles/tiptapEditor.css";
import type { BlogPostFormState } from "@/types/blogPostTypes";

const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
  "& .dropzone": {
    minHeight: "unset",
    padding: theme.spacing(6),
    [theme.breakpoints.down("sm")]: {
      paddingInline: theme.spacing(5),
    },
  },
}));

const ACCEPT_IMAGE = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "image/gif": [".gif"],
};

const STATUSES = ["draft", "published", "scheduled"] as const;

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  const setLink = () => {
    const prev = editor.getAttributes("link").href ?? "";
    const url = window.prompt("URL", prev);
    if (url === null) return;
    if (url === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const setImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const currentBlock = (() => {
    if (editor.isActive("heading", { level: 1 })) return "heading1";
    if (editor.isActive("heading", { level: 2 })) return "heading2";
    if (editor.isActive("heading", { level: 3 })) return "heading3";
    if (editor.isActive("heading", { level: 4 })) return "heading4";
    if (editor.isActive("heading", { level: 5 })) return "heading5";
    if (editor.isActive("heading", { level: 6 })) return "heading6";
    return "paragraph";
  })();

  const handleBlockChange = (value: string) => {
    const chain = editor.chain().focus();
    switch (value) {
      case "paragraph":
        chain.setParagraph().run();
        break;
      case "heading1":
        chain.toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        chain.toggleHeading({ level: 2 }).run();
        break;
      case "heading3":
        chain.toggleHeading({ level: 3 }).run();
        break;
      case "heading4":
        chain.toggleHeading({ level: 4 }).run();
        break;
      case "heading5":
        chain.toggleHeading({ level: 5 }).run();
        break;
      case "heading6":
        chain.toggleHeading({ level: 6 }).run();
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5">
      {/* Block type selector: paragraph & headings */}
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <Select
          value={currentBlock}
          onChange={(e) => handleBlockChange(e.target.value as string)}
          displayEmpty
        >
          <MenuItem value="paragraph">Paragraph</MenuItem>
          <MenuItem value="heading1">Heading 1</MenuItem>
          <MenuItem value="heading2">Heading 2</MenuItem>
          <MenuItem value="heading3">Heading 3</MenuItem>
          <MenuItem value="heading4">Heading 4</MenuItem>
          <MenuItem value="heading5">Heading 5</MenuItem>
          <MenuItem value="heading6">Heading 6</MenuItem>
        </Select>
      </FormControl>
      <span className="self-center h-5 w-px bg-divider" aria-hidden />
      <CustomIconButton
        {...(editor.isActive("bulletList") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        <i className={classnames("ri-list-unordered", { "text-textSecondary": !editor.isActive("bulletList") })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("orderedList") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Numbered list"
      >
        <i className={classnames("ri-list-ordered", { "text-textSecondary": !editor.isActive("orderedList") })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("link") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={setLink}
        title="Link"
      >
        <i className={classnames("ri-link", { "text-textSecondary": !editor.isActive("link") })} />
      </CustomIconButton>
      <CustomIconButton
        variant="outlined"
        size="small"
        onClick={setImage}
        title="Image"
      >
        <i className="ri-image-line text-textSecondary" />
      </CustomIconButton>
      <span className="self-center h-5 w-px bg-divider" aria-hidden />
      {/* Text formatting */}
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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setUploadError(null);
      setUploading(true);
      try {
        const { url } = await uploadFile(file, "blog");
        onChange({ featured_image: url });
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT_IMAGE,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10 MB
    disabled: uploading,
  });

  const handleRemoveFeaturedImage = () => {
    onChange({ featured_image: "" });
    setUploadError(null);
  };

  const featuredImageUrl = form.featured_image?.trim() || "";

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Placeholder.configure({ placeholder: "Write your post content…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
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
            <Typography variant="subtitle2" color="text.secondary" className="mbe-2">
              Featured image
            </Typography>
            <Dropzone>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                <div className="flex items-center flex-col gap-2 text-center">
                  {uploading ? (
                    <CircularProgress size={48} />
                  ) : (
                    <CustomAvatar variant="rounded" skin="light" color="secondary">
                      <i className="ri-upload-2-line" />
                    </CustomAvatar>
                  )}
                  <Typography variant="body2">
                    {uploading
                      ? "Uploading…"
                      : isDragActive
                        ? "Drop the image here"
                        : "Drag and drop your image here, or browse (max 10 MB). JPG, PNG, WebP, GIF."}
                  </Typography>
                  {!uploading && (
                    <Button variant="outlined" size="small">
                      Browse Image
                    </Button>
                  )}
                </div>
              </div>
            </Dropzone>
            {uploadError && (
              <Typography color="error" variant="body2" className="mts-2">
                {uploadError}
              </Typography>
            )}
            {featuredImageUrl ? (
              <div className="mts-5">
                <Typography variant="caption" color="text.secondary" className="mbe-2 block">
                  Current featured image
                </Typography>
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="relative shrink-0">
                    <img
                      src={
                        featuredImageUrl.startsWith("http")
                          ? featuredImageUrl
                          : `${getApiUrl()}${featuredImageUrl}`
                      }
                      alt="Featured"
                      className="rounded border"
                      style={{ maxWidth: 160, maxHeight: 120, objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      onClick={handleRemoveFeaturedImage}
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        bgcolor: "background.paper",
                        "&:hover": { bgcolor: "action.hover" },
                      }}
                    >
                      <i className="ri-close-line text-xl" />
                    </IconButton>
                  </div>
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    onClick={handleRemoveFeaturedImage}
                    className="self-center"
                  >
                    Remove image
                  </Button>
                </div>
              </div>
            ) : null}
            <div className="mts-8">
              <TextField
                fullWidth
                label="Featured image URL (optional)"
                placeholder="https://… or paste URL here"
                value={form.featured_image}
                onChange={(e) => onChange({ featured_image: e.target.value })}
              />
            </div>
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
