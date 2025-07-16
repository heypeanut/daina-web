/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['api', 'ui', 'utils', 'types'],
  experimental: {
    serverComponentsExternalPackages: [],
    externalDir: true,
  },
  devServer: {
    port: 3005,
  }
}

module.exports = nextConfig
