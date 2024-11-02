import type { APIRoute } from "astro"
import { errorResponse } from "../../../../../utils/responseUtils"
import { addDetailToEvent } from "../../../../../services/eventDetailsService"
import {
  getEvent,
  type EventDetailsType,
} from "../../../../../services/eventService"

export const POST: APIRoute = async ({ request, params, rewrite }) => {
  const eventId = params.eventId

  if (!eventId) return errorResponse("Missing event id")

  const formData = await request.clone().formData()

  const controlType = formData.get("controlType")?.toString() as
    | EventDetailsType
    | undefined
  const controlName = formData.get("controlName")?.toString()
  const controlDescription = formData.get("controlDescription")?.toString()

  if (!controlType || !controlName) {
    return errorResponse("Missing form data")
  }

  const event = await getEvent(eventId)

  try {
    await addDetailToEvent(event, {
      id: crypto.randomUUID(),
      type: controlType,
      label: controlName,
      description: controlDescription,
      options: controlType === "multiChoice" ? [] : undefined,
    })
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return errorResponse(error.message, 500)
    }
  }

  return rewrite(`/events/${eventId}/manage/sign-up-form`)
}
