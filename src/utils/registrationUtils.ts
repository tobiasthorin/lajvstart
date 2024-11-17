import type { RegistrationDetails } from "../services/registrationService"

export function getGroupedDetails(details: RegistrationDetails[]) {
  const groupedDetails: Record<string, string[]> = {}

  details.forEach((detail) => {
    if (groupedDetails[detail.name]) {
      groupedDetails[detail.name]!.push(detail.value)
    } else {
      groupedDetails[detail.name] = [detail.value]
    }
  })

  return groupedDetails
}
