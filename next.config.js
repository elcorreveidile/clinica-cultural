/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Prisma 7 generates the client into ./generated/prisma; make sure it is
  // treated as an external package on the server runtime.
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '.prisma/client'],
  },
};

module.exports = nextConfig;
