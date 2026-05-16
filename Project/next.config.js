/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
