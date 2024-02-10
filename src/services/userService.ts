import { supabase } from "../lib/supabase"

export type UserID = string

export async function getUserDetails(userId: UserID) {
  const { data, error } = await supabase
    .from("userDetails")
    .select()
    .limit(1)
    .eq("userId", userId)
    .single()

  return { data, error }
}
