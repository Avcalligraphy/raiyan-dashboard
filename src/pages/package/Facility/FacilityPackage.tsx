import { useState, useEffect, useMemo } from "react";

// MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
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
import type { Facility } from "@/services/facilityService";

// Component Imports
import AddFacilityDrawer from "./AddFacilityDrawer";
import { PermissionTooltip } from "@/components/PermissionTooltip";

// Hooks Imports
import { useFacilities, useDeleteFacility } from "@/hooks/useFacilities";

// Style Imports
import tableStyles from "@core/styles/table.module.css";

// Augment TanStack Table for fuzzy filter (table-core may be bundled)
declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type FacilityWithAction = Facility & {
  action?: string;
};

const fuzzyFilter: FilterFn<FacilityWithAction> = (
  row,
  columnId,
  value,
  addMeta,
) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
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
  // States
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
const columnHelper = createColumnHelper<FacilityWithAction>();

const FacilityPackagesPage = () => {
  // States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Hooks
  const { data: facilitiesData, isLoading, isError, error } = useFacilities();
  const deleteFacility = useDeleteFacility();

  // API returns Facility[] directly
  const data = facilitiesData || [];

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this facility?")) {
      try {
        await deleteFacility.mutateAsync(id);
      } catch (error) {
        console.error("Failed to delete facility:", error);
      }
    }
  };

  const handleAddNew = () => {
    setEditingFacility(null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setEditingFacility(null);
  };

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
          header: "Facility Name",
          cell: ({ row }) => (
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>
              {row.original.name}
            </Typography>
          ),
        }),
        columnHelper.accessor("description", {
          header: "Description",
          cell: ({ row }) => (
            <Typography variant="body2" sx={{ maxWidth: 400 }}>
              {row.original.description}
            </Typography>
          ),
        }),
        {
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <Box sx={{ display: "flex", gap: 1 }}>
              <PermissionTooltip permission="packages.write">
                <IconButton
                  size="small"
                  onClick={() => handleEdit(row.original)}
                  sx={{ color: "primary.main" }}
                >
                  <i className="ri-edit-line" />
                </IconButton>
              </PermissionTooltip>
              <PermissionTooltip permission="packages.write">
                <IconButton
                  size="small"
                  onClick={() => handleDelete(row.original.id)}
                  sx={{ color: "error.main" }}
                  disabled={deleteFacility.isPending}
                >
                  <i className="ri-delete-bin-line" />
                </IconButton>
              </PermissionTooltip>
            </Box>
          ),
        },
      ] as ColumnDef<FacilityWithAction>[],
    [deleteFacility.isPending],
  );

  // TanStack Table: API returns non-memoizable functions; React Compiler skips this component
  const table = useReactTable({
    data,
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
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
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

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">
            Failed to load facilities: {error instanceof Error ? error.message : "Unknown error"}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 4,
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search facilities..."
            sx={{ width: { xs: "100%", sm: "auto" } }}
          />
          <Box sx={{ display: "flex", gap: 2, width: { xs: "100%", sm: "auto" } }}>
            <PermissionTooltip permission="packages.write">
              <Button
                variant="contained"
                color="primary"
                fullWidth={false}
                sx={{ width: { xs: "100%", sm: "auto" } }}
                startIcon={<i className="ri-add-line" />}
                onClick={handleAddNew}
              >
                Add Facility
              </Button>
            </PermissionTooltip>
          </Box>
        </CardContent>
        <Box sx={{ overflowX: "auto" }}>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: header.column.getCanSort() ? "pointer" : "default",
                            userSelect: "none",
                          }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: <i className="ri-arrow-up-s-line" style={{ fontSize: "1.25rem" }} />,
                            desc: (
                              <i className="ri-arrow-down-s-line" style={{ fontSize: "1.25rem" }} />
                            ),
                          }[header.column.getIsSorted() as "asc" | "desc"] ??
                            null}
                        </Box>
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
                    style={{ textAlign: "center" }}
                  >
                    No data available
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
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
              </tbody>
            )}
          </table>
        </Box>
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
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddFacilityDrawer
        open={drawerOpen}
        handleClose={handleCloseDrawer}
        facility={editingFacility}
      />
    </>
  );
};

export default FacilityPackagesPage;
