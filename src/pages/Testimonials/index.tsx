import Grid from "@mui/material/Grid2";
import TestimonialsTable from "./TestimonialsTable";
import TotalTestimonials from "./TotalTestimonials";
import TestimonialsStatistics from "./TestimonialsStatistics";

const TestimonialsPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TotalTestimonials />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TestimonialsStatistics />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TestimonialsTable />
      </Grid>
    </Grid>
  );
};

export default TestimonialsPage;
