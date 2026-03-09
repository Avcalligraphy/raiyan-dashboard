// React Imports
import { useCallback } from "react";

// MUI Imports
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

// Component Imports
import CustomIconButton from "@core/components/mui/IconButton";

// Type Imports
import type { PackageFormState } from "@/types/packageTypes";

type PackageDeparturesProps = {
  form: Pick<PackageFormState, "departures">;
  onChange: (patch: Partial<PackageFormState>) => void;
};

const PackageDepartures = ({ form, onChange }: PackageDeparturesProps) => {
  const departures = form.departures;

  const updateDeparture = useCallback(
    (index: number, patch: Partial<PackageFormState["departures"][0]>) => {
      const next = [...departures];
      next[index] = { ...next[index], ...patch };
      onChange({ departures: next });
    },
    [departures, onChange],
  );

  const removeDeparture = useCallback(
    (index: number) => {
      onChange({ departures: departures.filter((_, i) => i !== index) });
    },
    [departures, onChange],
  );

  const addDeparture = useCallback(() => {
    onChange({
      departures: [
        ...departures,
        { departure_date: "", quota: 40, remaining_quota: 40 },
      ],
    });
  }, [departures, onChange]);

  return (
    <Card>
      <CardHeader title="Departures" />
      <CardContent>
        <Grid container spacing={6}>
          {departures.map((d, index) => (
            <Grid key={index} size={{ xs: 12 }}>
              <Grid container spacing={6} alignItems="center">
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Departure date"
                    value={d.departure_date}
                    onChange={(e) =>
                      updateDeparture(index, { departure_date: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Quota"
                    value={d.quota}
                    onChange={(e) =>
                      updateDeparture(index, {
                        quota: Number(e.target.value) || 0,
                      })
                    }
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Remaining quota"
                    value={d.remaining_quota}
                    onChange={(e) =>
                      updateDeparture(index, {
                        remaining_quota: Number(e.target.value) || 0,
                      })
                    }
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 2 }}>
                  <CustomIconButton
                    onClick={() => removeDeparture(index)}
                    className="min-is-fit"
                  >
                    <i className="ri-close-line" />
                  </CustomIconButton>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              onClick={addDeparture}
              startIcon={<i className="ri-add-line" />}
            >
              Add departure
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PackageDepartures;
