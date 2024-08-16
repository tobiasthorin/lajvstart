import { supabase } from "./../lib/supabase"
import {
  useNamespace,
  EVENT_COLLECTIONS_CACHE,
  EVENTS_CACHE,
} from "../lib/cache"
import type { LARPEvent } from "../types/types"
import { log } from "../lib/logger"
import type { UserID } from "./userService"

export type EventID = LARPEvent["id"]

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

export async function getFavouriteEvents(userId: UserID) {
  const { data, error } = await supabase
    .from("events")
    .select("*, favourites!inner(event_id, user_id)")
    .order("date_start")

  // TODO: do this in query
  const filteredData = data?.filter((event) =>
    event.favourites.some((fav) => fav.user_id === userId)
  )

  // TODO: cache?

  return { data: filteredData, error }
}

export async function getEvent(eventId: LARPEvent["id"]) {
  let event = eventsCache.get(eventId)

  if (event) {
    return event
  } else {
    log(`Getting event ${eventId} from DB`)

    const { data, error } = await supabase
      .from("events")
      .select()
      .eq("id", eventId)
      .single()

    if (error) {
      throw new Error(error.message)
    } else {
      eventsCache.set(eventId, data, 1000 * 60 * 5)
    }

    return data
  }
}
