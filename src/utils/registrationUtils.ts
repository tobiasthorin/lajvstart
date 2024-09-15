import type { RegistrationDetails } from "../services/registrationService"

export function getDetailValue(detail: RegistrationDetails) {
  switch (detail.type) {
    case "number":
    case "textShort":
    case "textLong":
      return detail.value
  }
}
