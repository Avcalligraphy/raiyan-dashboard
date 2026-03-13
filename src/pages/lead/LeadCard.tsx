// MUI Imports
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

// Component Imports
import CustomAvatar from "@core/components/mui/Avatar";

// Type Imports
import type { Lead } from "@/types/leadTypes";

type LeadCardProps = {
  total: number;
  leads: Lead[];
  loading?: boolean;
};

const LeadCard = ({ total, leads, loading }: LeadCardProps) => {
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Grid container spacing={6}>
            {[1, 2, 3, 4].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  const list = leads ?? [];
  const newCount = list.filter((p) => p.status === "New").length;
  const contactedCount = list.filter((p) => p.status === "Contacted").length;
  const otherCount = total - newCount - contactedCount;

  const displayItems = [
    { title: "Total leads", value: String(total), icon: "ri-group-line" },
    { title: "New", value: String(newCount), icon: "ri-user-add-line" },
    { title: "Contacted", value: String(contactedCount), icon: "ri-phone-line" },
    { title: "Follow up & closing", value: String(otherCount), icon: "ri-repeat-line" },
  ];

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {displayItems.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.title}>
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

export default LeadCard;
