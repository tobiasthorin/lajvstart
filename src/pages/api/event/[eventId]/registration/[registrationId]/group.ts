import type { APIRoute } from "astro"

import { updateRegistration } from "../../../../../../services/registrationService"
import { handleServiceError } from "../../../../../../utils/errorUtils"
import { errorResponse } from "../../../../../../utils/responseUtils"

export const PUT: APIRoute = async ({ params, request, rewrite }) => {
  const eventId = params.eventId
  const registrationId = params.registrationId

  if (!eventId || !registrationId) {
    return errorResponse("Missing event or registration id")
  }

  const body = await request.clone().formData()
  const newGroupId = body.get("newGroupId")

  if (!newGroupId) {
    return errorResponse("Missing newGroupId")
  }

  try {
    await updateRegistration(registrationId, {
      groupId: newGroupId === "ungrouped" ? null : String(newGroupId),
    })
  } catch (error) {
    return handleServiceError(error)
  }

  return rewrite(`/events/${eventId}/manage/groups`)
}
