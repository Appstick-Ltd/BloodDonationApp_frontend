/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin/login",
        destination: "/mc-portal/auth",
        permanent: true,
      },
      {
        source: "/admin/dashboard",
        destination: "/mc-portal/dashboard",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

