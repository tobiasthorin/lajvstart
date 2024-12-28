import { supabase } from "../lib/supabase"
import type { Tables } from "../types/supabase"
import type { EventID } from "./eventService"
import type { UserDetails, UserID } from "./userService"

export type Favourite = Tables<"favourites">

export async function getFavourite(userId: UserID, eventId: EventID) {
  const { data } = await supabase
    .from("favourites")
    .select()
    .eq("user_id", userId)
    .eq("event_id", eventId)
    .single()

  return data
}

export async function toggleFavourite(
  userId: UserID,
  eventId: EventID,
  userDetails: UserDetails,
) {
  const favourite = await getFavourite(userId, eventId)

  if (!favourite) {
    const { error, data } = await supabase
      .from("favourites")
      .insert([
        {
          event_id: eventId,
          user_id: userId,
          user_details: userDetails.id,
        },
      ])
      .select()
      .single()

    if (error) throw new Error(error.message)

    return data
  } else {
    const { error } = await supabase
      .from("favourites")
      .delete()
      .eq("id", favourite.id)

    if (error) throw new Error(error.message)

    return null
  }
}

export async function getFavouritesForEvent(eventId: EventID) {
  const { error, data } = await supabase
    .from("favourites")
    .select(
      `
      *,
      user_details(
        email
      )`,
    )
    .eq("event_id", eventId)

  if (error) throw new Error(error.message)
  return data
}
