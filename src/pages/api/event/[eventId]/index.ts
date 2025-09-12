import type { APIRoute } from "astro"
import { updateEvent } from "../../../../services/eventService"
import { BadRequestError, InternalError } from "../../../../utils/errorUtils"
import { errorResponse } from "../../../../utils/responseUtils"
import {
  uploadEventBanner,
  uploadEventPicture,
} from "../../../../utils/storageUtils"
import { extractEventFormData } from "../../../../utils/eventUtils"

export const PUT: APIRoute = async ({ request, rewrite, params }) => {
  const eventId = params.eventId

  if (!eventId) {
    console.error("Missing event id")
    return errorResponse("Missing event id")
  }

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
    externalWebsiteURL,
    prices,
    isFree,
  } = extractEventFormData(formData)

  const eventImageFile = formData.get("eventPicture") as File | null
  const eventBannerFile = formData.get("eventBanner") as File | null

  let filePath: string | null = null
  let bannerFilePath: string | null = null

  if (eventImageFile) {
    try {
      filePath = await uploadEventPicture(eventImageFile, eventId)
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof InternalError) {
        console.error("Error when uploading event picture", error)
        return errorResponse(error.message, error.errorCode)
      } else throw error
    }
  }

  if (eventBannerFile) {
    try {
      bannerFilePath = await uploadEventBanner(eventBannerFile, eventId)
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof InternalError) {
        console.error("Error when uploading event banner", error)
        return errorResponse(error.message, error.errorCode)
      } else throw error
    }
  }

  try {
    updateEvent({
      eventId,
      name,
      description,
      description_short: descriptionShort,
      date_start: startDate,
      date_end: endDate,
      location_name: location,
      event_image_url: filePath,
      event_banner_url: bannerFilePath,
      tags: tags.split(","),
      is_beginner_friendly: !!beginnerFriendly,
      minimum_age: ageRestriction === "" ? null : Number(ageRestriction),
      maximum_participants:
        maximumParticipants === "" ? null : Number(maximumParticipants),
      location_latitude: latitude ? Number(latitude) : null,
      location_longitude: longitude ? Number(longitude) : null,
      display_mode: !useLajvstartSystem,
      date_signup: finalSignupDate || null,
      external_website_url: externalWebsiteURL || null,
      prices: isFree ? null : prices,
    })
  } catch (error) {
    console.error("Error when updating event", error)
    if (error instanceof Error) return errorResponse(error.message, 500)
  }

  return rewrite(`/api/event/updateResponse`)
}
