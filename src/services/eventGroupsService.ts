import { supabase } from "../lib/supabase"
import type { EventID } from "./eventService"
import type { Tables } from "../types/supabase"

export type EventGroup = Tables<"event_groups">

export async function getEventGroups(eventId: EventID) {
  const { data: groups } = await supabase
    .from("event_groups")
    .select()
    .eq("event_id", eventId)
    .eq("deleted", false)

  return groups
}

export async function createEventGroup(
  eventId: EventID,
  groupName: EventGroup["name"],
  description: EventGroup["description"] | undefined,
) {
  const { data, error: createGroupError } = await supabase
    .from("event_groups")
    .insert({
      event_id: eventId,
      name: groupName,
      description: description || null,
    })
    .select()
    .single()

  if (createGroupError) throw new Error(createGroupError.message)

  return data
}
