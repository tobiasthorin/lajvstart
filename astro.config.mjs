import alpinejs from "@astrojs/alpinejs"
import netlify from "@astrojs/netlify"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  integrations: [tailwind({ applyBaseStyles: false }), alpinejs()],
  output: "server",
})
