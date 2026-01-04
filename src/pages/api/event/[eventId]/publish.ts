import type { APIRoute } from "astro"
import { getEvent, updateEvent } from "../../../../services/eventService"
import { errorResponse } from "../../../../utils/responseUtils"
import type { LARPEvent } from "../../../../types/types"
import { EVENT_COLLECTIONS_CACHE, useNamespace } from "../../../../lib/cache"
import { sendDiscordMessage } from "../../../../lib/discord"
import { getEventDateString } from "../../../../utils/dateUtils"
import { isProd } from "../../../../utils/constants"

function constructAnnouncement(event: LARPEvent) {
  return `Ett nytt lajv har annonserats!

**${event.name}**
*${getEventDateString(new Date(event.date_start), new Date(event.date_end))}*

${event.description_short}

https://www.lajvstart.se/events/${event.id}`
}

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

    if (isProd && !event.has_been_announced && !event.is_published) {
      await sendDiscordMessage(constructAnnouncement(event))

      await updateEvent({
        eventId: eventId,
        has_been_announced: true,
      })
    }

    return rewrite(
      `/api/event/${eventId}/publishResponse?published=${updatedEvent.is_published ? "true" : "false"}`,
    )
  } catch (error) {
    console.error(error)
    if (error instanceof Error) return errorResponse(error.message, 500)
    return errorResponse("Unknown error", 500)
  }
}
