import { useState, useEffect, useMemo, useCallback } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
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
import type { LegalDocument } from "@/types/legalDocumentTypes";

// Component Imports
import AddLegalDrawer from "./AddLegalDrawer";
import { PermissionTooltip } from "@/components/PermissionTooltip";
import { getApiUrl } from "@/services/apiClient";
import { legalDocumentService } from "@/services/legalDocumentService";

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

const fuzzyFilter: FilterFn<LegalDocument> = (row, columnId, value, addMeta) => {
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

const columnHelper = createColumnHelper<LegalDocument>();

const LegalDocumentPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<LegalDocument | null>(null);
  const [data, setData] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  const fetchList = async () => {
    setLoading(true);
    try {
      const res = await legalDocumentService.list({ limit: 500, offset: 0 });
      setData(res.data ?? []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Delete this legal document?")) return;
    try {
      await legalDocumentService.delete(id);
      fetchList();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("document_name", {
        header: "Document Name",
        cell: ({ getValue }) => (
          <Typography color="text.primary" className="font-medium">
            {getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor("document_number", {
        header: "Document Number",
        cell: ({ getValue }) => <Typography>{getValue()}</Typography>,
      }),
      columnHelper.accessor("document_type", {
        header: "Type",
        cell: ({ getValue }) => (
          <Chip label={getValue()} size="small" variant="tonal" />
        ),
      }),
      columnHelper.accessor("file_url", {
        header: "File",
        cell: ({ row }) => {
          const url = row.original.file_url?.trim();
          if (!url) return <Typography color="text.disabled">—</Typography>;
          const href = url.startsWith("http") ? url : `${getApiUrl()}${url}`;
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              View file
            </a>
          );
        },
      }),
      columnHelper.accessor("issued_date", {
        header: "Issued Date",
        cell: ({ getValue }) => (
          <Typography>
            {getValue() ? new Date(getValue() as string).toLocaleDateString() : "—"}
          </Typography>
        ),
      }),
      columnHelper.accessor("is_active", {
        header: "Active",
        cell: ({ getValue }) => (
          <Chip
            label={getValue() ? "Active" : "Inactive"}
            color={getValue() ? "success" : "default"}
            size="small"
          />
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <PermissionTooltip permission="legal.write">
              <IconButton
                size="small"
                onClick={() => {
                  setEditingDoc(row.original);
                  setDrawerOpen(true);
                }}
              >
                <i className="ri-pencil-line" />
              </IconButton>
            </PermissionTooltip>
            <PermissionTooltip permission="legal.write">
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(row.original.id)}
              >
                <i className="ri-delete-bin-line" />
              </IconButton>
            </PermissionTooltip>
          </div>
        ),
      }),
    ] as ColumnDef<LegalDocument>[],
    [handleDelete],
  );

  const table = useReactTable({
    data,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { globalFilter },
    globalFilterFn: fuzzyFilter,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingDoc(null);
    fetchList();
  };

  const handleAdd = () => {
    setEditingDoc(null);
    setDrawerOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-4">
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(v) => setGlobalFilter(String(v))}
            placeholder="Search"
            className="max-sm:is-full"
          />
          <PermissionTooltip permission="legal.write">
            <Button
              variant="contained"
              color="primary"
              className="max-sm:is-full"
              startIcon={<i className="ri-add-line" />}
              onClick={handleAdd}
            >
              Add Legal Document
            </Button>
          </PermissionTooltip>
        </CardContent>
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((hg) => (
                <tr key={hg.id}>
                  {hg.headers.map((h) => (
                    <th key={h.id}>
                      {h.isPlaceholder
                        ? null
                        : flexRender(h.column.columnDef.header, h.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    Loading…
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    No data available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
      <AddLegalDrawer
        open={drawerOpen}
        handleClose={handleCloseDrawer}
        document={editingDoc}
      />
    </>
  );
};

export default LegalDocumentPage;
