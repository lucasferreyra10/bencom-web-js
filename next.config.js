/** @type {import('next').nextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'spvcxzfmitsqdjerqabx.supabase.co',
      },
    ],
  },
}