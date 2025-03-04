import { type RouteConfig, index, route } from "@react-router/dev/routes"

export default [index("routes/home.tsx"), route("/listen", "routes/listen.ts")] satisfies RouteConfig
