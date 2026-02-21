import type { APIRoute } from "astro"

import { v4 as uuidv4 } from "uuid"

import type { LARPEvent } from "../../../types/types"

import { useNamespace, USER_EVENTS_CACHE } from "../../../lib/cache"
import { createEvent } from "../../../services/eventService"
import { BadRequestError, InternalError } from "../../../utils/errorUtils"
import { extractEventFormData } from "../../../utils/eventUtils"
import { errorResponse } from "../../../utils/responseUtils"
import {
  uploadEventBanner,
  uploadEventPicture,
} from "../../../utils/storageUtils"

export const POST: APIRoute = async ({ request }) => {
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
  const eventId = uuidv4()

  if (eventImageFile) {
    try {
      filePath = await uploadEventPicture(eventImageFile, eventId)
    } catch (error) {
      console.error(error)
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

  let createdId: string = ""

  try {
    const createdEvent = createEvent({
      currency: "SEK",
      date_end: endDate,
      date_signup: finalSignupDate || null,
      date_start: startDate,
      description,
      description_short: descriptionShort,
      display_mode: !useLajvstartSystem,
      event_banner_url: bannerFilePath,
      event_image_url: filePath,
      external_website_url: externalWebsiteURL || null,
      id: eventId,
      is_beginner_friendly: !!beginnerFriendly,
      is_published: false,
      location_latitude: latitude ? Number(latitude) : null,
      location_longitude: longitude ? Number(longitude) : null,
      location_name: location,
      maximum_participants: maximumParticipants
        ? Number(maximumParticipants)
        : null,
      minimum_age: ageRestriction ? Number(ageRestriction) : null,
      name,
      prices: isFree ? null : prices,
      tags: tags.split(","),
    })

    createdId = (await createdEvent).id
  } catch (error) {
    console.error("Error when creating event", error)
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
