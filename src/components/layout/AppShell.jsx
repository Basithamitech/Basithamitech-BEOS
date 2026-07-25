import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";

import {
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  APP_NAME,
  BUILD_LABEL,
  DRAWER_WIDTH,
  GOLD,
  navigationItems
} from "../../app/config";

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh"
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "#101010",
            color: "#FFFFFF",
            borderRight: 0
          }
        }}
      >
        <Box
          sx={{
            padding: 3,
            borderBottom: "1px solid #333333"
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: GOLD
            }}
          >
            BASITHAMI
          </Typography>

          <Typography fontWeight={800}>
            Enterprise Operating System
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "#BBBBBB"
            }}
          >
            {BUILD_LABEL}
          </Typography>
        </Box>

        <List
          sx={{
            paddingX: 1.5,
            paddingY: 2
          }}
        >
          {navigationItems.map(([label, path]) => {
            const selected =
              location.pathname === path ||
              (
                path !== "/dashboard" &&
                location.pathname.startsWith(path)
              );

            return (
              <ListItemButton
                key={path}
                selected={selected}
                onClick={() => navigate(path)}
                sx={{
                  marginBottom: 0.75,
                  borderRadius: 3,

                  "&.Mui-selected": {
                    backgroundColor: GOLD,
                    color: "#111111"
                  },

                  "&.Mui-selected:hover": {
                    backgroundColor: GOLD
                  }
                }}
              >
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{
                    fontWeight: 800
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0
        }}
      >
        <AppBar
          position="sticky"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: "1px solid #E5E7EB"
          }}
        >
          <Toolbar>
            <Typography
              fontWeight={900}
              sx={{
                flexGrow: 1
              }}
            >
              {APP_NAME}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: GOLD,
                marginRight: 2,
                fontWeight: 900
              }}
            >
              GLOBAL SEARCH
            </Typography>

            <Avatar
              sx={{
                backgroundColor: GOLD,
                color: "#111111",
                fontWeight: 900
              }}
            >
              PG
            </Avatar>
          </Toolbar>
        </AppBar>

        <Outlet />
      </Box>
    </Box>
  );
}
