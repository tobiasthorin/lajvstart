import type { APIRoute } from "astro"
import { updateEvent } from "../../../../services/eventService"
import { BadRequestError, InternalError } from "../../../../utils/errorUtils"
import { errorResponse } from "../../../../utils/responseUtils"
import { uploadEventPicture } from "../../../../utils/storageUtils"
import { extractEventFormData } from "../../../../utils/eventUtils"

export const PUT: APIRoute = async ({ request, rewrite, params }) => {
  const eventId = params.eventId

  if (!eventId) return errorResponse("Missing event id")

  const formData = await request.clone().formData()

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
    useLajvstartSystem,
    finalSignupDate,
    price,
  } = extractEventFormData(formData)

  const eventFile = formData.get("eventPicture") as File | null

  let filePath: string | null = null

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
    updateEvent({
      id: eventId,
      name,
      description,
      description_short: descriptionShort,
      date_start: startDate,
      date_end: endDate,
      location_name: location,
      event_image_url: filePath,
      tags: tags.split(","),
      is_beginner_friendly: !!beginnerFriendly,
      minimum_age: Number(ageRestriction),
      maximum_participants: Number(maximumParticipants),
      location_latitude: Number(latitude),
      location_longitude: Number(longitude),
      display_mode: !useLajvstartSystem,
      date_signup: finalSignupDate,
      price: Number(price),
    })
  } catch (error) {
    if (error instanceof Error) return errorResponse(error.message, 500)
  }

  return rewrite(`/api/event/updateResponse`)
}
