import { USERS_CACHE, useNamespace } from "../lib/cache"
import { supabase } from "../lib/supabase"
import type { Tables } from "../types/supabase"

export type UserDetails = Tables<"user_details">

export type UserID = UserDetails["id"]

const usersCache = useNamespace<UserDetails>(USERS_CACHE)

export async function getUserDetails(userId: UserID) {
  const cachedData = usersCache.get(userId)
  if (cachedData) return { data: cachedData, error: null }

  const { data, error } = await supabase
    .from("user_details")
    .select()
    .limit(1)
    .eq("user_id", userId)
    .single()

  if (!error) usersCache.set(userId, data, 1000 * 60 * 60)

  return { data, error }
}

export async function getUserDetailsByEmail(email: string) {
  const { data, error } = await supabase
    .from("user_details")
    .select()
    .limit(1)
    .eq("email", email)
    .single()

  if (!error) usersCache.set(data.user_id, data, 1000 * 60 * 60)

  return { data, error }
}
