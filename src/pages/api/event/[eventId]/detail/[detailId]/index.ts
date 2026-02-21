import type { APIRoute } from "astro"

import { removeDetailFromEvent } from "../../../../../../services/eventDetailsService"
import { getEvent } from "../../../../../../services/eventService"
import { errorResponse } from "../../../../../../utils/responseUtils"

export const DELETE: APIRoute = async ({ params, rewrite }) => {
  const eventId = params.eventId
  const detailId = params.detailId

  if (!eventId) return errorResponse("Missing event id")
  if (!detailId) return errorResponse("Missing detail id")

  const event = await getEvent(eventId)

  try {
    await removeDetailFromEvent(event, detailId)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return errorResponse(error.message, 500)
    }
  }

  return rewrite(`/events/${eventId}/manage/sign-up-form`)
}
