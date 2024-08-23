import { nullable, z } from "zod"
import { supabase } from "../lib/supabase"
import type { EventID } from "./eventService"
import type { UserID } from "./userService"

const registrationDetailsSchema = z.object({
  name: z.string(),
  value: z.string(),
  type: z.enum(["textShort", "textLong", "number"]),
})

const registrationSchema = z
  .object({
    created_at: z.string(),
    details: z.array(registrationDetailsSchema),
    event_id: z.string(),
    id: z.string(),
    is_paid: z.boolean(),
    user_id: z.string(),
  })
  .nullable()

export type RegistrationDetails = z.infer<typeof registrationDetailsSchema>

export async function getRegistration(userId: UserID, eventId: EventID) {
  const { data: registration } = await supabase
    .from("registrations")
    .select()
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .single()

  return registrationSchema.parse(registration)
}
