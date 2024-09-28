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
  event_group: z
    .object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
    })
    .nullable(),
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

export async function findRegistration(userId: UserID, eventId: EventID) {
  const { data: registration } = await supabase
    .from("registrations")
    .select(
      `
      *,
      user_details (
        name,
        special_needs
      ),
      event_group (
        id,
        name,
        description
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

export async function getRegistration(registrationID: Registration["id"]) {
  const { data: registration } = await supabase
    .from("registrations")
    .select(
      `
      *,
      user_details (
        name,
        special_needs
      ),
      event_group (
        id,
        name,
        description
      )
      `
    )
    .eq("id", registrationID)
    .eq("deleted", false)
    .single()

  if (registration === null) return null

  return registrationSchema.parse(registration)
}

export async function getRegistrationsForEvent(eventId: EventID) {
  const { data: registrations } = await supabase
    .from("registrations")
    .select(
      `
      *,
      user_details (
        name,
        special_needs
      ),
      event_group (
        id,
        name,
        description
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
  registrationId: UserID,
  {
    isPaid,
    groupId,
  }: { isPaid?: boolean | undefined; groupId?: string | null | undefined }
) {
  const registration = await getRegistration(registrationId)

  if (!registration)
    throw new Error(`Could not find registration with id ${registrationId}`)

  const { error: updateRegistrationError } = await supabase
    .from("registrations")
    .update({
      is_paid: isPaid !== undefined ? isPaid : registration.is_paid,
      event_group:
        groupId !== undefined ? groupId : registration.event_group?.id || null,
    })
    .eq("id", registration.id)

  if (updateRegistrationError) throw new Error(updateRegistrationError.message)
}
