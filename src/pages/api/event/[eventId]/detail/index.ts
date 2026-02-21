import type { APIRoute } from "astro"

import { addDetailToEvent } from "../../../../../services/eventDetailsService"
import {
  type EventDetailsType,
  getEvent,
} from "../../../../../services/eventService"
import { errorResponse } from "../../../../../utils/responseUtils"

const autofillOptions = ["characterName", "characterDescription"] as const
const autofillNameOptions = ["Character name", "Character description"] as const

const autofillNames = new Map([
  [autofillOptions[0], autofillNameOptions[0]],
  [autofillOptions[1], autofillNameOptions[1]],
])

export const POST: APIRoute = async ({ params, request, rewrite }) => {
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
    ["checkbox", "multiChoice", "multiChoiceMultiValue", "number"].includes(
      controlType,
    )
  )
    autofillWith = undefined

  const event = await getEvent(eventId)

  try {
    await addDetailToEvent(event, {
      autofillWith,
      autofillWithName: autofillWith
        ? autofillNames.get(autofillWith)
        : undefined,
      description: controlDescription,
      id: crypto.randomUUID(),
      label: controlName,
      options: controlType === "multiChoice" ? [] : undefined,
      type: controlType,
    })
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return errorResponse(error.message, 500)
    }
  }

  return rewrite(`/events/${eventId}/manage/sign-up-form`)
}
