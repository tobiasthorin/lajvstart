import type { APIRoute } from "astro"
import { uploadEventPicture } from "../../../utils/storageUtils"
import { BadRequestError, InternalError } from "../../../utils/errorUtils"
import { errorResponse } from "../../../utils/responseUtils"
import { v4 as uuidv4 } from "uuid"
import { createEvent } from "../../../services/eventService"
import { extractEventFormData } from "../../../utils/eventUtils"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()

  const {
    name,
    startDate,
    endDate,
    location,
    descriptionShort,
    description,
    tags,
    beginnerFriendly,
    ageRestriction,
    maximumParticipants,
    latitude,
    longitude,
    isDisplay,
    finalSignupDate,
    price,
  } = extractEventFormData(formData)

  const eventFile = formData.get("eventPicture") as File | null

  let filePath: string | null = null
  let eventId = uuidv4()

  if (eventFile) {
    try {
      filePath = await uploadEventPicture(eventFile, eventId)
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof InternalError)
        return errorResponse(error.message, error.errorCode)
      else throw error
    }
  }

  try {
    createEvent({
      id: eventId,
      name,
      description,
      description_short: descriptionShort,
      date_start: startDate,
      date_end: endDate,
      date_signup: finalSignupDate,
      location_name: location,
      event_image_url: filePath,
      tags: tags.split(","),
      is_beginner_friendly: !!beginnerFriendly,
      minimum_age: Number(ageRestriction),
      maximum_participants: Number(maximumParticipants),
      location_latitude: Number(latitude),
      location_longitude: Number(longitude),
      display_mode: !!isDisplay,
      price: Number(price),
      currency: "SEK",
      is_published: false,
    })
  } catch (error) {
    if (error instanceof Error) return errorResponse(error.message, 500)
  }

  return new Response(null, {
    headers: new Headers({
      "HX-Location": '{"path":"/events", "target":"#main"}',
    }),
  })
}
