import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tauri bundles the generated static files instead of running a Next.js
  // server in the desktop application. The desktop build wrapper sets this
  // flag after excluding server-only routes from the static build.
  ...(process.env.TAURI_DESKTOP_BUILD === "true" ? { output: "export" } : {}),
};

export default nextConfig;
