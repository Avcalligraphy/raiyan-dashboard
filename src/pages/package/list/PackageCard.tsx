// MUI Imports
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

// Component Imports
import CustomAvatar from "@core/components/mui/Avatar";

// Type Imports
import type { Package } from "@/types/packageTypes";

type PackageCardProps = {
  total: number;
  packages: Package[];
  loading?: boolean;
};

const PackageCard = ({ total, packages, loading }: PackageCardProps) => {
  const published = packages.filter((p) => p.is_published).length;
  const draft = total - published;

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Grid container spacing={6}>
            {[1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 4 }} key={i}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  const items = [
    {
      title: "Total packages",
      value: String(total),
      icon: "ri-box-3-line",
    },
    {
      title: "Published",
      value: String(published),
      icon: "ri-checkbox-circle-line",
    },
    {
      title: "Draft",
      value: String(draft),
      icon: "ri-draft-line",
    },
  ];

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 4 }} key={index}>
              <div className="flex items-center gap-4">
                <CustomAvatar variant="rounded" size={44} skin="light" color="primary">
                  <i className={`${item.icon} text-[28px]`} />
                </CustomAvatar>
                <div>
                  <Typography color="text.secondary">{item.title}</Typography>
                  <Typography variant="h5">{item.value}</Typography>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PackageCard;
