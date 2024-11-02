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
import { z } from "zod"

export type EventID = LARPEvent["id"]

const eventCollectionsCache = useNamespace<LARPEvent[]>(EVENT_COLLECTIONS_CACHE)
const eventsCache = useNamespace<LARPEvent>(EVENTS_CACHE)
const userEventsCache = useNamespace<LARPEvent[]>(USER_EVENTS_CACHE)

export const detailsTypeEnum = z.enum([
  "textShort",
  "textLong",
  "number",
  "checkbox",
  "multiChoice",
  "multiChoiceMultiValue",
])

const eventDetailSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  type: detailsTypeEnum,
  options: z.array(z.string()).optional(),
})

export const eventDetailsSchema = z.array(eventDetailSchema)

export type EventDetailsSchema = z.infer<typeof eventDetailsSchema>
export type EventDetailsType = z.infer<typeof detailsTypeEnum>
export type EventDetail = z.infer<typeof eventDetailSchema>

export async function getUpcomingEvents() {
  const eventsCache = useNamespace<LARPEvent[]>(EVENT_COLLECTIONS_CACHE)
  let events = eventsCache.get("upcoming")

  if (!events) {
    log("Getting events from DB")

    const { data, error } = await supabase
      .from("events")
      .select()
      .gte("date_start", new Date().toISOString())
      .eq("is_published", true)
      .order("date_start")

    if (error) throw new Error(error.message)

    const parsedData = data.map((d) => ({
      ...d,
      details: eventDetailsSchema.parse(d.details),
    }))

    eventCollectionsCache.set("upcoming", parsedData, 1000 * 60 * 5)
    return parsedData
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
    .eq("is_published", true)
    .order("date_start")

  if (error) throw new Error(error.message)

  return data
}

export async function getFavouriteEvents(userId: UserID) {
  const { data, error } = await supabase
    .from("events")
    .select("*, favourites!inner(event_id, user_id)")
    .eq("is_published", true)
    .order("date_start")

  // TODO: do this in query
  const filteredData = data?.filter((event) =>
    event.favourites.some((fav) => fav.user_id === userId),
  )

  // TODO: cache?

  return { data: filteredData, error }
}

export async function getEvent(eventId: LARPEvent["id"]) {
  let event = eventsCache.get(eventId)

  if (event) {
    const parsedData = {
      ...event,
      details: eventDetailsSchema.parse(event.details),
    }
    return parsedData
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
      const parsedData = {
        ...data,
        details: eventDetailsSchema.parse(data.details),
      }

      eventsCache.set(eventId, parsedData, 1000 * 60 * 5)
      return parsedData
    }
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
      const parsedData = data.map((d) => ({
        ...d,
        details: eventDetailsSchema.parse(d.details),
      }))

      userEventsCache.set(userId, parsedData, 1000 * 60 * 5)
      return parsedData
    }
  }
}

export async function createEvent({
  id,
  name,
  description,
  description_short,
  date_start,
  date_end,
  date_signup,
  location_name,
  event_image_url,
  tags,
  is_beginner_friendly,
  minimum_age,
  maximum_participants,
  location_latitude,
  location_longitude,
  display_mode,
  price,
}: Omit<LARPEvent, "owner_id" | "created_at">) {
  const { error: createEventError } = await supabase.from("events").insert({
    id,
    name,
    description,
    description_short,
    date_start,
    date_end,
    date_signup,
    location_name,
    event_image_url,
    tags: tags,
    is_beginner_friendly,
    minimum_age,
    maximum_participants,
    location_latitude,
    location_longitude,
    display_mode,
    price,
  })

  if (createEventError) throw new Error(createEventError.message)

  eventsCache.clear()
  userEventsCache.clear()
}

export async function updateEvent({
  id,
  name,
  description,
  description_short,
  date_start,
  date_end,
  date_signup,
  location_name,
  event_image_url,
  tags,
  is_beginner_friendly,
  minimum_age,
  maximum_participants,
  location_latitude,
  location_longitude,
  display_mode,
  price,
  is_published,
}: { id: EventID } & Partial<LARPEvent>) {
  const event = await getEvent(id)

  const { error: updateEventError, data } = await supabase
    .from("events")
    .update({
      name: name ?? event.name,
      description: description ?? event.description,
      description_short: description_short ?? event.description_short,
      date_start: date_start ?? event.date_start,
      date_end: date_end ?? event.date_end,
      date_signup: date_signup ?? event.date_signup,
      location_name: location_name ?? event.location_name,
      event_image_url: event_image_url ?? event.event_image_url,
      tags: tags ?? event.tags,
      is_beginner_friendly: is_beginner_friendly ?? event.is_beginner_friendly,
      minimum_age: minimum_age ?? event.minimum_age,
      maximum_participants: maximum_participants ?? event.maximum_participants,
      location_latitude: location_latitude ?? event.location_latitude,
      location_longitude: location_longitude ?? event.location_longitude,
      display_mode: display_mode ?? event.display_mode,
      price: price ?? event.price,
      is_published: is_published ?? event.is_published,
    })
    .eq("id", id)
    .select()
    .single()

  if (updateEventError || data === null)
    throw new Error(updateEventError?.message ?? "Data is null")

  eventsCache.clear()
  userEventsCache.clear()

  return data
}
