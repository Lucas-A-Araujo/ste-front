import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("presentation/routes/home.tsx"),
  route("person/:id", "presentation/routes/person.$id.tsx"),
] satisfies RouteConfig;
