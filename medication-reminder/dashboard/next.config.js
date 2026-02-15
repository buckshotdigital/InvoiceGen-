const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', '@supabase/supabase-js', 'date-fns'],
  },
};
module.exports = nextConfig;
