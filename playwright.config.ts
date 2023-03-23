import { PlaywrightTestConfig, defineConfig } from '@playwright/test';

const config: PlaywrightTestConfig = defineConfig({
  testDir: './tests',
});
export default config;
