/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      dropShadow: {
        hard: [
          "1px 1px 1px rgba(0, 0, 0, 0.8)",
          "2px 2px 0px rgba(0, 0, 0, 0.8)",
        ],
      },
      gridTemplateColumns: {
        events: "repeat(auto-fill, minmax(300px, 1fr))",
      },
    },
    fontFamily: { display: ["Londrina Solid", "serif"] },
  },
  plugins: [require("flowbite/plugin")],
}
