import { describe, expect, it } from "vitest"

import type { RegistrationDetails } from "../services/registrationService"

import { getGroupedDetails } from "./registrationUtils"

describe("getGroupedDetails", () => {
  it("should group details by name", () => {
    const details: RegistrationDetails[] = [
      { name: "email", value: "test@example.com" },
      { name: "phone", value: "123456789" },
      { name: "email", value: "another@example.com" },
    ]

    const result = getGroupedDetails(details)

    expect(result.email).toEqual(["test@example.com", "another@example.com"])
    expect(result.phone).toEqual(["123456789"])
  })

  it("should handle single value per name", () => {
    const details: RegistrationDetails[] = [
      { name: "firstName", value: "John" },
      { name: "lastName", value: "Doe" },
    ]

    const result = getGroupedDetails(details)

    expect(result.firstName).toEqual(["John"])
    expect(result.lastName).toEqual(["Doe"])
  })

  it("should handle multiple values for same name", () => {
    const details: RegistrationDetails[] = [
      { name: "skills", value: "Combat" },
      { name: "skills", value: "Roleplay" },
      { name: "skills", value: "Crafting" },
    ]

    const result = getGroupedDetails(details)

    expect(result.skills).toEqual(["Combat", "Roleplay", "Crafting"])
    expect(result.skills?.length).toBe(3)
  })

  it("should return empty object for empty array", () => {
    const result = getGroupedDetails([])
    expect(result).toEqual({})
  })

  it("should preserve order of values", () => {
    const details: RegistrationDetails[] = [
      { name: "rank", value: "first" },
      { name: "rank", value: "second" },
      { name: "rank", value: "third" },
    ]

    const result = getGroupedDetails(details)

    expect(result.rank).toEqual(["first", "second", "third"])
  })

  it("should handle mixed single and multiple values", () => {
    const details: RegistrationDetails[] = [
      { name: "character", value: "Aragorn" },
      { name: "experience", value: "Beginner" },
      { name: "experience", value: "Intermediate" },
      { name: "role", value: "Warrior" },
    ]

    const result = getGroupedDetails(details)

    expect(result.character).toEqual(["Aragorn"])
    expect(result.experience).toEqual(["Beginner", "Intermediate"])
    expect(result.role).toEqual(["Warrior"])
  })

  it("should handle special characters in values", () => {
    const details: RegistrationDetails[] = [
      { name: "comment", value: "Hello & goodbye" },
      { name: "comment", value: 'Café "espresso"' },
    ]

    const result = getGroupedDetails(details)

    expect(result.comment).toEqual(["Hello & goodbye", 'Café "espresso"'])
  })

  it("should handle empty string values", () => {
    const details: RegistrationDetails[] = [
      { name: "field", value: "" },
      { name: "field", value: "non-empty" },
    ]

    const result = getGroupedDetails(details)

    expect(result.field).toEqual(["", "non-empty"])
  })

  it("should handle numeric values as strings", () => {
    const details: RegistrationDetails[] = [
      { name: "count", value: "1" },
      { name: "count", value: "2" },
      { name: "count", value: "3" },
    ]

    const result = getGroupedDetails(details)

    expect(result.count).toEqual(["1", "2", "3"])
  })
})
