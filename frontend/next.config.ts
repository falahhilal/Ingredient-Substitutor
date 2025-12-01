import type { NextConfig } from "next";

/*const nextConfig: NextConfig = {
  /* config options here */
};

//export default nextConfig; */

// next.config.js
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
export default nextConfig; 
