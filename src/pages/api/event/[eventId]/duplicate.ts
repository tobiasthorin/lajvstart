import type { APIRoute } from "astro"

import { duplicateEvent } from "../../../../services/eventService"
import { errorResponse } from "../../../../utils/responseUtils"

export const POST: APIRoute = async ({ params, rewrite }) => {
  const eventId = params.eventId
  if (!eventId) return errorResponse("Missing event id")

  try {
    await duplicateEvent({
      eventId,
    })

    return rewrite(`/events/my`)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) return errorResponse(error.message, 500)
    return errorResponse("Unknown error", 500)
  }
}
