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

  if (
    !name ||
    !startDate ||
    !endDate ||
    !location ||
    !description ||
    !descriptionShort ||
    !maximumParticipants ||
    !latitude ||
    !longitude ||
    !tags ||
    !ageRestriction ||
    isDisplay === undefined ||
    beginnerFriendly === undefined ||
    !finalSignupDate
  ) {
    throw new Error("Missing form data")
  }

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
  }
}
