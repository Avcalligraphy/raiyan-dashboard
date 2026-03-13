import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { TextFieldProps } from "@mui/material/TextField";

// Third-party Imports
import classnames from "classnames";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import type { RankingInfo } from "@tanstack/match-sorter-utils";

// Type Imports
import type { BlogPost } from "@/services/blogPostService";
import type { BlogCategory } from "@/services/blogCategoryService";
import type { BlogTag } from "@/services/blogTagService";
import type { PostListFilters } from "./index";

// Component Imports
import TableFilters from "./TableFilter";
import { PermissionTooltip } from "@/components/PermissionTooltip";
import { useDeleteBlogPost } from "@/hooks/useBlogPosts";

// Style Imports
import tableStyles from "@core/styles/table.module.css";

declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type BlogPostWithAction = BlogPost & { _action?: string };

const statusConfig: Record<string, { label: string; color: "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" }> = {
  draft: { label: "Draft", color: "default" },
  published: { label: "Published", color: "success" },
  scheduled: { label: "Scheduled", color: "warning" },
};

const fuzzyFilter: FilterFn<BlogPostWithAction> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<TextFieldProps, "onChange">) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size="small"
    />
  );
};

const columnHelper = createColumnHelper<BlogPostWithAction>();

type PostListTableProps = {
  posts: BlogPost[];
  categoryMap: Record<string, string>;
  filters: PostListFilters;
  setFilters: (f: PostListFilters) => void;
  globalFilter: string;
  setGlobalFilter: (v: string) => void;
  categories: BlogCategory[];
  tags: BlogTag[];
  isLoading?: boolean;
  error?: Error | null;
};

const PostListTable = ({
  posts,
  categoryMap,
  filters,
  setFilters,
  globalFilter,
  setGlobalFilter,
  categories,
  tags,
  isLoading,
  error,
}: PostListTableProps) => {
  const deletePost = useDeleteBlogPost();
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      columnHelper.accessor("title", {
        header: "Title",
        cell: ({ row }) => (
          <Typography className="font-medium" color="text.primary">
            {row.original.title}
          </Typography>
        ),
      }),
      columnHelper.accessor("category_id", {
        header: "Category",
        cell: ({ row }) => (
          <Typography variant="body2">
            {row.original.category_id
              ? categoryMap[row.original.category_id] ?? row.original.category_id
              : "—"}
          </Typography>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => {
          const c = statusConfig[row.original.status] ?? {
            label: row.original.status,
            color: "default" as const,
          };
          return <Chip label={c.label} size="small" color={c.color} variant="tonal" />;
        },
      }),
      columnHelper.accessor("slug", {
        header: "Slug",
        cell: ({ row }) => (
          <Typography variant="body2" color="text.secondary">
            {row.original.slug}
          </Typography>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Created",
        cell: ({ row }) => (
          <Typography variant="body2">
            {row.original.created_at
              ? new Date(row.original.created_at).toLocaleDateString()
              : "—"}
          </Typography>
        ),
      }),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <PermissionTooltip permission="blog.write">
              <IconButton
                size="small"
                component={Link}
                to={`/blog/post/edit/${row.original.id}`}
              >
                <i className="ri-pencil-line" />
              </IconButton>
            </PermissionTooltip>
            <PermissionTooltip permission="blog.write">
              <IconButton
                size="small"
                color="error"
                onClick={() => {
                  if (
                    window.confirm(
                      `Delete post "${row.original.title}"?`
                    )
                  ) {
                    deletePost.mutate(row.original.id);
                  }
                }}
              >
                <i className="ri-delete-bin-line" />
              </IconButton>
            </PermissionTooltip>
          </div>
        ),
      },
    ] as ColumnDef<BlogPostWithAction>[],
    [categoryMap, deletePost]
  );

  const table = useReactTable({
    data: posts,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">
            Error loading posts: {error.message}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Filters" />
      <TableFilters
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        tags={tags}
      />
      <Divider />
      <div className="flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(v) => setGlobalFilter(String(v))}
          placeholder="Search posts…"
          className="max-sm:is-full"
        />
        <PermissionTooltip permission="blog.write">
          <Button
            variant="contained"
            component={Link}
            to="/blog/post/add"
            startIcon={<i className="ri-add-line" />}
            className="max-sm:is-full"
          >
            Add Post
          </Button>
        </PermissionTooltip>
      </div>
      {isLoading ? (
        <div className="p-5">
          <Typography color="text.secondary">Loading posts…</Typography>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className={tableStyles.table}>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={classnames({
                              "flex items-center": header.column.getIsSorted(),
                              "cursor-pointer select-none":
                                header.column.getCanSort(),
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: (
                                <i className="ri-arrow-up-s-line text-xl" />
                              ),
                              desc: (
                                <i className="ri-arrow-down-s-line text-xl" />
                              ),
                            }[
                              header.column.getIsSorted() as "asc" | "desc"
                            ] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getFilteredRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center"
                    >
                      No posts found.
                    </td>
                  </tr>
                ) : (
                  table
                    .getRowModel()
                    .rows.slice(
                      0,
                      table.getState().pagination.pageSize
                    )
                    .map((row) => (
                      <tr
                        key={row.id}
                        className={classnames({
                          selected: row.getIsSelected(),
                        })}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            className="border-bs"
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => table.setPageIndex(page)}
            onRowsPerPageChange={(e) =>
              table.setPageSize(Number(e.target.value))
            }
          />
        </>
      )}
    </Card>
  );
};

export default PostListTable;
