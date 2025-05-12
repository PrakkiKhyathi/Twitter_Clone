import {
  AccountCircle,
  Explore,
  Group,
  Home,
  Message,
} from "@mui/icons-material";

export const navigationMenu = [
  {
    title: "Home",
    icon: <Home />,
    path: "/home",
  },
  {
    title: "Explore",
    icon: <Explore />,
    path: "/home",
  },
  {
    title: "Notification",
    icon: <Notification />,
    path: "/home",
  },
  {
    title: "Messages",
    icon: <Message />,
    path: "/home",
  },
  { title: "Communities", icon: <Group />, path: "/home" },
  {
    title: "Profile",
    icon: <AccountCircle />,
    path: "/profile",
  },
];
