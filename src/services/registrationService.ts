import { z } from "zod"
import { supabase } from "../lib/supabase"
import type { EventID } from "./eventService"
import type { UserDetails, UserID } from "./userService"

const registrationDetailsSchema = z.object({
  name: z.string(),
  value: z.string(),
  type: z.enum(["textShort", "textLong", "number"]),
})

const registrationSchema = z.object({
  created_at: z.string(),
  details: z.array(registrationDetailsSchema),
  event_id: z.string(),
  id: z.string(),
  is_paid: z.boolean(),
  user_id: z.string(),
  user_details: z.object({
    name: z.string(),
    special_needs: z.string().nullable(),
  }),
})

const registrationsSchema = z.array(registrationSchema)

export type Registration = z.infer<typeof registrationSchema>
export type RegistrationDetails = z.infer<typeof registrationDetailsSchema>

export async function createRegistration(
  eventId: EventID,
  userId: UserID,
  userDetailsId: UserDetails["user_id"],
  details: RegistrationDetails[]
) {
  const { error: createRegistrationError } = await supabase
    .from("registrations")
    .insert({
      event_id: eventId,
      user_id: userId,
      is_paid: false,
      details,
      user_details: userDetailsId,
    })

  if (createRegistrationError) throw new Error(createRegistrationError.message)
}

export async function replaceRegistration(
  registrationId: Registration["id"],
  details: RegistrationDetails[]
) {
  const { error: updateRegistrationError } = await supabase
    .from("registrations")
    .update({
      details,
    })
    .eq("id", registrationId)

  if (updateRegistrationError) throw new Error(updateRegistrationError.message)
}

export async function getRegistration(userId: UserID, eventId: EventID) {
  const { data: registration } = await supabase
    .from("registrations")
    .select(
      `
      *,
      user_details (
        name,
        special_needs
      )
      `
    )
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .eq("deleted", false)
    .single()

  if (registration === null) return null

  return registrationSchema.parse(registration)
}

export async function getRegistrations(eventId: EventID) {
  const { data: registrations } = await supabase
    .from("registrations")
    .select(
      `
      *,
      user_details (
        name,
        special_needs
      )
      `
    )
    .eq("event_id", eventId)
    .eq("deleted", false)

  return registrationsSchema.parse(registrations)
}

export async function deleteRegistration(
  eventId: EventID,
  registrationId: Registration["id"]
) {
  const { error: updateRegistrationError } = await supabase
    .from("registrations")
    .update({ deleted: true })
    .eq("id", registrationId)
    .eq("event_id", eventId)

  if (updateRegistrationError) throw new Error(updateRegistrationError.message)
}

export async function updateRegistration(
  userId: UserID,
  eventId: EventID,
  fields: { isPaid: boolean | undefined }
) {
  const registration = await getRegistration(userId, eventId)

  if (!registration)
    throw new Error(
      `Could not find registration for user ${userId}, event ${eventId}`
    )
  console.log(fields.isPaid !== undefined, fields.isPaid, registration.is_paid)
  const { error: updateRegistrationError } = await supabase
    .from("registrations")
    .update({
      is_paid:
        fields.isPaid !== undefined ? fields.isPaid : registration.is_paid,
    })
    .eq("id", registration.id)
    .eq("event_id", eventId)

  if (updateRegistrationError) throw new Error(updateRegistrationError.message)
}
