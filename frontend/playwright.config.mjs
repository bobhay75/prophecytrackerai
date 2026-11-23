import { defineConfig, devices } from '@playwright/test';
const local = process.env.PROPHECY_LOCAL_CHROMIUM === '1';
const launchOptions = local ? { executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] } : {};
export default defineConfig({
  testDir: './test/browser', timeout: 45000, retries: 0, workers: 1,
  use: { baseURL: 'http://127.0.0.1:8097', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'python3 ../backend/test/serve.py --port 8097', url: 'http://127.0.0.1:8097/prophecy/api/index.php?action=health', reuseExistingServer: false, timeout: 30000 },
  projects: [
    { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], launchOptions } },
    { name: 'android-chromium', use: { ...devices['Pixel 7'], launchOptions } },
    ...(!local ? [{ name: 'iphone-webkit', use: { ...devices['iPhone 13'] } }] : []),
  ],
});
