import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"
import { uploadEventPicture } from "../../../utils/storageUtils"
import { BadRequestError, InternalError } from "../../../utils/errorUtils"
import { errorResponse } from "../../../utils/responseUtils"
import { v4 as uuidv4 } from "uuid"
import { EVENTS_CACHE, useNamespace } from "../../../lib/cache"

export const POST: APIRoute = async ({ request, redirect }) => {
  const eventsCache = useNamespace(EVENTS_CACHE)
  const formData = await request.formData()

  const name = formData.get("name")?.toString()
  const startDate = formData.get("startDate")?.toString()
  const endDate = formData.get("endDate")?.toString()
  const location = formData.get("location")?.toString()
  const descriptionShort = formData.get("descriptionShort")?.toString()
  const description = formData.get("description")?.toString()
  const tags = formData.getAll("tags")?.toString()
  const beginnerFriendly = formData.get("beginnerFriendly")?.toString()
  const ageRestriction = formData.get("ageRestriction")?.toString()

  if (
    !name ||
    !startDate ||
    !endDate ||
    !location ||
    !description ||
    !descriptionShort
  )
    return new Response()

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

  const { error: createEventError } = await supabase.from("events").insert({
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
  })

  if (createEventError) return errorResponse(createEventError.message, 500)

  eventsCache.clear()

  return new Response(null, {
    headers: new Headers({
      "HX-Location": '{"path":"/events", "target":"#main"}',
    }),
  })
}
