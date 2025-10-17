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
import type { Database } from "../types/supabase"
import { v4 as uuidv4 } from "uuid"

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
  autofillWith: z.enum(["characterName", "characterDescription"]).optional(),
  autofillWithName: z
    .enum(["Character name", "Character description"])
    .optional(),
})

const eventPriceSchema = z.object({
  price: z.number(),
  description: z.string(),
})

export const eventDetailsSchema = z.array(eventDetailSchema)
export const eventPricesSchema = z.array(eventPriceSchema).nullable()

export type EventDetailsSchema = z.infer<typeof eventDetailsSchema>
export type EventDetailsType = z.infer<typeof detailsTypeEnum>
export type EventDetail = z.infer<typeof eventDetailSchema>

export type EventPrice = z.infer<typeof eventPriceSchema>
export type EventPrices = z.infer<typeof eventPricesSchema>

function mapDataToEvent(
  data: Database["public"]["Tables"]["events"]["Row"],
): LARPEvent {
  return {
    ...data,
    details: eventDetailsSchema.parse(data.details),
    prices: eventPricesSchema.parse(data.prices),
  }
}

export async function getUpcomingEvents() {
  const eventsCache = useNamespace<LARPEvent[]>(EVENT_COLLECTIONS_CACHE)
  let events = eventsCache.get("upcoming")

  if (!events) {
    console.log("Getting events from DB")

    const { data, error } = await supabase
      .from("events")
      .select()
      .eq("deleted", false)
      .gte("date_start", new Date().toISOString())
      .eq("is_published", true)
      .order("date_start")

    if (error) throw new Error(error.message)

    const parsedData = data.map(mapDataToEvent)

    eventCollectionsCache.set("upcoming", parsedData, 1000 * 60 * 60)
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
  let query = supabase.from("events").select().eq("deleted", false)

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

  const parsedData = data.map(mapDataToEvent)

  return parsedData
}

export async function getFavouriteEvents(userId: UserID) {
  const { data, error } = await supabase
    .from("events")
    .select("*, favourites!inner(event_id, user_id)")
    .eq("deleted", false)
    .eq("is_published", true)
    .order("date_start")

  if (error) throw new Error(error.message)

  // TODO: do this in query
  const filteredData = (data || []).filter((event) =>
    event.favourites.some((fav) => fav.user_id === userId),
  )

  // TODO: cache?
  const parsedData = filteredData.map(mapDataToEvent)

  return parsedData
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
      .eq("deleted", false)
      .eq("id", eventId)
      .single()

    if (error) {
      throw new Error(error.message)
    } else {
      const parsedData = mapDataToEvent(data)

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
      .eq("deleted", false)
      .eq("owner_id", userId)

    if (error) {
      throw new Error(error.message)
    } else {
      const parsedData = data.map(mapDataToEvent)

      userEventsCache.set(userId, parsedData, 1000 * 60 * 30)
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
  event_banner_url,
  tags,
  is_beginner_friendly,
  minimum_age,
  maximum_participants,
  location_latitude,
  location_longitude,
  display_mode,
  external_website_url,
  prices,
}: Omit<
  LARPEvent,
  "owner_id" | "details" | "created_at" | "updated_at" | "price" | "deleted"
>) {
  const { data, error: createEventError } = await supabase
    .from("events")
    .insert({
      id,
      name,
      description,
      description_short,
      date_start,
      date_end,
      date_signup,
      location_name,
      event_image_url,
      event_banner_url,
      tags: tags,
      is_beginner_friendly,
      minimum_age,
      maximum_participants,
      location_latitude,
      location_longitude,
      display_mode,
      external_website_url,
      prices,
    })
    .select()
    .single()

  if (createEventError) throw new Error(createEventError.message)

  eventsCache.clear()
  userEventsCache.clear()

  return mapDataToEvent(data)
}

export async function updateEvent({
  eventId,
  name,
  description,
  description_short,
  date_start,
  date_end,
  date_signup,
  location_name,
  event_image_url,
  event_banner_url,
  tags,
  is_beginner_friendly,
  minimum_age,
  maximum_participants,
  location_latitude,
  location_longitude,
  display_mode,
  is_published,
  external_website_url,
  prices,
  deleted,
}: { eventId: EventID } & Partial<LARPEvent>) {
  const event = await getEvent(eventId)

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
      event_banner_url: event_banner_url ?? event.event_banner_url,
      tags: tags ?? event.tags,
      is_beginner_friendly: is_beginner_friendly ?? event.is_beginner_friendly,
      minimum_age:
        minimum_age === undefined
          ? event.minimum_age
          : minimum_age === null
            ? null
            : minimum_age,
      maximum_participants:
        maximum_participants === undefined
          ? event.maximum_participants
          : maximum_participants === null
            ? null
            : maximum_participants,
      location_latitude: location_latitude ?? event.location_latitude,
      location_longitude: location_longitude ?? event.location_longitude,
      display_mode: display_mode ?? event.display_mode,
      price: null,
      is_published: is_published ?? event.is_published,
      external_website_url: external_website_url ?? event.external_website_url,
      prices: prices === undefined ? event.prices : prices,
      deleted: deleted === undefined ? event.deleted : deleted,
    })
    .eq("id", eventId)
    .select()
    .single()

  if (updateEventError || data === null)
    throw new Error(updateEventError?.message ?? "Data is null")

  const parsedData = mapDataToEvent(data)

  eventCollectionsCache.remove("upcoming")
  eventsCache.remove(eventId)
  userEventsCache.remove(data.owner_id)

  return parsedData
}

export async function duplicateEvent({ eventId }: { eventId: EventID }) {
  const eventToDuplicate = await getEvent(eventId)

  return await createEvent({
    ...eventToDuplicate,
    id: uuidv4(),
    name: eventToDuplicate.name + " (Copy)",
    is_published: false,
  })
}

export async function softDeleteEvent({ eventId }: { eventId: EventID }) {
  await updateEvent({ eventId, deleted: true })
}
