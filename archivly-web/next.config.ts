import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // A stray lockfile in the user's home directory makes Next.js misdetect
  // the workspace root -- pin it explicitly to this project.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
