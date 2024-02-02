import type { AstroCookies } from "astro"
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./constants"

export function isLoggedIn(cookies: AstroCookies) {
  const accessToken = cookies.get(ACCESS_TOKEN_COOKIE)
  const refreshToken = cookies.get(REFRESH_TOKEN_COOKIE)

  return accessToken && refreshToken
}
