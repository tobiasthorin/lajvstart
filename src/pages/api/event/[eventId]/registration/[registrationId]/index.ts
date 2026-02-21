import type { APIRoute } from "astro"

import {
  deleteRegistration,
  updateRegistration,
} from "../../../../../../services/registrationService"
import { handleServiceError } from "../../../../../../utils/errorUtils"
import { errorResponse } from "../../../../../../utils/responseUtils"

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

export const PATCH: APIRoute = async ({ params, request, rewrite }) => {
  const eventId = params.eventId
  const registrationId = params.registrationId

  if (!eventId || !registrationId) {
    return errorResponse("Missing event or registration id")
  }

  const body = await request.clone().formData()
  const userId = body.get("userId")
  const isPaid = body.get("isPaid")
  const isApproved = body.get("isApproved")

  if (!userId) {
    return errorResponse("Missing userId")
  }

  try {
    await updateRegistration(registrationId, {
      isApproved:
        isApproved !== null
          ? isApproved === "true"
            ? true
            : false
          : undefined,
      isPaid: isPaid !== null ? (isPaid === "true" ? true : false) : undefined,
    })
  } catch (error) {
    return handleServiceError(error)
  }

  return rewrite(
    `/api/event/${eventId}/registration/patchResponse?userId=${userId}`,
  )
}
