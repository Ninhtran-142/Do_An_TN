/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ["gateway.pinata.cloud"],
      formats: ["image/webp"],
    },
    };

export default nextConfig;
