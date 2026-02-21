import type { Tables } from "../types/supabase"
import type { EventID } from "./eventService"

import { supabase } from "../lib/supabase"

export type Mailing = Tables<"mailings">

export async function createMailing(
  mailingData: Omit<Mailing, "created_at" | "id">,
) {
  const { error } = await supabase.from("mailings").insert(mailingData)

  if (error) throw new Error(error.message)
}

export async function getMailings(eventId: EventID) {
  const { data, error } = await supabase
    .from("mailings")
    .select()
    .eq("event_id", eventId)

  if (error) throw new Error(error.message)
  return data
}
