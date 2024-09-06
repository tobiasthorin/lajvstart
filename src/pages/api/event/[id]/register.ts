import type { APIRoute } from "astro"
import { errorResponse } from "../../../../utils/responseUtils"
import {
  createRegistration,
  getRegistration,
  updateRegistration,
  type RegistrationDetails,
} from "../../../../services/registrationService"

export const PUT: APIRoute = async ({ request, params, locals }) => {
  const eventId = params.id

  if (!eventId) return errorResponse("Missing event id")

  const formData = await request.formData()

  const characterName = formData.get("characterName")?.toString()
  const characterDescription = formData.get("characterDescription")?.toString()

  if (!characterName || !characterDescription) {
    return errorResponse("Missing form data")
  }

  const registration = await getRegistration(locals.user.id, eventId)

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
      updateRegistration(registration.id, details)
    } else {
      createRegistration(
        eventId,
        locals.user.id,
        locals.user.details.user_id,
        details
      )
    }
  } catch (error: unknown) {
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
