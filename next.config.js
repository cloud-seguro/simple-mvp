/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config) => {
    // This is needed for the MDXRemote component to work with async imports
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  },
  // Add transpilePackages for MDX
  transpilePackages: ["next-mdx-remote"],
  // Enable standalone output for Docker deployment
  output: "standalone"
  // ... other config options
};

module.exports = nextConfig;
