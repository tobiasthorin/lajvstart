import type { APIRoute } from "astro"
import { errorResponse } from "../../../../../../../utils/responseUtils"
import { addOptionToDetail } from "../../../../../../../services/eventDetailsService"
import { getEvent } from "../../../../../../../services/eventService"

export const POST: APIRoute = async ({ request, params, rewrite }) => {
  const eventId = params.eventId
  const detailId = params.detailId

  if (!eventId || !detailId) return errorResponse("Missing event id")

  const formData = await request.clone().formData()

  const newOptionName = formData.get("newOptionName")?.toString()

  if (!newOptionName) {
    return errorResponse("Missing form data")
  }

  const event = await getEvent(eventId)

  try {
    await addOptionToDetail(event, detailId, newOptionName)
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
