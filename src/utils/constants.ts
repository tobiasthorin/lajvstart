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

export const isProd = import.meta.env.PROD;
export const isDev = import.meta.env.DEV_BUILD
export const isLocal = import.meta.env.DEV;
