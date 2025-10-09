import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/all-budgets", "all-budgets/index.tsx"),
  route("/visualization", "visualization/index.tsx"),
  route("/collaboration", "routes/collaboration.tsx"),
  route("/budget/:id", "budget-detail/index.tsx"),
  route("/visualization/legislator/:id", "visualization/legislator/index.tsx"),
] satisfies RouteConfig;
