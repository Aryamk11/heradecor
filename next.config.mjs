import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [
      path.join(process.cwd(), 'app/scss'),
      path.join(process.cwd(), 'node_modules')
    ],
    // Bootstrap 5.3 still uses @import internally; silence the Dart Sass 3.0
    // deprecation spam so real warnings stay visible.
    silenceDeprecations: ['import', 'global-builtin', 'color-functions'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'eqktbcdigrfgaqnindmm.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Grid cards never render wider than ~400px; without this Next keeps a much
    // larger ladder and re-fetches 200KB originals from Supabase to build them.
    deviceSizes: [320, 420, 640, 828, 1080, 1200],
    imageSizes: [64, 96, 128, 256],
    // Originals are immutable (hashed filenames), so cache the optimised output
    // aggressively — each upstream fetch costs ~2s.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
};

export default nextConfig;
