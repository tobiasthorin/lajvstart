import type { APIRoute } from "astro"
import {
  deleteRegistration,
  updateRegistration,
} from "../../../../../services/registrationService"
import { errorResponse } from "../../../../../utils/responseUtils"
import { handleServiceError } from "../../../../../utils/errorUtils"

export const DELETE: APIRoute = async ({ params, rewrite }) => {
  const eventId = params.eventId
  const registrationId = params.registrationId

  if (!eventId || !registrationId) {
    return errorResponse("Missing event or registration id")
  }

  try {
    await deleteRegistration(eventId, registrationId)

    return rewrite(`/api/event/${eventId}/registration/deleteResponse`)
  } catch (error) {
    return handleServiceError(error)
  }
}

export const PATCH: APIRoute = async ({ request, params, rewrite, locals }) => {
  const eventId = params.eventId
  const registrationId = params.registrationId

  if (!eventId || !registrationId) {
    return errorResponse("Missing event or registration id")
  }

  const body = await request.clone().formData()
  const userId = body.get("userId")
  const isPaid = body.get("isPaid")

  if (!userId) {
    return errorResponse("Missing userId")
  }
  console.log(typeof isPaid)
  try {
    await updateRegistration(String(userId), eventId, {
      isPaid: isPaid !== null ? (isPaid === "true" ? true : false) : undefined,
    })
  } catch (error) {
    return handleServiceError(error)
  }

  return rewrite(
    `/api/event/${eventId}/registration/patchResponse?userId=${userId}`
  )
}
