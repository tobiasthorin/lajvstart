import type { APIRoute } from "astro"
import { getEvent, updateEvent } from "../../../../services/eventService"
import { errorResponse } from "../../../../utils/responseUtils"
import type { LARPEvent } from "../../../../types/types"
import { EVENT_COLLECTIONS_CACHE, useNamespace } from "../../../../lib/cache"

export const PUT: APIRoute = async ({ rewrite, params }) => {
  const eventId = params.eventId
  if (!eventId) return errorResponse("Missing event id")

  const event = await getEvent(eventId)

  let updatedEvent: LARPEvent
  try {
    updatedEvent = await updateEvent({
      eventId: eventId,
      is_published: !event.is_published,
    })

    const eventCollectionsCache = useNamespace<LARPEvent[]>(
      EVENT_COLLECTIONS_CACHE,
    )
    eventCollectionsCache.remove("upcoming")

    return rewrite(
      `/api/event/${eventId}/publishResponse?published=${updatedEvent.is_published ? "true" : "false"}`,
    )
  } catch (error) {
    console.error(error)
    if (error instanceof Error) return errorResponse(error.message, 500)
    return errorResponse("Unknown error", 500)
  }
}
