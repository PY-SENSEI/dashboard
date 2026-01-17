import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("leads", "routes/leads.tsx"),
  route("leads/:id", "routes/leads.$id.tsx"),
] satisfies RouteConfig;
