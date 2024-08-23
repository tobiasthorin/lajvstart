import type { APIRoute } from "astro"
import { supabase } from "../../../../lib/supabase"
import { errorResponse } from "../../../../utils/responseUtils"
import {
  getRegistration,
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

  if (registration) {
    const { error: updateRegistrationError } = await supabase
      .from("registrations")
      .update({
        details,
      })
      .eq("id", registration.id)

    if (updateRegistrationError)
      return errorResponse(updateRegistrationError.message, 500)
  } else {
    const { error: createRegistrationError } = await supabase
      .from("registrations")
      .insert({
        event_id: eventId,
        user_id: locals.user.id,
        is_paid: false,
        details,
      })

    if (createRegistrationError)
      return errorResponse(createRegistrationError.message, 500)
  }

  return new Response(null, {
    headers: new Headers({
      "HX-Location": `{"path":"/events/${eventId}", "target":"#main"}`,
    }),
  })
}
