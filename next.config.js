/** @type {import('next').NextConfig} */
const nextConfig = {

  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack(config) {

    return config;
  },
};

module.exports = nextConfig;