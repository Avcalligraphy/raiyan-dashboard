// React Imports
import { useCallback } from "react";

// MUI Imports
import Grid from "@mui/material/Grid2";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

// Type Imports
import { LEAD_STATUSES } from "@/types/leadTypes";
import type { User } from "@/services/userService";

export type LeadFilterParams = {
  status?: string;
  owner_id?: string;
};

type TableFiltersProps = {
  status: string;
  owner_id: string;
  onFiltersChange: (params: LeadFilterParams) => void;
  users: User[];
};

const TableFilters = ({
  status,
  owner_id,
  onFiltersChange,
  users,
}: TableFiltersProps) => {
  const handleStatus = useCallback(
    (v: string) => {
      onFiltersChange({ status: v || undefined, owner_id: owner_id || undefined });
    },
    [onFiltersChange, owner_id]
  );

  const handleOwner = useCallback(
    (v: string) => {
      onFiltersChange({ status: status || undefined, owner_id: v || undefined });
    },
    [onFiltersChange, status]
  );

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="lead-filter-status">Status</InputLabel>
            <Select
              labelId="lead-filter-status"
              label="Status"
              value={status}
              onChange={(e) => handleStatus(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {LEAD_STATUSES.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="lead-filter-owner">Owner</InputLabel>
            <Select
              labelId="lead-filter-owner"
              label="Owner"
              value={owner_id}
              onChange={(e) => handleOwner(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.full_name || u.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  );
};

export default TableFilters;
