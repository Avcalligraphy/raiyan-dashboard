// React Imports
import { useEffect, useMemo, useState } from "react";

// React Router Imports
import { useNavigate } from "react-router-dom";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
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
import type { Package } from "@/types/packageTypes";

// Component Imports
import TableFilters from "./TableFilters";
import OptionMenu from "@core/components/option-menu";
import { PermissionTooltip } from "@/components/PermissionTooltip";
import { packageService } from "@/services/packageService";

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

const fuzzyFilter: FilterFn<Package> = (row, columnId, value, addMeta) => {
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
    const t = setTimeout(() => onChange(value), debounce);
    return () => clearTimeout(t);
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

const columnHelper = createColumnHelper<Package>();

type ProductListTableProps = {
  packageData: Package[];
  loading: boolean;
  filterCategory: string;
  filterStatus: string;
  filterPublished: string;
  onFiltersChange: (params: {
    category?: string;
    status?: string;
    is_published?: boolean;
  }) => void;
  onDeleted: () => void;
};

const ProductListTable = ({
  packageData,
  loading,
  filterCategory,
  filterStatus,
  filterPublished,
  onFiltersChange,
  onDeleted,
}: ProductListTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("name", {
          header: "Package",
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              {row.original.thumbnail_url ? (
                <img
                  src={row.original.thumbnail_url}
                  width={38}
                  height={38}
                  alt=""
                  className="rounded-md bg-actionHover object-cover"
                />
              ) : (
                <div className="flex items-center justify-center rounded-md bg-actionHover w-[38px] h-[38px]">
                  <i className="ri-box-3-line text-textSecondary" />
                </div>
              )}
              <div className="flex flex-col">
                <Typography className="font-medium" color="text.primary">
                  {row.original.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {row.original.slug}
                </Typography>
              </div>
            </div>
          ),
        }),
        columnHelper.accessor("category", {
          header: "Category",
          cell: ({ getValue }) => (
            <Typography color="text.primary">{getValue()}</Typography>
          ),
        }),
        columnHelper.accessor("price", {
          header: "Price",
          cell: ({ getValue }) => (
            <Typography>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              }).format(getValue() ?? 0)}
            </Typography>
          ),
        }),
        columnHelper.accessor("duration_days", {
          header: "Days",
          cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
        }),
        columnHelper.accessor("status", {
          header: "Status",
          cell: ({ getValue }) => (
            <Chip
              label={getValue()}
              variant="tonal"
              color="default"
              size="small"
            />
          ),
        }),
        columnHelper.accessor("badge", {
          header: "Badge",
          cell: ({ getValue }) => (
            <Typography variant="body2">{getValue() || "–"}</Typography>
          ),
        }),
        columnHelper.accessor("is_published", {
          header: "Published",
          cell: ({ getValue }) => (
            <Chip
              label={getValue() ? "Yes" : "Draft"}
              variant="tonal"
              color={getValue() ? "success" : "default"}
              size="small"
            />
          ),
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center">
              <IconButton
                size="small"
                onClick={() => navigate(`/package/edit/${row.original.id}`)}
              >
                <i className="ri-edit-box-line text-[22px] text-textSecondary" />
              </IconButton>
              <OptionMenu
                iconButtonProps={{ size: "medium" }}
                iconClassName="text-textSecondary text-[22px]"
                options={[
                  {
                    text: "Delete",
                    icon: "ri-delete-bin-7-line",
                    menuItemProps: {
                      onClick: async () => {
                        const id = row.original.id;
                        if (!id || deletingId) return;
                        setDeletingId(id);
                        try {
                          await packageService.delete(id);
                          onDeleted();
                        } finally {
                          setDeletingId(null);
                        }
                      },
                      disabled: !!deletingId,
                    },
                  },
                ]}
              />
            </div>
          ),
        }),
      ] as ColumnDef<Package>[],
    [navigate, onDeleted, deletingId],
  );

  const table = useReactTable({
    data: packageData,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <Card>
      <CardHeader title="Filters" />
      <TableFilters
        category={filterCategory}
        status={filterStatus}
        is_published={filterPublished}
        onFiltersChange={(params) => {
          onFiltersChange({
            category: params.category || undefined,
            status: params.status || undefined,
            is_published: params.is_published,
          });
        }}
      />
      <Divider />
      <div className="flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(v) => setGlobalFilter(String(v))}
          placeholder="Search package"
          className="max-sm:is-full"
        />
        <div className="flex items-center max-sm:flex-col gap-4 max-sm:is-full is-auto">
          <Button
            color="secondary"
            variant="outlined"
            className="max-sm:is-full is-auto"
            startIcon={<i className="ri-upload-2-line" />}
          >
            Export
          </Button>
          <PermissionTooltip permission="packages.write">
            <Button
              variant="contained"
              onClick={() => navigate("/package/add")}
              startIcon={<i className="ri-add-line" />}
              className="max-sm:is-full is-auto"
            >
              Add package
            </Button>
          </PermissionTooltip>
        </div>
      </div>
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
                          header.getContext(),
                        )}
                        {{
                          asc: <i className="ri-arrow-up-s-line text-xl" />,
                          desc: <i className="ri-arrow-down-s-line text-xl" />,
                        }[header.column.getIsSorted() as "asc" | "desc"] ??
                          null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-8">
                  Loading…
                </td>
              </tr>
            ) : table.getFilteredRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-8">
                  No packages found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={classnames({ selected: row.getIsSelected() })}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
      />
    </Card>
  );
};

export default ProductListTable;
