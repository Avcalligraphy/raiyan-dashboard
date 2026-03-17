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
import { hotelService, type Hotel } from "@/services/hotelService";

// Type Imports
import type { PackageFormState } from "@/types/packageTypes";

type PackageHotelsProps = {
  form: Pick<PackageFormState, "hotels">;
  onChange: (patch: Partial<PackageFormState>) => void;
};

const PackageHotels = ({ form, onChange }: PackageHotelsProps) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedHotels = form.hotels ?? [];

  useEffect(() => {
    let cancelled = false;
    hotelService
      .list()
      .then((list) => {
        if (!cancelled) setHotels(list ?? []);
      })
      .catch(() => {
        if (!cancelled) setHotels([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getByType = (type: "makkah" | "madinah") =>
    selectedHotels.find((h) => h.hotel_type === type)?.hotel_id ?? "";

  const handleChange = useCallback(
    (hotelType: "makkah" | "madinah", hotelId: string) => {
      const rest = selectedHotels.filter((h) => h.hotel_type !== hotelType);
      const next = hotelId
        ? [...rest, { hotel_id: hotelId, hotel_type: hotelType }]
        : rest;
      onChange({ hotels: next });
    },
    [selectedHotels, onChange],
  );

  const makkahHotels = hotels.filter(
    (h) => h.city.toLowerCase() === "makkah" || h.city.toLowerCase() === "mekah",
  );
  const madinahHotels = hotels.filter(
    (h) => h.city.toLowerCase() === "madinah" || h.city.toLowerCase() === "madina",
  );

  return (
    <Card>
      <CardHeader
        title="Hotels"
        subheader="Pilih hotel Makkah dan Madinah untuk paket ini (opsional)."
      />
      <CardContent>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading hotels…
          </Typography>
        ) : (
          <div className="flex flex-col gap-4">
            <FormControl fullWidth size="small">
              <InputLabel id="hotel-makkah-label" shrink>
                Hotel Makkah
              </InputLabel>
              <Select
                labelId="hotel-makkah-label"
                label="Hotel Makkah"
                value={getByType("makkah")}
                onChange={(e) => handleChange("makkah", e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {makkahHotels.map((h) => (
                  <MenuItem key={h.id} value={h.id}>
                    {h.name} {h.star_rating ? `(${h.star_rating}★)` : ""}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel id="hotel-madinah-label" shrink>
                Hotel Madinah
              </InputLabel>
              <Select
                labelId="hotel-madinah-label"
                label="Hotel Madinah"
                value={getByType("madinah")}
                onChange={(e) => handleChange("madinah", e.target.value)}
                displayEmpty
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {madinahHotels.map((h) => (
                  <MenuItem key={h.id} value={h.id}>
                    {h.name} {h.star_rating ? `(${h.star_rating}★)` : ""}
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

export default PackageHotels;
