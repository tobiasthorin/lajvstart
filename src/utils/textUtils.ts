import type { LARPEvent } from "../types/types"

export function escapeCharacters(text: string) {
  return text.replace(/\"/g, "&quot;")
}

export function prettifyURL(url: string) {
  return url
    .trim()
    .replace(/^https*:\/\//, "")
    .replace(/\/$/, "")
}

export function getLowestEventAgeLimit(event: LARPEvent) {
  return event.minimum_age ? `${event.minimum_age}+` : "Alla åldrar"
}
