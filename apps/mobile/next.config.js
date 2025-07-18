/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['api', 'ui', 'utils', 'types'],
  serverExternalPackages: [],
  experimental: {
    externalDir: true,
  },
  images: {
    domains: ['img.goooy.cn', 'picsum.photos', 'nahuo-imges.oss-cn-shenzhen.aliyuncs.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
