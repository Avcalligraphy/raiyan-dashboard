// React Imports
import { useCallback, useEffect, useState } from "react";

// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import LeadCard from "./LeadCard";
import LeadListTable from "./LeadListTable";

// Service Imports
import { leadService } from "@/services/leadService";
import { userService } from "@/services/userService";

// Type Imports
import type { Lead } from "@/types/leadTypes";
import type { LeadFilterParams } from "./TableFilters";
import type { User } from "@/services/userService";

const LeadPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [listParams, setListParams] = useState<LeadFilterParams>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await leadService.list({
        limit: 500,
        offset: 0,
        ...listParams,
      });
      setLeads(res.data);
      setTotal(res.total);
    } catch {
      setLeads([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [listParams]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    userService
      .list({ limit: 200, offset: 0 })
      .then((list) => setUsers(list || []))
      .catch(() => setUsers([]));
  }, []);

  const onFiltersChange = (params: LeadFilterParams) => {
    setListParams(params);
  };

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <LeadCard total={total} leads={leads} loading={loading} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <LeadListTable
          leadData={leads}
          loading={loading}
          filterStatus={listParams.status ?? ""}
          filterOwnerId={listParams.owner_id ?? ""}
          onFiltersChange={onFiltersChange}
          users={users}
        />
      </Grid>
    </Grid>
  );
};

export default LeadPage;
