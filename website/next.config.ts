import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/koin-deck-retro-player', // Remove when using koin.js.org
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
