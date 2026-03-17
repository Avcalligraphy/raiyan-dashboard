// React Imports
import { useCallback, useMemo } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// Type Imports
import type { ItineraryDay } from "@/types/packageTypes";
import type { PackageFormState } from "@/types/packageTypes";

type PackageItineraryProps = {
  form: Pick<PackageFormState, "itinerary">;
  onChange: (patch: Partial<PackageFormState>) => void;
};

const PackageItinerary = ({ form, onChange }: PackageItineraryProps) => {
  const itinerary = useMemo(() => form.itinerary ?? [], [form.itinerary]);

  const updateDay = useCallback(
    (index: number, patch: Partial<ItineraryDay>) => {
      const next = [...itinerary];
      next[index] = { ...next[index], ...patch };
      onChange({ itinerary: next });
    },
    [itinerary, onChange],
  );

  const addDay = useCallback(() => {
    const dayNumber = itinerary.length + 1;
    onChange({
      itinerary: [...itinerary, { day: dayNumber, title: `Hari ${dayNumber}`, description: "" }],
    });
  }, [itinerary, onChange]);

  const removeDay = useCallback(
    (index: number) => {
      const next = itinerary.filter((_, i) => i !== index);
      // Re-number days
      const renumbered = next.map((d, i) => ({ ...d, day: i + 1, title: d.title || `Hari ${i + 1}` }));
      onChange({ itinerary: renumbered });
    },
    [itinerary, onChange],
  );

  return (
    <Card>
      <CardHeader
        title="Itinerary"
        subheader="Rencana per hari (Hari 1, Hari 2, …). Tambah atau hapus hari sesuai kebutuhan."
      />
      <CardContent>
        <Grid container spacing={4}>
          {itinerary.map((day, index) => (
            <Grid key={index} size={{ xs: 12 }} className="repeater-item">
              <Card variant="outlined" sx={{ p: 2 }}>
                <div className="flex items-start justify-between gap-2 mbe-2">
                  <Typography variant="subtitle1" fontWeight="600">
                    Hari {day.day}
                  </Typography>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeDay(index)}
                    aria-label="Hapus hari"
                  >
                    <i className="ri-close-line" />
                  </IconButton>
                </div>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Judul (opsional)"
                      placeholder={`Hari ${day.day}`}
                      value={day.title ?? ""}
                      onChange={(e) => updateDay(index, { title: e.target.value })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      size="small"
                      label="Aktivitas / deskripsi"
                      placeholder="Contoh: Soekarno Hatta (CGK) – Jeddah (JED), lalu ke hotel Madinah dengan bus"
                      value={day.description ?? ""}
                      onChange={(e) => updateDay(index, { description: e.target.value })}
                    />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
          <Grid size={{ xs: 12 }}>
            <Button
              variant="contained"
              onClick={addDay}
              startIcon={<i className="ri-add-line" />}
            >
              Tambah hari
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PackageItinerary;
