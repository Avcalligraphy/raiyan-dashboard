import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import TestimonialsTable from "./TestimonialsTable";
import TotalTestimonials from "./TotalTestimonials";
import TestimonialsStatistics from "./TestimonialsStatistics";
import { testimonialService } from "@/services/testimonialService";
import type { Testimonial } from "@/types/testimonialTypes";

const TestimonialsPage = () => {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await testimonialService.list({ limit: 500, offset: 0 });
      setData(res.data ?? []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TotalTestimonials />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TestimonialsStatistics />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TestimonialsTable
          data={data}
          loading={loading}
          onRefetch={fetchTestimonials}
        />
      </Grid>
    </Grid>
  );
};

export default TestimonialsPage;
