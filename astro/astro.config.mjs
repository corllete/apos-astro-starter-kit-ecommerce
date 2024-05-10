import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import apostrophe from "@apostrophecms/apostrophe-astro";
import astroI18next from "astro-i18next";
import tailwind from "@astrojs/tailwind";


// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  props: {
    test: true
  },
  integrations: [
    apostrophe({
      aposHost: "http://localhost:3000",
      widgetsMapping: "./src/widgets",
      templatesMapping: "./src/templates",
      forwardHeaders: [
        "content-security-policy",
        "strict-transport-security",
        "x-frame-options",
        "referrer-policy",
        "cache-control",
        "host",
      ],
    }),
    astroI18next(),
    tailwind({
      applyBaseStyles: false,
      nesting: true,
    }),
  ],
  vite: {
    ssr: {
      // Do not externalize the @apostrophecms/apostrophe-astro plugin, we need
      // to be able to use virtual: URLs there
      noExternal: ["@apostrophecms/apostrophe-astro"],
    },
  },
});
