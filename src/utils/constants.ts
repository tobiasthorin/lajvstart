export const eventTags = [
  "Blankvapen",
  "Bofferstrid",
  "Fantasy",
  "Historiskt",
  "Krig",
  "Misär",
  "Nordic LARP",
  "Pirat",
  "Post-apocalyps",
  "Sandbox",
  "Sci-fi",
  "Skräck",
  "Viking",
  "Zombie",
] as const

export const isDev = import.meta.env.DEV_BUILD
export const isProd = !isDev && import.meta.env.PROD
export const isLocal = import.meta.env.DEV

let baseURL = ""
if (isLocal) baseURL = "http://localhost:4321"
if (isDev) baseURL = "https://dev.lajvstart.se"
if (isProd) baseURL = "https://www.lajvstart.se"

export { baseURL }
