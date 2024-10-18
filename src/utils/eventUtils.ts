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
  const isDisplay = formData.get("isDisplay")?.toString()
  const finalSignupDate = formData.get("finalSignupDate")?.toString()
  const price = formData.get("price")?.toString()

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
  if (maximumParticipants === undefined)
    throw new Error(
      `Missing form data maximumParticipants. Recieved: ${maximumParticipants}`,
    )
  if (latitude === undefined)
    throw new Error(`Missing form data latitude. Recieved: ${latitude}`)
  if (longitude === undefined)
    throw new Error(`Missing form data longitude. Recieved: ${longitude}`)
  if (tags === undefined)
    throw new Error(`Missing form data tags. Recieved: ${tags}`)
  if (ageRestriction === undefined)
    throw new Error(
      `Missing form data ageRestriction. Recieved: ${ageRestriction}`,
    )
  if (finalSignupDate === undefined)
    throw new Error(
      `Missing form data finalSignupDate. Recieved: ${finalSignupDate}`,
    )
  if (price === undefined)
    throw new Error(`Missing form data price. Recieved: ${price}`)

  return {
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
  }
}
