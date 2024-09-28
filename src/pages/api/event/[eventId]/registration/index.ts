import type { APIRoute } from "astro"
import { errorResponse } from "../../../../../utils/responseUtils"
import {
  createRegistration,
  findRegistration,
  replaceRegistration,
  type RegistrationDetails,
} from "../../../../../services/registrationService"

// TODO: separate into post and patch/put?
export const PUT: APIRoute = async ({ request, params, locals }) => {
  const eventId = params.eventId

  if (!eventId) return errorResponse("Missing event id")

  const formData = await request.formData()

  const characterName = formData.get("characterName")?.toString()
  const characterDescription = formData.get("characterDescription")?.toString()

  if (!characterName || !characterDescription) {
    return errorResponse("Missing form data")
  }

  const registration = await findRegistration(locals.user.id, eventId)

  const details: RegistrationDetails[] = [
    { name: "characterName", value: characterName, type: "textShort" },
    {
      name: "characterDescription",
      value: characterDescription,
      type: "textLong",
    },
  ]
  try {
    if (registration) {
      replaceRegistration(registration.id, details)
    } else {
      createRegistration(
        eventId,
        locals.user.id,
        locals.user.details.user_id,
        details
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
