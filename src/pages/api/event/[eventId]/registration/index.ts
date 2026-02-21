import type { APIRoute } from "astro"

import { createEventGroup } from "../../../../../services/eventGroupsService"
import {
  createRegistration,
  findRegistration,
  type RegistrationDetails,
  replaceRegistration,
} from "../../../../../services/registrationService"
import { errorResponse } from "../../../../../utils/responseUtils"

// TODO: separate into post and patch/put?
export const PUT: APIRoute = async ({ locals, params, request }) => {
  const eventId = params.eventId

  if (!eventId) return errorResponse("Missing event id")

  const formData = await request.formData()

  const groupId = formData.get("groupId")?.toString() || null
  const newGroupName = formData.get("newGroupName")?.toString()
  const newGroupDescription = formData.get("newGroupDescription")?.toString()

  const details: RegistrationDetails[] = []

  for (const pair of formData.entries()) {
    if (pair[0].startsWith("detail-")) {
      const detailName = pair[0].substring(7)
      details.push({ name: detailName, value: pair[1].toString() })
    }
  }

  let eventGroupId = groupId === "ungrouped" ? null : groupId

  if (groupId === "new") {
    const newEventGroup = await createEventGroup(
      eventId,
      newGroupName || "",
      newGroupDescription || "",
    )
    eventGroupId = newEventGroup.id
  }

  const registration = await findRegistration(locals.user.id, eventId)

  try {
    if (registration) {
      replaceRegistration(registration.id, eventGroupId, details)
    } else {
      createRegistration(
        eventId,
        locals.user.id,
        locals.user.details.user_id,
        eventGroupId,
        details,
      )
    }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return errorResponse(error.message, 500)
    }
  }

  return new Response(null, {
    headers: new Headers({
      "HX-Location": `{"path":"/events/${eventId}", "target":"#main"}`,
    }),
  })
}
