import { z } from "zod"

import type { EventGroup } from "./eventGroupsService"
import type { UserDetails, UserID } from "./userService"

import { supabase } from "../lib/supabase"
import { type EventID } from "./eventService"

const registrationDetailsSchema = z.object({
  name: z.string(),
  value: z.string(),
})

const registrationSchema = z.object({
  created_at: z.string(),
  details: z.array(registrationDetailsSchema),
  event_group: z
    .object({
      description: z.string().nullable(),
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
  event_id: z.string(),
  id: z.string(),
  is_approved: z.boolean(),
  is_paid: z.boolean(),
  user_details: z.object({
    email: z.string(),
    name: z.string(),
    special_needs: z.string().nullable(),
  }),
  user_id: z.string(),
})

const registrationsSchema = z.array(registrationSchema)

export type Registration = z.infer<typeof registrationSchema>
export type RegistrationDetails = z.infer<typeof registrationDetailsSchema>

const registrationQuery = `
      *,
      user_details (
        name,
        special_needs,
        email
      ),
      event_group (
        id,
        name,
        description
      )
      `

export async function createRegistration(
  eventId: EventID,
  userId: UserID,
  userDetailsId: UserDetails["user_id"],
  eventGroupId: EventGroup["id"] | null,
  details: RegistrationDetails[],
) {
  const { error: createRegistrationError } = await supabase
    .from("registrations")
    .insert({
      details,
      event_group: eventGroupId,
      event_id: eventId,
      is_paid: false,
      user_details: userDetailsId,
      user_id: userId,
    })

  if (createRegistrationError) throw new Error(createRegistrationError.message)
}

export async function deleteRegistration(
  eventId: EventID,
  registrationId: Registration["id"],
) {
  const { error: updateRegistrationError } = await supabase
    .from("registrations")
    .update({ deleted: true })
    .eq("id", registrationId)
    .eq("event_id", eventId)

  if (updateRegistrationError) throw new Error(updateRegistrationError.message)
}

export async function findRegistration(userId: UserID, eventId: EventID) {
  const { data: registration } = await supabase
    .from("registrations")
    .select(registrationQuery)
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
    .select(registrationQuery)
    .eq("id", registrationID)
    .eq("deleted", false)
    .single()

  if (registration === null) return null

  return registrationSchema.parse(registration)
}

export async function getRegistrationsForEvent(eventId: EventID) {
  const { data, error } = await supabase
    .from("registrations")
    .select(registrationQuery)
    .eq("event_id", eventId)
    .eq("deleted", false)

  if (error) throw new Error(error.message)
  if (!data) return []

  const parsedData = registrationsSchema.parse(data)
  const sortedData = parsedData.sort((a, b) => {
    if (a.user_details?.name > b.user_details?.name) return 1
    if (a.user_details?.name < b.user_details?.name) return -1
    return 0
  })

  return sortedData
}

export async function replaceRegistration(
  registrationId: Registration["id"],
  eventGroupId: EventGroup["id"] | null,
  details: RegistrationDetails[],
) {
  const { error: updateRegistrationError } = await supabase
    .from("registrations")
    .update({
      details,
      event_group: eventGroupId,
    })
    .eq("id", registrationId)

  if (updateRegistrationError) throw new Error(updateRegistrationError.message)
}

export async function updateRegistration(
  registrationId: UserID,
  {
    groupId,
    isApproved,
    isPaid,
  }: {
    groupId?: null | string | undefined
    isApproved?: boolean | undefined
    isPaid?: boolean | undefined
  },
) {
  const registration = await getRegistration(registrationId)

  if (!registration)
    throw new Error(`Could not find registration with id ${registrationId}`)

  const { error: updateRegistrationError } = await supabase
    .from("registrations")
    .update({
      event_group:
        groupId !== undefined ? groupId : registration.event_group?.id || null,
      is_approved:
        isApproved !== undefined ? isApproved : registration.is_approved,
      is_paid: isPaid !== undefined ? isPaid : registration.is_paid,
    })
    .eq("id", registration.id)

  if (updateRegistrationError) throw new Error(updateRegistrationError.message)
}
