import { nxE2EPreset } from "@nx/cypress/plugins/cypress-preset.js";
import { defineConfig } from "cypress";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
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
    specPattern: ["./cypress/e2e/*.cy.{js,jsx,ts,tsx}"],
    supportFile: "./test/src/support/e2e.{js,jsx,ts,tsx}",
  },

  // component: nxComponentTestingPreset(__filename, {
  //   bundler: "vite",
  //   buildTarget: "@fcinema-workspace/fe-react-app:build",
  // })
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      // viteConfig: {
      //   ...config,
      // },
    },
    specPattern: ["./cypress/component/*.cy.{js,jsx,ts,tsx}"],
  },
});
