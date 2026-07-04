const nextConfig = {
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.smartkitchenandbath.com.au",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
