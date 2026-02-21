import type { APIRoute } from "astro"

import { softDeleteEvent, updateEvent } from "../../../../services/eventService"
import { BadRequestError, InternalError } from "../../../../utils/errorUtils"
import { extractEventFormData } from "../../../../utils/eventUtils"
import { errorResponse } from "../../../../utils/responseUtils"
import {
  uploadEventBanner,
  uploadEventPicture,
} from "../../../../utils/storageUtils"

export const PUT: APIRoute = async ({ params, request, rewrite }) => {
  const eventId = params.eventId

  if (!eventId) {
    console.error("Missing event id")
    return errorResponse("Missing event id")
  }

  const formData = await request.clone().formData()

  const {
    ageRestriction,
    beginnerFriendly,
    description,
    descriptionShort,
    endDate,
    externalWebsiteURL,
    finalSignupDate,
    isFree,
    latitude,
    location,
    longitude,
    maximumParticipants,
    name,
    prices,
    startDate,
    tags,
    useLajvstartSystem,
  } = extractEventFormData(formData)

  const eventImageFile = formData.get("eventPicture") as File | null
  const eventBannerFile = formData.get("eventBanner") as File | null

  let filePath: null | string = null
  let bannerFilePath: null | string = null

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
      date_end: endDate,
      date_signup: finalSignupDate || null,
      date_start: startDate,
      description,
      description_short: descriptionShort,
      display_mode: !useLajvstartSystem,
      event_banner_url: bannerFilePath,
      event_image_url: filePath,
      eventId,
      external_website_url: externalWebsiteURL || null,
      is_beginner_friendly: !!beginnerFriendly,
      location_latitude: latitude ? Number(latitude) : null,
      location_longitude: longitude ? Number(longitude) : null,
      location_name: location,
      maximum_participants:
        maximumParticipants === "" ? null : Number(maximumParticipants),
      minimum_age: ageRestriction === "" ? null : Number(ageRestriction),
      name,
      prices: isFree ? null : prices,
      tags: tags.split(","),
    })
  } catch (error) {
    console.error("Error when updating event", error)
    if (error instanceof Error) return errorResponse(error.message, 500)
  }

  return rewrite(`/api/event/updateResponse`)
}

export const DELETE: APIRoute = async ({ params, rewrite }) => {
  const eventId = params.eventId
  if (!eventId) return errorResponse("Missing event id")

  try {
    await softDeleteEvent({
      eventId,
    })

    return rewrite(`/events/my`)
  } catch (error) {
    console.error(error)
    if (error instanceof Error) return errorResponse(error.message, 500)
    return errorResponse("Unknown error", 500)
  }
}
