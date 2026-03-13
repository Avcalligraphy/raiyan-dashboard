// MUI Imports
import Grid from "@mui/material/Grid2";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";

// Third-party Imports
import classnames from "classnames";

// Component Imports
import CustomAvatar from "@core/components/mui/Avatar";

type PostCardProps = {
  stats: {
    total: number;
    draft: number;
    published: number;
    scheduled: number;
  };
  loading?: boolean;
};

const PostCard = ({ stats, loading }: PostCardProps) => {
  const isBelowMdScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md"),
  );
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );

  const data = [
    {
      title: "Total Posts",
      value: String(stats.total),
      icon: "ri-article-line",
      desc: "All posts",
    },
    {
      title: "Draft",
      value: String(stats.draft),
      icon: "ri-draft-line",
      desc: "Draft",
    },
    {
      title: "Published",
      value: String(stats.published),
      icon: "ri-checkbox-circle-line",
      desc: "Published",
    },
    {
      title: "Scheduled",
      value: String(stats.scheduled),
      icon: "ri-calendar-schedule-line",
      desc: "Scheduled",
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography color="text.secondary">Loading stats…</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={6}>
          {data.map((item, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 3 }}
              key={item.title}
              className={classnames({
                "[&:nth-of-type(odd)>div]:pie-6 [&:nth-of-type(odd)>div]:border-ie":
                  isBelowMdScreen && !isSmallScreen,
                "[&:not(:last-child)>div]:pie-6 [&:not(:last-child)>div]:border-ie":
                  !isBelowMdScreen,
              })}
            >
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <Typography color="text.secondary">{item.title}</Typography>
                    <Typography variant="h4">{item.value}</Typography>
                  </div>
                  <CustomAvatar variant="rounded" size={44}>
                    <i className={classnames(item.icon, "text-[28px]")} />
                  </CustomAvatar>
                </div>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
                {isBelowMdScreen &&
                  !isSmallScreen &&
                  index < data.length - 2 && (
                    <Divider
                      className={classnames("mbs-6", {
                        "mie-6": index % 2 === 0,
                      })}
                    />
                  )}
                {isSmallScreen && index < data.length - 1 && (
                  <Divider className="mbs-6" />
                )}
              </div>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PostCard;
