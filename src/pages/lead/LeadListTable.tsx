// React Imports
import { useEffect, useMemo, useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
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
import type { Lead } from "@/types/leadTypes";
import type { LeadFilterParams } from "./TableFilters";
import type { User } from "@/services/userService";

// Component Imports
import TableFilters from "./TableFilters";
import { PermissionTooltip } from "@/components/PermissionTooltip";
import { leadService } from "@/services/leadService";

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

const fuzzyFilter: FilterFn<Lead> = (row, columnId, value, addMeta) => {
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

const columnHelper = createColumnHelper<Lead>();

const statusColor: Record<string, "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"> = {
  New: "info",
  Contacted: "primary",
  "Follow Up": "warning",
  Closing: "success",
  Lost: "error",
};

type LeadListTableProps = {
  leadData: Lead[];
  loading: boolean;
  filterStatus: string;
  filterOwnerId: string;
  onFiltersChange: (params: LeadFilterParams) => void;
  users: User[];
};

const LeadListTable = ({
  leadData,
  loading,
  filterStatus,
  filterOwnerId,
  onFiltersChange,
  users,
}: LeadListTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const data = leadData ?? [];

  const columns = useMemo(
    () => [
      columnHelper.accessor("full_name", {
        header: "Name",
        cell: ({ getValue }) => (
          <Typography className="font-medium" color="text.primary">
            {getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor("whatsapp_number", {
        header: "WhatsApp",
        cell: ({ getValue }) => {
          const num = getValue()?.replace(/\D/g, "") || "";
          const url = num ? `https://wa.me/${num}` : "#";
          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary"
            >
              <i className="ri-whatsapp-line" />
              {getValue()}
            </a>
          );
        },
      }),
      columnHelper.accessor("package_name", {
        header: "Package",
        cell: ({ getValue }) => (
          <Typography variant="body2">{getValue() || "—"}</Typography>
        ),
      }),
      columnHelper.accessor("city", {
        header: "City",
        cell: ({ getValue }) => (
          <Typography variant="body2">{getValue() || "—"}</Typography>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ getValue }) => {
          const s = getValue();
          return (
            <Chip
              label={s}
              size="small"
              color={statusColor[s] || "default"}
              variant="tonal"
            />
          );
        },
      }),
      columnHelper.accessor("owner_name", {
        header: "Owner",
        cell: ({ getValue }) => (
          <Typography variant="body2">{getValue() || "—"}</Typography>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: "Created",
        cell: ({ getValue }) => (
          <Typography variant="body2">
            {getValue()
              ? new Date(getValue() as string).toLocaleDateString()
              : "—"}
          </Typography>
        ),
      }),
    ] as ColumnDef<Lead>[],
    []
  );

  const table = useReactTable({
    data,
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

  const handleExport = async () => {
    try {
      const blob = await leadService.exportCsv({
        status: filterStatus || undefined,
        owner_id: filterOwnerId || undefined,
        search: String(globalFilter || "").trim() || undefined,
      });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "leads.csv";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Card>
      <CardHeader title="Filters" />
      <TableFilters
        status={filterStatus}
        owner_id={filterOwnerId}
        onFiltersChange={onFiltersChange}
        users={users}
      />
      <Divider />
      <div className="flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5">
        <DebouncedInput
          value={globalFilter ?? ""}
          onChange={(v) => setGlobalFilter(String(v))}
          placeholder="Search name, phone, city…"
          className="max-sm:is-full"
        />
        <PermissionTooltip permission="leads.read">
          <Button
            color="secondary"
            variant="outlined"
            className="max-sm:is-full is-auto"
            startIcon={<i className="ri-upload-2-line" />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        </PermissionTooltip>
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
                          header.getContext()
                        )}
                        {{
                          asc: <i className="ri-arrow-up-s-line text-xl" />,
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
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-8">
                  Loading…
                </td>
              </tr>
            ) : table.getFilteredRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-8">
                  No leads found
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
    </Card>
  );
};

export default LeadListTable;
