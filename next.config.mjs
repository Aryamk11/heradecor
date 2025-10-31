import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // <-- ADD THIS
  sassOptions: {
    includePaths: [
      path.join(process.cwd(), 'app/scss'),
      path.join(process.cwd(), 'node_modules')
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eqktbcdlgrfgaqnindmm.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
  },
};

export default nextConfig;