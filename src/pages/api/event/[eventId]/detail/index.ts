import type { APIRoute } from "astro"
import { errorResponse } from "../../../../../utils/responseUtils"
import { addDetailToEvent } from "../../../../../services/eventDetailsService"
import {
  getEvent,
  type EventDetailsType,
} from "../../../../../services/eventService"

const autofillOptions = ["characterName", "characterDescription"] as const
const autofillNameOptions = ["Character name", "Character description"] as const

const autofillNames = new Map([
  [autofillOptions[0], autofillNameOptions[0]],
  [autofillOptions[1], autofillNameOptions[1]],
])

export const POST: APIRoute = async ({ request, params, rewrite }) => {
  const eventId = params.eventId

  if (!eventId) return errorResponse("Missing event id")

  const formData = await request.clone().formData()

  const controlType = formData.get("controlType")?.toString() as
    | EventDetailsType
    | undefined
  const controlName = formData.get("controlName")?.toString()
  const controlDescription = formData.get("controlDescription")?.toString()
  let autofillWith = formData.get("autofillWith")?.toString() as
    | (typeof autofillOptions)[number]
    | undefined

  if (!controlType || !controlName) {
    return errorResponse("Missing form data")
  }

  if (
    !autofillWith ||
    !autofillOptions.includes(autofillWith) ||
    ["number", "checkbox", "multiChoice", "multiChoiceMultiValue"].includes(
      controlType,
    )
  )
    autofillWith = undefined

  const event = await getEvent(eventId)

  try {
    await addDetailToEvent(event, {
      id: crypto.randomUUID(),
      type: controlType,
      label: controlName,
      description: controlDescription,
      options: controlType === "multiChoice" ? [] : undefined,
      autofillWith,
      autofillWithName: autofillWith
        ? autofillNames.get(autofillWith)
        : undefined,
    })
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return errorResponse(error.message, 500)
    }
  }

  return rewrite(`/events/${eventId}/manage/sign-up-form`)
}
