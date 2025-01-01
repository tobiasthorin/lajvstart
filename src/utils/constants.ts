export const eventTags = [
  "Boffer combat",
  "Fantasy",
  "Historical",
  "Horror",
  "Misery",
  "Nordic LARP",
  "Pirate",
  "Post-apocalyptic",
  "Sandbox",
  "Sci-fi",
  "Steel weapons",
  "Viking",
  "War",
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
