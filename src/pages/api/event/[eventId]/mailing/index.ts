import type { APIRoute } from "astro"

import { sendEmail } from "../../../../../services/emailService"
import { getEvent } from "../../../../../services/eventService"
import { getFavouritesForEvent } from "../../../../../services/favouritesService"
import { createMailing } from "../../../../../services/mailingService"
import { getRegistrationsForEvent } from "../../../../../services/registrationService"
import { errorResponse } from "../../../../../utils/responseUtils"

export const POST: APIRoute = async ({ params, request, rewrite }) => {
  const eventId = params.eventId

  if (!eventId) return errorResponse("Missing event id")

  const formData = await request.clone().formData()

  const subject = formData.get("subject")?.toString()
  const toGroups = formData.getAll("toGroups").toString()
  const toFavourites = Boolean(formData.get("toFavourites"))
  const toAdditional = formData.get("toAdditional")?.toString()
  const body = formData.get("body")?.toString()

  if (!subject) return errorResponse("Missing subject", 400)
  if (!body) return errorResponse("Missing body", 400)

  const allAddresses = new Set<string>()

  if (toAdditional) {
    toAdditional
      .split(",")
      .map((address) => address.trim())
      .forEach((address) => allAddresses.add(address))
  }

  if (toGroups) {
    const registrations = await getRegistrationsForEvent(eventId)

    registrations
      .filter(
        (registration) =>
          registration.event_group &&
          toGroups.includes(registration.event_group.id),
      )
      .map((registration) => registration.user_details.email)
      .forEach((address) => allAddresses.add(address))
  }

  if (toFavourites) {
    const favourites = await getFavouritesForEvent(eventId)
    favourites.forEach((favourite) =>
      allAddresses.add(favourite.user_details?.email || ""),
    )
  }

  const event = await getEvent(eventId)

  await sendEmail({
    body,
    eventName: event.name,
    recipients: [...allAddresses.values()],
    subject,
  })

  await createMailing({
    body,
    event_id: eventId,
    subject,
    to: [...allAddresses.values()],
  })

  return rewrite(`/events/${eventId}/manage/mailings`)
}
