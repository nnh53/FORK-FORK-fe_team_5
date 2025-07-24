import { nxE2EPreset } from "@nx/cypress/plugins/cypress-preset.js";
import { defineConfig } from "cypress";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import config from "./vite.config.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname, {
      cypressDir: "src",
      bundler: "vite",
      webServerCommands: {
        default: "pnpm exec nx run @fcinema-workspace/fe-react-app:dev",
        production: "pnpm exec nx run @fcinema-workspace/fe-react-app:preview",
      },
      ciWebServerCommand: "pnpm exec nx run @fcinema-workspace/fe-react-app:preview",
      ciBaseUrl: "http://localhost:5173",
    }),
    baseUrl: "http://localhost:5173",
    specPattern: ["./test/src/e2e/*.cy.{ts,tsx}"],
    supportFile: "./test/src/support/e2e.{ts,tsx}",
  },

  // component: nxComponentTestingPreset(__filename, {
  //   bundler: "vite",
  //   buildTarget: "@fcinema-workspace/fe-react-app:build",
  // }),
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      // viteConfig: {
      //   ...config,
      // },
    },
    specPattern: ["./src/**/*.cy.{ts,tsx}"],
    // supportFile: "./test/src/support/component.{js,jsx,ts,tsx}",
  },
});
