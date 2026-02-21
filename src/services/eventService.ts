import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import type { Database } from "../types/supabase"
import type { LARPEvent } from "../types/types"
import type { UserID } from "./userService"

import {
  EVENT_COLLECTIONS_CACHE,
  EVENTS_CACHE,
  useNamespace,
  USER_EVENTS_CACHE,
} from "../lib/cache"
import { log } from "../lib/logger"
import { supabase } from "./../lib/supabase"

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
  autofillWith: z.enum(["characterName", "characterDescription"]).optional(),
  autofillWithName: z
    .enum(["Character name", "Character description"])
    .optional(),
  description: z.string().optional(),
  id: z.string(),
  label: z.string(),
  options: z.array(z.string()).optional(),
  type: detailsTypeEnum,
})

const eventPriceSchema = z.object({
  description: z.string(),
  price: z.number(),
})

export const eventDetailsSchema = z.array(eventDetailSchema)
export const eventPricesSchema = z.array(eventPriceSchema).nullable()

export type EventDetail = z.infer<typeof eventDetailSchema>
export type EventDetailsSchema = z.infer<typeof eventDetailsSchema>
export type EventDetailsType = z.infer<typeof detailsTypeEnum>

export type EventPrice = z.infer<typeof eventPriceSchema>
export type EventPrices = z.infer<typeof eventPricesSchema>

export async function createEvent({
  date_end,
  date_signup,
  date_start,
  description,
  description_short,
  display_mode,
  event_banner_url,
  event_image_url,
  external_website_url,
  id,
  is_beginner_friendly,
  location_latitude,
  location_longitude,
  location_name,
  maximum_participants,
  minimum_age,
  name,
  prices,
  tags,
}: Omit<
  LARPEvent,
  | "created_at"
  | "deleted"
  | "details"
  | "has_been_announced"
  | "owner_id"
  | "price"
  | "updated_at"
>) {
  const { data, error: createEventError } = await supabase
    .from("events")
    .insert({
      date_end,
      date_signup,
      date_start,
      description,
      description_short,
      display_mode,
      event_banner_url,
      event_image_url,
      external_website_url,
      id,
      is_beginner_friendly,
      location_latitude,
      location_longitude,
      location_name,
      maximum_participants,
      minimum_age,
      name,
      prices,
      tags: tags,
    })
    .select()
    .single()

  if (createEventError) throw new Error(createEventError.message)

  eventsCache.clear()
  userEventsCache.clear()

  return mapDataToEvent(data)
}

export async function duplicateEvent({ eventId }: { eventId: EventID }) {
  const eventToDuplicate = await getEvent(eventId)

  return await createEvent({
    ...eventToDuplicate,
    id: uuidv4(),
    is_published: false,
    name: eventToDuplicate.name + " (Copy)",
  })
}

export async function getEvent(eventId: LARPEvent["id"]) {
  const event = eventsCache.get(eventId)

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

export async function getFilteredEvents({
  dateFrom,
  dateTo,
  tags,
}: {
  dateFrom?: null | string
  dateTo?: null | string
  tags?: string[]
}) {
  let query = supabase.from("events").select().eq("deleted", false)

  if (tags && tags.length > 0) {
    query = query.overlaps("tags", tags)
  }

  if (dateTo) {
    query = query.lte("date_start", dateTo)
  }
  if (dateFrom) {
    query = query.gte("date_start", dateFrom)
  }

  const { data, error } = await query
    .eq("is_published", true)
    .order("date_start")

  if (error) throw new Error(error.message)

  const parsedData = data.map(mapDataToEvent)

  return parsedData
}

export async function getMyEvents(userId: UserID) {
  const events = userEventsCache.get(userId)

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

export async function getUpcomingEvents() {
  const eventsCache = useNamespace<LARPEvent[]>(EVENT_COLLECTIONS_CACHE)
  const events = eventsCache.get("upcoming")

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

export async function softDeleteEvent({ eventId }: { eventId: EventID }) {
  await updateEvent({ deleted: true, eventId })
}

export async function updateEvent({
  date_end,
  date_signup,
  date_start,
  deleted,
  description,
  description_short,
  display_mode,
  event_banner_url,
  event_image_url,
  eventId,
  external_website_url,
  has_been_announced,
  is_beginner_friendly,
  is_published,
  location_latitude,
  location_longitude,
  location_name,
  maximum_participants,
  minimum_age,
  name,
  prices,
  tags,
}: Partial<LARPEvent> & { eventId: EventID }) {
  const event = await getEvent(eventId)

  const { data, error: updateEventError } = await supabase
    .from("events")
    .update({
      date_end: date_end ?? event.date_end,
      date_signup: date_signup ?? event.date_signup,
      date_start: date_start ?? event.date_start,
      deleted: deleted === undefined ? event.deleted : deleted,
      description: description ?? event.description,
      description_short: description_short ?? event.description_short,
      display_mode: display_mode ?? event.display_mode,
      event_banner_url: event_banner_url ?? event.event_banner_url,
      event_image_url: event_image_url ?? event.event_image_url,
      external_website_url: external_website_url ?? event.external_website_url,
      has_been_announced:
        has_been_announced === undefined
          ? event.has_been_announced
          : has_been_announced,
      is_beginner_friendly: is_beginner_friendly ?? event.is_beginner_friendly,
      is_published: is_published ?? event.is_published,
      location_latitude: location_latitude ?? event.location_latitude,
      location_longitude: location_longitude ?? event.location_longitude,
      location_name: location_name ?? event.location_name,
      maximum_participants:
        maximum_participants === undefined
          ? event.maximum_participants
          : maximum_participants === null
            ? null
            : maximum_participants,
      minimum_age:
        minimum_age === undefined
          ? event.minimum_age
          : minimum_age === null
            ? null
            : minimum_age,
      name: name ?? event.name,
      price: null,
      prices: prices === undefined ? event.prices : prices,
      tags: tags ?? event.tags,
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

function mapDataToEvent(
  data: Database["public"]["Tables"]["events"]["Row"],
): LARPEvent {
  return {
    ...data,
    details: eventDetailsSchema.parse(data.details),
    prices: eventPricesSchema.parse(data.prices),
  }
}
