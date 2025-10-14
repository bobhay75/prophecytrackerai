import { join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, '..');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizeCss: true
  }
};

export default nextConfig;
