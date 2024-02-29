import { supabase } from "../lib/supabase"
import type { Tables } from "../types/supabase"

export type UserDetails = Tables<"user_details">

export type UserID = UserDetails["id"]

export async function getUserDetails(userId: UserID) {
  const { data, error } = await supabase
    .from("user_details")
    .select()
    .limit(1)
    .eq("user_id", userId)
    .single()

  return { data, error }
}
