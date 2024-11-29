import { supabase } from "../lib/supabase"
import micromatch from "micromatch"
import { getUserDetails, type UserDetails } from "../services/userService"
import { log } from "../lib/logger"
import { useNamespace, USERS_CACHE } from "../lib/cache"
import type { APIContext, MiddlewareNext } from "astro"

const protectedRoutes = [
  "/profile/**",
  "/characters/**",
  "/api/favourite/**",
  "/api/event/**",
]
const publicRoutes = ["/events/**", "/map"]

const usersCache = useNamespace<UserDetails>(USERS_CACHE)

export async function sessionValidation(
  context: APIContext,
  next: MiddlewareNext,
) {
  const { locals, url, cookies, redirect } = context

  if (micromatch.isMatch(url.pathname, protectedRoutes)) {
    log(`Accessing protected route: ${url.pathname}`)
  } else {
    log(`Accessing unprotected route: ${url.pathname}`)
  }

  if (micromatch.isMatch(url.pathname, [...protectedRoutes, ...publicRoutes])) {
    const accessToken = cookies.get("sb-access-token")
    const refreshToken = cookies.get("sb-refresh-token")

    const isSignedOut = !accessToken || !refreshToken
    if (isSignedOut) {
      locals.isSignedIn = false

      if (!micromatch.isMatch(url.pathname, publicRoutes)) {
        return redirect("/events")
      }
    } else {
      locals.isSignedIn = true

      const { data: sessionData, error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      })

      let userDetails = usersCache.get(sessionData.user?.id!)

      if (!userDetails) {
        log(`Getting user details for ${sessionData.user?.id!} from DB.`)

        const { data: userData, error: userError } = await getUserDetails(
          sessionData.user?.id!,
        )

        if (error || userError) {
          cookies.delete("sb-access-token", { path: "/" })
          cookies.delete("sb-refresh-token", { path: "/" })
          return redirect("/events")
        }

        userDetails = userData!
      }

      locals.user = {
        id: sessionData.user?.id!,
        email: sessionData.user?.email!,
        details: userDetails,
      }

      cookies.set("sb-access-token", sessionData?.session?.access_token!, {
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 60 * 30, // 30 minutes
      })
      cookies.set("sb-refresh-token", sessionData?.session?.refresh_token!, {
        sameSite: "lax",
        path: "/",
        secure: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
      })
    }
  }

  return next()
}
