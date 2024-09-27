import type { APIRoute } from "astro"
import { errorResponse } from "../../../../../utils/responseUtils"
import { createGroup } from "../../../../../services/eventGroupsService"

export const POST: APIRoute = async ({ request, params, rewrite }) => {
  const eventId = params.eventId

  if (!eventId) return errorResponse("Missing event id")

  const formData = await request.clone().formData()

  const groupName = formData.get("groupName")?.toString()
  const groupDescription = formData.get("groupDescription")?.toString()

  if (!groupName) {
    return errorResponse("Missing form data")
  }

  try {
    createGroup(eventId, groupName, groupDescription)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return errorResponse(error.message, 500)
    }
  }

  return rewrite(`/events/${eventId}/manage/groups`)
}
