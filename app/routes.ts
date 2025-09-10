import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/all-budgets", "all-budgets/index.tsx"),
] satisfies RouteConfig;
