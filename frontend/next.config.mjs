import { fileURLToPath } from 'node:url';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
if (basePath && !/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(basePath)) throw new Error('NEXT_PUBLIC_BASE_PATH must be a clean absolute path without a trailing slash.');
const nextConfig = {
  basePath,
  reactStrictMode: true,
  output: 'export',
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
};
export default nextConfig;
