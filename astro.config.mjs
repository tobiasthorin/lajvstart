import { defineConfig } from "astro/config"
import netlify from "@astrojs/netlify"

import tailwind from "@astrojs/tailwind"

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: netlify(),
  integrations: [tailwind({ applyBaseStyles: false }), alpinejs()],
})