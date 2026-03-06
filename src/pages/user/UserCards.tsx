"use client";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import AvatarGroup from "@mui/material/AvatarGroup";
import IconButton from "@mui/material/IconButton";

// Component Imports
import CustomAvatar from "@core/components/mui/Avatar";

type CardDataType = {
  title: string;
  avatars: string[];
  totalUsers: number;
};

// Vars
const cardData: CardDataType[] = [
  {
    totalUsers: 4,
    title: "Administrator",
    avatars: ["1.png", "2.png", "3.png", "4.png"],
  },
  { totalUsers: 7, title: "Editor", avatars: ["5.png", "6.png", "7.png"] },
  { totalUsers: 5, title: "Users", avatars: ["4.png", "5.png", "6.png"] },
  { totalUsers: 6, title: "Support", avatars: ["1.png", "2.png", "3.png"] },
  {
    totalUsers: 10,
    title: "Restricted User",
    avatars: ["4.png", "5.png", "6.png"],
  },
];

const UserCards = () => {
  // Vars

  return (
    <>
      <Grid container spacing={6}>
        {cardData.map((item, index) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
            <Card>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Typography className="flex-grow">{`Total ${item.totalUsers} users`}</Typography>
                  <AvatarGroup total={item.totalUsers}>
                    {item.avatars.map((img, index: number) => (
                      <CustomAvatar
                        key={index}
                        alt={item.title}
                        src={`/images/avatars/${img}`}
                        size={40}
                      />
                    ))}
                  </AvatarGroup>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-start gap-1">
                    <Typography variant="h5">{item.title}</Typography>
                  </div>
                  <IconButton>
                    <i className="ri-file-copy-line text-secondary" />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default UserCards;
