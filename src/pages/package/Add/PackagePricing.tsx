// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

// Type Imports
import type { PackageFormState } from "@/types/packageTypes";

function formatRupiah(num: number): string {
  if (!num && num !== 0) return "";
  return new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function parseRupiahInput(value: string): number {
  const digits = value.replace(/\D/g, "");
  return digits === "" ? 0 : Number(digits);
}

type PackagePricingProps = {
  form: Pick<PackageFormState, "price" | "duration_days">;
  onChange: (patch: Partial<PackageFormState>) => void;
};

const PackagePricing = ({ form, onChange }: PackagePricingProps) => {
  return (
    <Card>
      <CardHeader title="Pricing" />
      <CardContent>
        <TextField
          fullWidth
          type="text"
          inputMode="numeric"
          label="Harga"
          placeholder="35.000.000"
          value={form.price ? formatRupiah(form.price) : ""}
          onChange={(e) => onChange({ price: parseRupiahInput(e.target.value) })}
          className="mbe-5"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Rp</InputAdornment>
            ),
          }}
          inputProps={{ "aria-label": "Harga dalam Rupiah" }}
        />
        <TextField
          fullWidth
          type="number"
          label="Duration (days)"
          placeholder="9"
          value={form.duration_days || ""}
          onChange={(e) => onChange({ duration_days: Number(e.target.value) || 0 })}
          inputProps={{ min: 1 }}
        />
      </CardContent>
    </Card>
  );
};

export default PackagePricing;
