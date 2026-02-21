import type { EventPrice } from "../services/eventService"
import type { LARPEvent } from "../types/types"

import { PRICE_LEVEL_LIMIT } from "./constants"

export function extractEventFormData(formData: FormData) {
  const name = formData.get("name")?.toString()
  const startDate = formData.get("startDate")?.toString()
  const endDate = formData.get("endDate")?.toString()
  const location = formData.get("location")?.toString()
  const descriptionShort = formData.get("descriptionShort")?.toString()
  const description = formData.get("description")?.toString()
  const tags = formData.getAll("tags")?.toString()
  const beginnerFriendly = formData.get("beginnerFriendly")?.toString()
  const ageRestriction = formData.get("ageRestriction")?.toString()
  const maximumParticipants = formData.get("maximumParticipants")?.toString()
  const latitude = formData.get("latitude")?.toString()
  const longitude = formData.get("longitude")?.toString()
  const useLajvstartSystem = formData.get("useLajvstartSystem")?.toString()
  const finalSignupDate = formData.get("finalSignupDate")?.toString()
  const externalWebsiteURL = formData.get("externalWebsiteURL")?.toString()
  const isFree = formData.get("isFree")?.toString()

  const prices: EventPrice[] = []

  for (let index = 0; index < PRICE_LEVEL_LIMIT; index++) {
    const price = formData.get(`priceValue-${index}`)?.toString()
    const description = formData.get(`priceDescription-${index}`)?.toString()

    if (!price && !description) {
      break
    }

    prices.push({ description: description!, price: Number(price) })
  }

  if (name === undefined)
    throw new Error(`Missing form data name. Recieved: ${name}`)
  if (startDate === undefined)
    throw new Error(`Missing form data startDate. Recieved: ${startDate}`)
  if (endDate === undefined)
    throw new Error(`Missing form data endDate. Recieved: ${endDate}`)
  if (location === undefined)
    throw new Error(`Missing form data location. Recieved: ${location}`)
  if (description === undefined)
    throw new Error(`Missing form data description. Recieved: ${description}`)
  if (descriptionShort === undefined)
    throw new Error(
      `Missing form data descriptionShort. Recieved: ${descriptionShort}`,
    )
  if (tags === undefined)
    throw new Error(`Missing form data tags. Recieved: ${tags}`)

  return {
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
  }
}

export function groupEvents(events: LARPEvent[]) {
  const monthFormatter = new Intl.DateTimeFormat("sv", { month: "long" })

  const eventGroups: Record<number, Record<string, LARPEvent[]>> = {}

  events.forEach((event) => {
    const startDate = new Date(event.date_start)
    const eventYear = startDate.getFullYear()
    const eventMonth = monthFormatter.format(startDate)

    if (!eventGroups[eventYear]) eventGroups[eventYear] = {}
    if (!eventGroups[eventYear][eventMonth])
      eventGroups[eventYear][eventMonth] = []

    eventGroups[eventYear][eventMonth].push(event)
  })

  return eventGroups
}
