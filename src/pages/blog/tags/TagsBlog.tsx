import { useState, useMemo, useEffect } from "react";

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
import type { BlogTag } from "@/services/blogTagService";

// Component Imports
import AddTagsDrawer from "./AddTagsDrawer";
import { PermissionTooltip } from "@/components/PermissionTooltip";

// Hooks Imports
import { useBlogTags, useDeleteBlogTag } from "@/hooks/useBlogTags";

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

type BlogTagWithAction = BlogTag & {
  action?: string;
};

const fuzzyFilter: FilterFn<BlogTagWithAction> = (
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

const columnHelper = createColumnHelper<BlogTagWithAction>();

const TagsBlogPage = () => {
  const [tagDrawerOpen, setTagDrawerOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<BlogTag | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: tags = [], isLoading, error } = useBlogTags();
  const deleteTag = useDeleteBlogTag();

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
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <PermissionTooltip permission="blog.write">
                <IconButton
                  size="small"
                  onClick={() => {
                    setSelectedTag(row.original);
                    setTagDrawerOpen(true);
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
                      deleteTag.mutate(row.original.id);
                    }
                  }}
                >
                  <i className="ri-delete-bin-line" />
                </IconButton>
              </PermissionTooltip>
            </div>
          ),
        },
      ] as ColumnDef<BlogTagWithAction>[],
    [deleteTag]
  );

  const table = useReactTable({
    data: tags,
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

  const handleAddTag = () => {
    setSelectedTag(null);
    setTagDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setTagDrawerOpen(false);
    setSelectedTag(null);
  };

  if (error) {
    return (
      <Card>
        <CardContent>
          <Typography color="error">
            Error loading tags:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
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
            placeholder="Search tags..."
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
                onClick={handleAddTag}
              >
                Add Tag
              </Button>
            </PermissionTooltip>
          </div>
        </CardContent>
        {isLoading ? (
          <CardContent>
            <Typography>Loading tags...</Typography>
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
                                  "flex items-center":
                                    header.column.getIsSorted(),
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
                        No tags yet. Add one to get started.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {table
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
                      ))}
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
      <AddTagsDrawer
        open={tagDrawerOpen}
        handleClose={handleCloseDrawer}
        tag={selectedTag}
      />
    </>
  );
};

export default TagsBlogPage;
