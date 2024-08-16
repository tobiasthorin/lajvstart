import { supabase } from "../lib/supabase"
import type { Tables } from "../types/supabase"
import type { EventID } from "./eventService"
import type { UserID } from "./userService"

export type Favourite = Tables<"favourites">

export async function getFavourite(userId: UserID, eventId: EventID) {
  const { data: favourite } = await supabase
    .from("favourites")
    .select()
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .eq("deleted", false)
    .single()

  return favourite
}

export async function toggleFavourite(userId: UserID, eventId: EventID) {
  const favourite = await getFavourite(userId, eventId)

  if (!favourite) {
    const { error, data } = await supabase
      .from("favourites")
      .insert([
        {
          event_id: eventId,
          user_id: userId,
        },
      ])
      .select()
      .single()

    if (error) throw new Error(error.message)

    return data
  } else {
    const { error } = await supabase
      .from("favourites")
      .update({ deleted: true })
      .eq("id", favourite.id)

    if (error) throw new Error(error.message)

    return null
  }
}
