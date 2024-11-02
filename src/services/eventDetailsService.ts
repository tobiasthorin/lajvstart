import { EVENTS_CACHE, useNamespace } from "../lib/cache"
import { supabase } from "../lib/supabase"
import type { LARPEvent } from "../types/types"
import { eventDetailsSchema, type EventDetail } from "./eventService"

const eventsCache = useNamespace<LARPEvent>(EVENTS_CACHE)

export async function addDetailToEvent(event: LARPEvent, detail: EventDetail) {
  const { data, error } = await supabase
    .from("events")
    .update({
      details: [...event.details, detail],
    })
    .eq("id", event.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  } else {
    const parsedData = {
      ...data,
      details: eventDetailsSchema.parse(data.details),
    }

    eventsCache.set(event.id, parsedData, 1000 * 60 * 5)
    return parsedData
  }
}

export async function removeDetailFromEvent(
  event: LARPEvent,
  detailId: EventDetail["id"],
) {
  const { data, error } = await supabase
    .from("events")
    .update({
      details: event.details.filter(
        (detail: EventDetail) => detail.id !== detailId,
      ),
    })
    .eq("id", event.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  } else {
    const parsedData = {
      ...data,
      details: eventDetailsSchema.parse(data.details),
    }

    eventsCache.set(event.id, parsedData, 1000 * 60 * 5)
    return parsedData
  }
}

export async function addOptionToDetail(
  event: LARPEvent,
  detailId: EventDetail["id"],
  option: string,
) {
  const newDetails = event.details.map((detail) => {
    if (detail.id === detailId) {
      return { ...detail, options: [...(detail.options || []), option] }
    }

    return detail
  })

  const { data, error } = await supabase
    .from("events")
    .update({
      details: newDetails,
    })
    .eq("id", event.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  } else {
    const parsedData = {
      ...data,
      details: eventDetailsSchema.parse(data.details),
    }

    eventsCache.set(event.id, parsedData, 1000 * 60 * 5)
    return parsedData
  }
}

export async function removeOptionFromDetail(
  event: LARPEvent,
  detailId: EventDetail["id"],
  optionToRemove: string,
) {
  const newDetails = event.details.map((detail) => {
    if (detail.id === detailId) {
      return {
        ...detail,
        options: (detail.options || []).filter(
          (option) => option !== optionToRemove,
        ),
      }
    }

    return detail
  })

  const { data, error } = await supabase
    .from("events")
    .update({
      details: newDetails,
    })
    .eq("id", event.id)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  } else {
    const parsedData = {
      ...data,
      details: eventDetailsSchema.parse(data.details),
    }

    eventsCache.set(event.id, parsedData, 1000 * 60 * 5)
    return parsedData
  }
}
