export const eventTags = [
  "Bar",
  "Blankvapen",
  "Bofferstrid",
  "Fantasy",
  "Fokus barn",
  "Fokus ungdomar",
  "Historiskt",
  "Krig",
  "Misär",
  "Nordic LARP",
  "Ockult",
  "Pirat",
  "Post-apocalypse",
  "Relationer",
  "Sandbox",
  "Sci-fi",
  "Skräck",
  "Vampyr",
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
