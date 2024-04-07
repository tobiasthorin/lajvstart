import { supabase } from "./../lib/supabase"
import {
  useNamespace,
  EVENT_COLLECTIONS_CACHE,
  EVENTS_CACHE,
} from "../lib/cache"
import type { LARPEvent } from "../types/types"

const eventCollectionsCache = useNamespace<LARPEvent[]>(EVENT_COLLECTIONS_CACHE)
const eventsCache = useNamespace<LARPEvent>(EVENTS_CACHE)

export async function getUpcomingEvents() {
  const { data, error } = await supabase
    .from("events")
    .select()
    .gte("date_start", new Date().toISOString())
    .order("date_start")

  if (!error) eventCollectionsCache.set("upcoming", data, 1000 * 60 * 5)

  return { data, error }
}

export async function getEvent(eventId: LARPEvent["id"]) {
  const { data, error } = await supabase
    .from("events")
    .select()
    .eq("id", eventId)
    .single()

  if (!error) eventsCache.set(eventId, data, 1000 * 60 * 5)

  return { data, error }
}
