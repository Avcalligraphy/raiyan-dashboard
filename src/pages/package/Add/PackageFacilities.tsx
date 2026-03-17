// React Imports
import { useEffect, useState, useCallback } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";

// Service Imports
import { facilityService, type Facility } from "@/services/facilityService";

// Type Imports
import type { PackageFormState } from "@/types/packageTypes";

type PackageFacilitiesProps = {
  form: Pick<PackageFormState, "facilities">;
  onChange: (patch: Partial<PackageFormState>) => void;
};

const PackageFacilities = ({ form, onChange }: PackageFacilitiesProps) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedFacilities = form.facilities ?? [];

  useEffect(() => {
    let cancelled = false;
    facilityService
      .list()
      .then((list) => {
        if (!cancelled) setFacilities(list ?? []);
      })
      .catch(() => {
        if (!cancelled) setFacilities([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getIdsByType = (type: "included" | "excluded") =>
    selectedFacilities.filter((f) => f.facility_type === type).map((f) => f.facility_id);

  const handleChange = useCallback(
    (facilityType: "included" | "excluded", facilityIds: string[]) => {
      const rest = selectedFacilities.filter((f) => f.facility_type !== facilityType);
      const next = [
        ...rest,
        ...facilityIds.map((facility_id) => ({ facility_id, facility_type: facilityType })),
      ];
      onChange({ facilities: next });
    },
    [selectedFacilities, onChange],
  );

  return (
    <Card>
      <CardHeader
        title="Facilities"
        subheader="Pilih fasilitas included dan excluded untuk paket ini (opsional)."
      />
      <CardContent>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading facilities…
          </Typography>
        ) : (
          <div className="flex flex-col gap-4">
            <FormControl fullWidth size="small">
              <InputLabel>Included facilities</InputLabel>
              <Select
                label="Included facilities"
                multiple
                value={getIdsByType("included")}
                onChange={(e) => {
                  const v = e.target.value;
                  handleChange("included", typeof v === "string" ? v.split(",") : v);
                }}
                renderValue={(ids) =>
                  ids
                    .map((id) => facilities.find((f) => f.id === id)?.name ?? id)
                    .join(", ") || "None"
                }
              >
                {facilities.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Excluded facilities</InputLabel>
              <Select
                label="Excluded facilities"
                multiple
                value={getIdsByType("excluded")}
                onChange={(e) => {
                  const v = e.target.value;
                  handleChange("excluded", typeof v === "string" ? v.split(",") : v);
                }}
                renderValue={(ids) =>
                  ids
                    .map((id) => facilities.find((f) => f.id === id)?.name ?? id)
                    .join(", ") || "None"
                }
              >
                {facilities.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PackageFacilities;
