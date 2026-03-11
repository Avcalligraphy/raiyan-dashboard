import { useState, useEffect, useMemo } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";

// Service Imports
import { userService, roleService } from "@/services/userService";
import type { User, Role } from "@/types/userTypes";

type RoleCount = {
  role: Role;
  count: number;
};

const DUMMY_AVATARS = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png"];
const MAX_AVATARS_SHOW = 5;

const getDummyAvatarUrls = (count: number): string[] => {
  if (count <= 0) return [];
  const n = Math.min(count, MAX_AVATARS_SHOW);
  return Array.from({ length: n }, (_, i) => `/images/avatars/${DUMMY_AVATARS[i % DUMMY_AVATARS.length]}`);
};

const UserCards = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.list({ limit: 1000, offset: 0 }),
      roleService.list(),
    ])
      .then(([userList, roleList]) => {
        setUsers(userList ?? []);
        setRoles(roleList ?? []);
      })
      .catch(() => {
        setUsers([]);
        setRoles([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const roleCounts = useMemo<RoleCount[]>(() => {
    const map = new Map<string, number>();
    roles.forEach((r) => map.set(r.id, 0));
    users.forEach((u) => {
      const id = u.role_id ?? "";
      map.set(id, (map.get(id) ?? 0) + 1);
    });
    return roles.map((role) => ({
      role,
      count: map.get(role.id) ?? 0,
    }));
  }, [users, roles]);

  const noRoleCount = useMemo(() => {
    return users.filter((u) => !u.role_id).length;
  }, [users]);

  if (loading) {
    return (
      <Grid container spacing={6}>
        <Grid size={{ xs: 12 }}>
          <Typography color="text.secondary">Loading…</Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Typography color="text.secondary">Total users</Typography>
              <AvatarGroup max={MAX_AVATARS_SHOW} className="pull-up">
                {getDummyAvatarUrls(users.length).map((src, i) => (
                  <Avatar key={i} src={src} alt="" />
                ))}
              </AvatarGroup>
            </div>
            <Typography variant="h4">{users.length}</Typography>
            <Typography variant="body2" color="text.secondary">
              All users with access to Rayyan CMS
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      {roleCounts.map(({ role, count }) => (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={role.id}>
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Typography color="text.secondary">{role.name} role</Typography>
                <AvatarGroup max={MAX_AVATARS_SHOW} className="pull-up">
                  {getDummyAvatarUrls(count).map((src, i) => (
                    <Avatar key={i} src={src} alt="" />
                  ))}
                </AvatarGroup>
              </div>
              <Typography variant="h4">{count}</Typography>
              <Typography variant="body2" color="text.secondary">
                {role.description || `Users with role ${role.name}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {noRoleCount > 0 && (
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <Card>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <Typography color="text.secondary">No role</Typography>
                <AvatarGroup max={MAX_AVATARS_SHOW} className="pull-up">
                  {getDummyAvatarUrls(noRoleCount).map((src, i) => (
                    <Avatar key={i} src={src} alt="" />
                  ))}
                </AvatarGroup>
              </div>
              <Typography variant="h4">{noRoleCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                Users without an assigned role
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default UserCards;
