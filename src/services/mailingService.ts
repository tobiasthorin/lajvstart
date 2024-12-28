import { supabase } from "../lib/supabase"
import type { Tables } from "../types/supabase"
import type { EventID } from "./eventService"

export type Mailing = Tables<"mailings">

export async function createMailing(
  mailingData: Omit<Mailing, "id" | "created_at">,
) {
  const { error } = await supabase.from("mailings").insert(mailingData)

  if (error) throw new Error(error.message)
}

export async function getMailings(eventId: EventID) {
  const { error, data } = await supabase
    .from("mailings")
    .select()
    .eq("event_id", eventId)

  if (error) throw new Error(error.message)
  return data
}
