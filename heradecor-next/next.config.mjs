import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  sassOptions: {
    includePaths: [
      path.join(process.cwd(), 'app/scss'), // Point directly to your SCSS folder
      path.join(process.cwd(), 'node_modules')
    ],
  },
};

export default nextConfig;