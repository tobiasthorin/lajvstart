import { supabase } from "../lib/supabase"
import type { Tables } from "../types/supabase"

export type UserDetails = Tables<"userDetails">

export type UserID = UserDetails["id"]

export async function getUserDetails(userId: UserID) {
  const { data, error } = await supabase
    .from("userDetails")
    .select()
    .limit(1)
    .eq("user_id", userId)
    .single()

  return { data, error }
}
