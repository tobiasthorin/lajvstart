import type { AstroCookies } from "astro"
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./constants"
import { supabase } from "../lib/supabase"

export async function isSignedIn(cookies: AstroCookies) {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE)
  const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE)

  if (!accessToken || !refreshToken) {
    return false
  }

  const { data, error } = await supabase.auth.setSession({
    refresh_token: refreshToken.value,
    access_token: accessToken.value,
  })

  if (error || !data.user) {
    cookies.delete(ACCESS_TOKEN_COOKIE, { path: "/" })
    cookies.delete(REFRESH_TOKEN_COOKIE, { path: "/" })

    return false
  }

  return data
}
