import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // <-- Ensure this line is deleted
  
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
        hostname: 'eqktbcdigrfgaqnindmm.supabase.co', // It was 'l', now it is 'i'
        port: '',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
  },
};

export default nextConfig;