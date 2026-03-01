import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'link-a-imagen.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },

      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;