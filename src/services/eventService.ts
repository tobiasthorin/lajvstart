import { supabase } from "./../lib/supabase"
import {
  useNamespace,
  EVENT_COLLECTIONS_CACHE,
  EVENTS_CACHE,
  USER_EVENTS_CACHE,
} from "../lib/cache"
import type { LARPEvent } from "../types/types"
import { log } from "../lib/logger"
import type { UserID } from "./userService"

export type EventID = LARPEvent["id"]

const eventCollectionsCache = useNamespace<LARPEvent[]>(EVENT_COLLECTIONS_CACHE)
const eventsCache = useNamespace<LARPEvent>(EVENTS_CACHE)
const userEventsCache = useNamespace<LARPEvent[]>(USER_EVENTS_CACHE)

export async function getUpcomingEvents() {
  const eventsCache = useNamespace<LARPEvent[]>(EVENT_COLLECTIONS_CACHE)
  let events = eventsCache.get("upcoming")

  if (!events) {
    log("Getting events from DB")

    const { data, error } = await supabase
      .from("events")
      .select()
      .gte("date_start", new Date().toISOString())
      .order("date_start")

    if (error) throw new Error(error.message)

    eventCollectionsCache.set("upcoming", data, 1000 * 60 * 5)
    return data
  }

  return events
}

export async function getFilteredEvents({
  tags,
  minAge,
}: {
  tags?: string[]
  minAge?: number
}) {
  let query = supabase.from("events").select()

  if (tags && tags.length > 0) {
    query = query.overlaps("tags", tags)
  }

  if (minAge) {
    query = query.lte("minimum_age", minAge)
  }

  const { data, error } = await query
    .gte("date_start", new Date().toISOString())
    .order("date_start")

  if (error) throw new Error(error.message)

  return data
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

export async function getMyEvents(userId: UserID) {
  let events = userEventsCache.get(userId)

  if (events) {
    return events
  } else {
    log(`Getting events for user ${userId} from DB`)

    const { data, error } = await supabase
      .from("events")
      .select()
      .eq("owner_id", userId)

    if (error) {
      throw new Error(error.message)
    } else {
      userEventsCache.set(userId, data, 1000 * 60 * 5)
    }

    return data
  }
}
