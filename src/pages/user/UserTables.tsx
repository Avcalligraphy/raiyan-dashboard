import { useState, useEffect, useMemo } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import type { TextFieldProps } from "@mui/material/TextField";

// Third-party Imports
import { Link } from "react-router-dom";
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
import type {
  UserManagementType,
  UsersType,
} from "@/types/apps/ecommerceTypes";

// Component Imports
import AddCustomerDrawer from "./AddCustomerDrawer";
import CustomAvatar from "@core/components/mui/Avatar";

// Util Imports
import { getInitials } from "@/utils/getInitials";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import { InputLabel, Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { MenuItem } from "@mui/material";

// Augment TanStack Table for fuzzy filter (table-core may be bundled)
declare module "@tanstack/react-table" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

type ECommerceOrderTypeWithAction = UserManagementType & {
  action?: string;
};

const fuzzyFilter: FilterFn<ECommerceOrderTypeWithAction> = (
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
const columnHelper = createColumnHelper<ECommerceOrderTypeWithAction>();

const UserTablesPage = ({
  customerData,
}: {
  customerData?: UserManagementType[];
}) => {
  // States
  const [customerUserOpen, setCustomerUserOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<UserManagementType[]>(customerData ?? []);
  const [globalFilter, setGlobalFilter] = useState("");
  const [role, setRole] = useState<UsersType["role"]>("");

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
        columnHelper.accessor("customer", {
          header: "Customers",
          cell: ({ row }) => (
            <div className="flex items-center gap-3">
              {getAvatar({
                avatar: row.original.avatar,
                customer: row.original.customer,
              })}
              <div className="flex flex-col items-start">
                <Typography
                  component={Link}
                  to={`/user-management/details/${row.original.customerId}`}
                  color="text.primary"
                  className="font-medium hover:text-primary"
                >
                  {row.original.customer}
                </Typography>
                <Typography variant="body2">{row.original.email}</Typography>
              </div>
            </div>
          ),
        }),
        columnHelper.accessor("customerId", {
          header: "Customer Id",
          cell: ({ row }) => (
            <Typography color="text.primary">
              #{row.original.customerId}
            </Typography>
          ),
        }),
        columnHelper.accessor("country", {
          header: "Country",
          cell: ({ row }) => (
            <div className="flex items-center gap-2">
              <img src={row.original.countryFlag} height={22} />
              <Typography>{row.original.country}</Typography>
            </div>
          ),
        }),
        columnHelper.accessor("order", {
          header: "Orders",
          cell: ({ row }) => <Typography>{row.original.order}</Typography>,
        }),
        columnHelper.accessor("totalSpent", {
          header: "Total Spent",
          cell: ({ row }) => (
            <Typography className="font-medium" color="text.primary">
              ${row.original.totalSpent.toLocaleString()}
            </Typography>
          ),
        }),
      ] as ColumnDef<ECommerceOrderTypeWithAction>[],
    [],
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

  const getAvatar = (
    params: Pick<UserManagementType, "avatar" | "customer">,
  ) => {
    const { avatar, customer } = params;

    if (avatar) {
      return <CustomAvatar src={avatar} skin="light" size={34} />;
    } else {
      return (
        <CustomAvatar skin="light" size={34}>
          {getInitials(customer as string)}
        </CustomAvatar>
      );
    }
  };

  return (
    <>
      <Card>
        <CardContent className="flex justify-between flex-wrap max-sm:flex-col sm:items-center gap-4">
          <Button
            variant="contained"
            color="primary"
            className="max-sm:is-full"
            startIcon={<i className="ri-add-line" />}
            onClick={() => setCustomerUserOpen(!customerUserOpen)}
          >
            Add Customer
          </Button>
          <div className="flex gap-4 max-sm:flex-col max-sm:is-full">
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search"
              className="max-sm:is-full"
            />
            <FormControl size="small" className="max-sm:is-full">
              <InputLabel id="roles-app-role-select-label">
                Select Role
              </InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Select Role"
                id="roles-app-role-select"
                labelId="roles-app-role-select-label"
                className="min-is-[150px]"
              >
                <MenuItem value="">Select Role</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="author">Author</MenuItem>
                <MenuItem value="editor">Editor</MenuItem>
                <MenuItem value="maintainer">Maintainer</MenuItem>
                <MenuItem value="subscriber">Subscriber</MenuItem>
              </Select>
            </FormControl>
          </div>
        </CardContent>
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
                              header.getContext(),
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
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddCustomerDrawer
        open={customerUserOpen}
        handleClose={() => setCustomerUserOpen(!customerUserOpen)}
        setData={setData}
        customerData={data}
      />
    </>
  );
};

export default UserTablesPage;
