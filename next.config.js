/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/bencom-web-js',
  assetPrefix: '/bencom-web-js/',
  output: 'export', // Para que next export funcione bien con next 13+
};

module.exports = nextConfig;
