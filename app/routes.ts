import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default ([
  index("routes/home.tsx"),
  route("/all-budgets", "all-budgets/index.tsx"),
  route("/budget/:id", "budget-detail/index.tsx"),
]) satisfies RouteConfig;
