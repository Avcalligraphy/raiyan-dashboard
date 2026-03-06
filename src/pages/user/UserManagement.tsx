// MUI Imports
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

// Type Imports

// Component Imports
import UserCards from "./UserCards";
import UserTables from "./UserTables";

const UserManagementPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4" className="mbe-1">
          Roles List
        </Typography>
        <Typography>
          A role provided access to predefined menus and features so that
          depending on assigned role an administrator can have access to what he
          need
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserCards />
      </Grid>
      <Grid size={{ xs: 12 }} className="!pbs-12">
        <Typography variant="h4" className="mbe-1">
          Total users with their roles
        </Typography>
        <Typography>
          Find all of your company&#39;s administrator accounts and their
          associate roles.
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserTables />
      </Grid>
    </Grid>
  );
};

export default UserManagementPage;
