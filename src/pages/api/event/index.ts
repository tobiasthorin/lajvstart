import type { APIRoute } from "astro"
import { uploadEventPicture } from "../../../utils/storageUtils"
import { BadRequestError, InternalError } from "../../../utils/errorUtils"
import { errorResponse } from "../../../utils/responseUtils"
import { v4 as uuidv4 } from "uuid"
import { createEvent } from "../../../services/eventService"
import { extractEventFormData } from "../../../utils/eventUtils"
import { useNamespace, USER_EVENTS_CACHE } from "../../../lib/cache"
import type { LARPEvent } from "../../../types/types"

export const POST: APIRoute = async ({ request }) => {
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
    externalWebsiteURL,
  } = extractEventFormData(formData)

  const eventFile = formData.get("eventPicture") as File | null

  let filePath: string | null = null
  let eventId = uuidv4()

  if (eventFile) {
    try {
      filePath = await uploadEventPicture(eventFile, eventId)
    } catch (error) {
      console.error(error)
      if (error instanceof BadRequestError || error instanceof InternalError)
        return errorResponse(error.message, error.errorCode)
      else throw error
    }
  }

  let createdId: string = ""

  try {
    const createdEvent = createEvent({
      id: eventId,
      name,
      description,
      description_short: descriptionShort,
      date_start: startDate,
      date_end: endDate,
      date_signup: finalSignupDate || null,
      location_name: location,
      event_image_url: filePath,
      tags: tags.split(","),
      is_beginner_friendly: !!beginnerFriendly,
      minimum_age: ageRestriction ? Number(ageRestriction) : null,
      maximum_participants: Number(maximumParticipants),
      location_latitude: latitude ? Number(latitude) : null,
      location_longitude: longitude ? Number(longitude) : null,
      display_mode: !useLajvstartSystem,
      price: Number(price),
      currency: "SEK",
      is_published: false,
      external_website_url: externalWebsiteURL || null,
    })

    createdId = (await createdEvent).id
  } catch (error) {
    console.error(error)
    if (error instanceof Error) return errorResponse(error.message, 500)
  }

  const userEventsCache = useNamespace<LARPEvent[]>(USER_EVENTS_CACHE)
  userEventsCache.clear()

  return new Response(null, {
    headers: new Headers({
      "HX-Location": `{"path":"/events/${createdId}/manage/overview", "target":"#main"}`,
    }),
  })
}
