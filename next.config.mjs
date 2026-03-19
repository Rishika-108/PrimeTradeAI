/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required configuration for minimal Docker deployment sizes mapping 10x smaller container images
  output: "standalone",
};

export default nextConfig;
