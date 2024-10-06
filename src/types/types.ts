import type { eventTags } from "../utils/constants"
import type { Database } from "./supabase"

export type LARPEvent = Database["public"]["Tables"]["events"]["Row"]

export type EventTag = (typeof eventTags)[number]
