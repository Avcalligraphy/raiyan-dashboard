// React Imports
import { useEffect } from "react";

// MUI Imports
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

// Third-party Imports
import classnames from "classnames";
import { useEditor, EditorContent } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import type { Editor } from "@tiptap/core";

// Component Imports
import CustomIconButton from "@core/components/mui/IconButton";

// Style Imports
import "@/libs/styles/tiptapEditor.css";
import type {
  PackageFormState,
  PackageStatus,
  PackageCategory,
} from "@/types/packageTypes";

const CATEGORIES: PackageCategory[] = [
  "Reguler",
  "Premium",
  "Berbakti",
  "Ramadhan",
];
const STATUSES: PackageStatus[] = ["Available", "Full", "Coming Soon"];

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
        <i
          className={classnames("ri-bold", {
            "text-textSecondary": !editor.isActive("bold"),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("underline") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i
          className={classnames("ri-underline", {
            "text-textSecondary": !editor.isActive("underline"),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("italic") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i
          className={classnames("ri-italic", {
            "text-textSecondary": !editor.isActive("italic"),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive("strike") && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i
          className={classnames("ri-strikethrough", {
            "text-textSecondary": !editor.isActive("strike"),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "left" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <i
          className={classnames("ri-align-left", {
            "text-textSecondary": !editor.isActive({ textAlign: "left" }),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "center" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <i
          className={classnames("ri-align-center", {
            "text-textSecondary": !editor.isActive({ textAlign: "center" }),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "right" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <i
          className={classnames("ri-align-right", {
            "text-textSecondary": !editor.isActive({ textAlign: "right" }),
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: "justify" }) && { color: "primary" })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <i
          className={classnames("ri-align-justify", {
            "text-textSecondary": !editor.isActive({ textAlign: "justify" }),
          })}
        />
      </CustomIconButton>
    </div>
  );
};

type PackageInformationProps = {
  form: Pick<
    PackageFormState,
    | "name"
    | "slug"
    | "category"
    | "status"
    | "badge"
    | "itinerary"
    | "meta_title"
    | "meta_description"
  >;
  onChange: (patch: Partial<PackageFormState>) => void;
};

const PackageInformation = ({ form, onChange }: PackageInformationProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write itinerary (Day 1: ...)" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
    ],
    immediatelyRender: false,
    content: form.itinerary || "<p></p>",
    onUpdate: ({ editor }) => {
      onChange({ itinerary: editor.getHTML() });
    },
  });

  useEffect(() => {
    if (editor && form.itinerary !== editor.getHTML()) {
      editor.commands.setContent(form.itinerary || "<p></p>", {
        emitUpdate: false,
      });
    }
  }, [form.itinerary, editor]);

  return (
    <Card>
      <CardHeader title="Package information" />
      <CardContent>
        <Grid container spacing={5} className="mbe-5">
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Package name"
              placeholder="Umrah Premium Maret 2025"
              value={form.name}
              onChange={(e) => onChange({ name: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Slug"
              placeholder="umrah-premium-maret-2025"
              value={form.slug}
              onChange={(e) => onChange({ slug: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={form.category}
                onChange={(e) => onChange({ category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) =>
                  onChange({ status: e.target.value as PackageStatus })
                }
              >
                {STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Badge"
              placeholder="Best Seller"
              value={form.badge}
              onChange={(e) => onChange({ badge: e.target.value })}
            />
          </Grid>
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
        <Typography className="mbe-1">Itinerary</Typography>
        <Card className="p-0 border shadow-none">
          <CardContent className="p-0">
            <EditorToolbar editor={editor} />
            <Divider className="mli-5" />
            <EditorContent
              editor={editor}
              className="bs-[135px] overflow-y-auto flex"
            />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default PackageInformation;
