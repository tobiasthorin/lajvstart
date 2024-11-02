import type { APIRoute } from "astro"
import { removeOptionFromDetail } from "../../../../../../../services/eventDetailsService"
import { getEvent } from "../../../../../../../services/eventService"
import { errorResponse } from "../../../../../../../utils/responseUtils"

export const DELETE: APIRoute = async ({ params, rewrite }) => {
  const eventId = params.eventId
  const detailId = params.detailId
  const optionName = params.optionName

  if (!eventId) return errorResponse("Missing event id")
  if (!detailId) return errorResponse("Missing detail id")
  if (!optionName) return errorResponse("Missing option name")

  const event = await getEvent(eventId)

  try {
    await removeOptionFromDetail(event, detailId, optionName)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return errorResponse(error.message, 500)
    }
  }

  return rewrite(
    `/api/event/${eventId}/detail/${detailId}/updateOptionResponse`,
  )
}
