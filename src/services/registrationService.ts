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
})

const userDetailsSchema = z.object({
  user_details: z.object({
    name: z.string(),
    special_needs: z.string().nullable(),
  }),
})
const registrationsSchema = z.array(
  z.intersection(registrationSchema, userDetailsSchema)
)

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

export async function updateRegistration(
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
    .select()
    .eq("user_id", userId)
    .eq("event_id", eventId)
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

  return registrationsSchema.parse(registrations)
}

export async function deleteRegistration(registrationId) {
  const { error: updateRegistrationError } = await supabase
    .from("registrations")
    .update()
    .eq("id", registrationId)

  if (updateRegistrationError) throw new Error(updateRegistrationError.message)
}
