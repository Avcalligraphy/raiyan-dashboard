// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";

// Type Imports
import type { PackageFormState } from "@/types/packageTypes";

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
          type="number"
          label="Price (IDR)"
          placeholder="35000000"
          value={form.price || ""}
          onChange={(e) => onChange({ price: Number(e.target.value) || 0 })}
          className="mbe-5"
          inputProps={{ min: 0 }}
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
