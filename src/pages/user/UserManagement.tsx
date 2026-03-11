// MUI Imports
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

// Component Imports
import UserCards from "./UserCards";
import UserTables from "./UserTables";

const UserManagementPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mbe-1">
          User Management
        </Typography>
        <Typography>
          Manage users and roles for Rayyan CMS access. Each role has predefined
          permissions for menus and features.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserCards />
      </Grid>
      <Grid size={{ xs: 12 }} className="!pbs-12">
        <Typography variant="h4" className="mbe-1">
          Users
        </Typography>
        <Typography>
          List of all users and their assigned roles. Add, edit, or remove access.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserTables />
      </Grid>
    </Grid>
  );
};

export default UserManagementPage;
