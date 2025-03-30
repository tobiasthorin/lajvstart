import type { EventDetailsSchema, EventPrices } from "../services/eventService"
import type { eventTags } from "../utils/constants"
import type { Database } from "./supabase"

export type LARPEvent = Database["public"]["Tables"]["events"]["Row"] & {
  details: EventDetailsSchema
  prices: EventPrices
}

export type EventTag = (typeof eventTags)[number]
