const log = require("debug")("synpress:config");
import synpressPlugins from "@synthetixio/synpress/plugins";
import { defineConfig } from "cypress";

const synpressPath = "@synthetixio/synpress";
log(`Detected synpress root path is: ${synpressPath}`);
const pluginsPath = `${synpressPath}/plugins/index`;
log(`Detected synpress plugin path is: ${pluginsPath}`);

const fixturesFolder = `tests/e2e/fixtures`;
log(`Detected synpress fixtures path is: ${fixturesFolder}`);
const supportFile = "tests/e2e/support/index.ts";

export default defineConfig({
  userAgent: "synpress",
  retries: {
    runMode: process.env.CI ? 1 : 0,
    openMode: 0,
  },
  fixturesFolder,
  screenshotsFolder: "tests/e2e/screenshots",
  videosFolder: "tests/e2e/videos",
  chromeWebSecurity: true,
  viewportWidth: 1920,
  viewportHeight: 1080,
  env: {
    coverage: false,
  },
  defaultCommandTimeout: process.env.SYNDEBUG ? 9999999 : 30000,
  pageLoadTimeout: process.env.SYNDEBUG ? 9999999 : 30000,
  requestTimeout: process.env.SYNDEBUG ? 9999999 : 30000,
  e2e: {
    testIsolation: false,
    setupNodeEvents(on, config) {
      synpressPlugins(on, config);
    },
    baseUrl: process.env.NEXT_PUBLIC_APP_URL,
    specPattern: "tests/e2e/specs/**/*.{js,jsx,ts,tsx}",
    supportFile,
    env: {
      apiUrl: process.env.NEXT_PUBLIC_HBP_URL,
      graphQlUrl: process.env.NEXT_PUBLIC_HASURA_URL,
      // metamask environment variables
      privateKey: process.env.SECRET_WORDS,
      network: process.env.NETWORK_NAME,
    },
  },
  component: {
    setupNodeEvents(on, config) {
      synpressPlugins(on, config);
    },
    specPattern: "./**/*spec.{js,jsx,ts,tsx}",
    supportFile,
  },
});
