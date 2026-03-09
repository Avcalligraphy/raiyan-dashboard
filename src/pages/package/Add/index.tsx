// React Imports
import { useState, useCallback } from "react";

// React Router Imports
import { useNavigate } from "react-router-dom";

// MUI Imports
import Grid from "@mui/material/Grid2";

// Component Imports
import PackageAddHeader from "./PackageAddHeader";
import PackageInformation from "./PackageInformation";
import PackageImage from "./PackageImage";
import PackageDepartures from "./PackageDepartures";
import PackagePricing from "./PackagePricing";

// Service Imports
import { packageService } from "@/services/packageService";

// Type Imports
import {
  initialPackageFormState,
  type PackageFormState,
} from "@/types/packageTypes";

const PackageAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<PackageFormState>(initialPackageFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onChange = useCallback((patch: Partial<PackageFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setSubmitError(null);
  }, []);

  const buildPayload = useCallback(
    (is_published: boolean) => ({
      name: form.name.trim(),
      category: form.category,
      price: form.price,
      duration_days: form.duration_days,
      itinerary: form.itinerary || "",
      status: form.status,
      badge: form.badge.trim(),
      slug: form.slug.trim(),
      is_published,
      meta_title: form.meta_title.trim() || undefined,
      meta_description: form.meta_description.trim() || undefined,
      thumbnail_url: form.thumbnail_url.trim() || undefined,
      departures:
        form.departures.filter(
          (d) => d.departure_date && d.quota >= 0 && d.remaining_quota >= 0,
        ).length > 0
          ? form.departures.map((d) => ({
              departure_date: d.departure_date,
              quota: d.quota,
              remaining_quota: d.remaining_quota,
            }))
          : undefined,
      gallery:
        form.gallery.filter((g) => g.media_url.trim()).length > 0
          ? form.gallery.map((g) => ({ media_url: g.media_url.trim() }))
          : undefined,
    }),
    [form],
  );

  const submit = useCallback(
    async (is_published: boolean) => {
      if (!form.name.trim() || !form.slug.trim()) {
        setSubmitError("Name and slug are required.");
        return;
      }
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const payload = buildPayload(is_published);
        await packageService.create(payload);
        navigate("/package/list", { replace: true });
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Failed to create package.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [form.name, form.slug, buildPayload, navigate],
  );

  const handleDiscard = useCallback(() => {
    setForm(initialPackageFormState);
    setSubmitError(null);
    navigate("/package/list");
  }, [navigate]);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <PackageAddHeader
          title="Add package"
          subtitle="Create a new Umrah package"
          onDiscard={handleDiscard}
          onSaveDraft={() => submit(false)}
          onPublish={() => submit(true)}
          isSubmitting={isSubmitting}
        />
        {submitError && (
          <div className="mt-4 p-4 rounded bg-error/10 text-error">
            {submitError}
          </div>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <PackageInformation form={form} onChange={onChange} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <PackageImage form={form} onChange={onChange} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <PackageDepartures form={form} onChange={onChange} />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <PackagePricing form={form} onChange={onChange} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PackageAdd;
