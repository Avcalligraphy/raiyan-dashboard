import { useState, useEffect, useMemo } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
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
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import type { RankingInfo } from "@tanstack/match-sorter-utils";

// Type Imports
import type { BlogCategory } from "@/services/blogCategoryService";

// Component Imports
import AddCategoryDrawer from "./AddCategoryDrawer";
import { PermissionTooltip } from "@/components/PermissionTooltip";

// Hooks Imports
import { useBlogCategories, useDeleteBlogCategory } from "@/hooks/useBlogCategories";

// Style Imports
import tableStyles from "@core/styles/table.module.css";

// Augment TanStack Table for fuzzy filter
declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type BlogCategoryWithAction = BlogCategory & {
  action?: string;
};

const fuzzyFilter: FilterFn<BlogCategoryWithAction> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({
    itemRank,
  });
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
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <TextField
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size="small"
    />
  );
};

// Column Definitions
const columnHelper = createColumnHelper<BlogCategoryWithAction>();

const CategoryBlogPage = () => {
  // States
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Hooks
  const { data: categories = [], isLoading, error } = useBlogCategories();
  const deleteCategory = useDeleteBlogCategory();

  const columns = useMemo(
    () =>
      [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          ),
        },
        columnHelper.accessor("name", {
          header: "Name",
          cell: ({ row }) => (
            <Typography color="text.primary" className="font-medium">
              {row.original.name}
            </Typography>
          ),
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
          header: "Created At",
          cell: ({ row }) => {
            const date = row.original.created_at
              ? new Date(row.original.created_at).toLocaleDateString()
              : "-";
            return <Typography variant="body2">{date}</Typography>;
          },
        }),
        columnHelper.accessor("updated_at", {
          header: "Updated At",
          cell: ({ row }) => {
            const date = row.original.updated_at
              ? new Date(row.original.updated_at).toLocaleDateString()
              : "-";
            return <Typography variant="body2">{date}</Typography>;
          },
        }),
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <PermissionTooltip permission="blog.write">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedCategory(row.original);
                    setCategoryDrawerOpen(true);
                  }}
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
                        `Are you sure you want to delete "${row.original.name}"?`
                      )
                    ) {
                      deleteCategory.mutate(row.original.id);
                    }
                  }}
                >
                  <i className="ri-delete-bin-line" />
                </IconButton>
              </PermissionTooltip>
            </div>
          ),
        },
      ] as ColumnDef<BlogCategoryWithAction>[],
    [deleteCategory]
  );

  // TanStack Table
  const table = useReactTable({
    data: categories,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setCategoryDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setCategoryDrawerOpen(false);
    setSelectedCategory(null);
  };

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">
            Error loading categories: {error instanceof Error ? error.message : "Unknown error"}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-4">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search categories..."
            className="max-sm:is-full"
          />
          <div className="flex gap-4 max-sm:flex-col max-sm:is-full">
            <Button
              variant="outlined"
              className="max-sm:is-full"
              color="secondary"
              startIcon={<i className="ri-upload-2-line" />}
            >
              Export
            </Button>
            <PermissionTooltip permission="blog.write">
              <Button
                variant="contained"
                color="primary"
                className="max-sm:is-full"
                startIcon={<i className="ri-add-line" />}
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            </PermissionTooltip>
          </div>
        </CardContent>
        {isLoading ? (
          <CardContent>
            <Typography>Loading categories...</Typography>
          </CardContent>
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
                            <>
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
                                  asc: <i className="ri-arrow-up-s-line text-xl" />,
                                  desc: (
                                    <i className="ri-arrow-down-s-line text-xl" />
                                  ),
                                }[header.column.getIsSorted() as "asc" | "desc"] ??
                                  null}
                              </div>
                            </>
                          )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                {table.getFilteredRowModel().rows.length === 0 ? (
                  <tbody>
                    <tr>
                      <td
                        colSpan={table.getVisibleFlatColumns().length}
                        className="text-center"
                      >
                        No categories found
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {table
                      .getRowModel()
                      .rows.slice(0, table.getState().pagination.pageSize)
                      .map((row) => {
                        return (
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
                        );
                      })}
                  </tbody>
                )}
              </table>
            </div>
            <TablePagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              component="div"
              className="border-bs"
              count={table.getFilteredRowModel().rows.length}
              rowsPerPage={table.getState().pagination.pageSize}
              page={table.getState().pagination.pageIndex}
              SelectProps={{
                inputProps: { "aria-label": "rows per page" },
              }}
              onPageChange={(_, page) => {
                table.setPageIndex(page);
              }}
              onRowsPerPageChange={(e) =>
                table.setPageSize(Number(e.target.value))
              }
            />
          </>
        )}
      </Card>
      <AddCategoryDrawer
        open={categoryDrawerOpen}
        handleClose={handleCloseDrawer}
        category={selectedCategory}
      />
    </>
  );
};

export default CategoryBlogPage;
