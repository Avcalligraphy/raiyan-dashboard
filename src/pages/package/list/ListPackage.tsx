// React Imports
import { useEffect, useState } from "react";

// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import ProductListTable from "./ProductListTable";
import PackageCard from "@/pages/package/list/PackageCard";

// Service Imports
import { packageService } from "@/services/packageService";

// Type Imports
import type { Package } from "@/types/packageTypes";

const ListPackage = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listParams, setListParams] = useState<{
    category?: string;
    status?: string;
    is_published?: boolean;
  }>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await packageService.list({
        limit: 500,
        offset: 0,
        ...listParams,
      });
      setPackages(res.data);
      setTotal(res.total);
    } catch {
      setPackages([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [listParams]);

  const onFiltersChange = (params: {
    category?: string;
    status?: string;
    is_published?: boolean;
  }) => {
    setListParams(params);
  };

  const onDeleted = () => {
    load();
  };

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PackageCard total={total} packages={packages} loading={loading} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <ProductListTable
          packageData={packages}
          loading={loading}
          filterCategory={listParams.category ?? ""}
          filterStatus={listParams.status ?? ""}
          filterPublished={
            listParams.is_published === true
              ? "true"
              : listParams.is_published === false
                ? "false"
                : ""
          }
          onFiltersChange={onFiltersChange}
          onDeleted={onDeleted}
        />
      </Grid>
    </Grid>
  );
};

export default ListPackage;
