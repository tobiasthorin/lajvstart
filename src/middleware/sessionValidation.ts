import { supabase } from "../lib/supabase"
import micromatch from "micromatch"
import { getUserDetails, type UserDetails } from "../services/userService"
import { log } from "../lib/logger"
import type { APIContext, MiddlewareNext } from "astro"

const protectedRoutes = [
  "/profile/**",
  "/characters/**",
  "/api/favourite/**",
  "/api/event/**",
  "/events/*/manage/**",
]
const publicRoutes = ["/events", "/events/*", "/map"]

export async function sessionValidation(
  context: APIContext,
  next: MiddlewareNext,
) {
  const { locals, url, cookies, redirect } = context
  // login paths and such that is the same regardless of logged in state
  if (
    !micromatch.isMatch(url.pathname, [...protectedRoutes, ...publicRoutes])
  ) {
    log(`Accessing unprotected route: ${url.pathname}`)
    return next()
  } else {
    log(`Accessing protected route: ${url.pathname}`)

    const accessToken = cookies.get("sb-access-token")
    const refreshToken = cookies.get("sb-refresh-token")

    // Not signed in
    if (!accessToken || !refreshToken) {
      if (micromatch.isMatch(url.pathname, publicRoutes)) {
        log(`Accessing public route, but is not signed in`)
        // Public routes can still be accessed, but in logged-out state
        locals.isSignedIn = false
        return next()
      } else {
        log(
          `Tried accessing private route, but is not signed in. Deleting cookies and redirecting.`,
        )
        // Private routes require login
        cookies.delete("sb-access-token", { path: "/" })
        cookies.delete("sb-refresh-token", { path: "/" })
        return redirect("/events")
      }
    }

    // Signed in, but is the session still valid?
    let userDetails: UserDetails | null

    const { data: userData, error: userError } = await supabase.auth.getUser(
      accessToken.value,
    )

    if (userError) log(`userError: ${userError}`)

    if (userData) {
      log("Found user data")

      const { data } = await getUserDetails(userData.user?.id!)
      userDetails = data
    } else {
      log("No user data, trying to set session")

      const { data: sessionData, error: sessionError } =
        await supabase.auth.setSession({
          refresh_token: refreshToken.value,
          access_token: accessToken.value,
        })

      if (sessionError) {
        log(`sessionError: ${sessionError}`)
      } else {
        log("Setting new cookies with fresh session")
        cookies.set("sb-access-token", sessionData.session?.access_token!, {
          sameSite: "lax",
          path: "/",
          secure: true,
          maxAge: 60 * 30, // 30 minutes
        })
        cookies.set("sb-refresh-token", sessionData.session?.refresh_token!, {
          sameSite: "lax",
          path: "/",
          secure: true,
          maxAge: 60 * 60 * 24 * 30, // 30 days
        })
      }

      const { data } = await getUserDetails(sessionData.user?.id!)
      userDetails = data
    }

    if (!userDetails) {
      log(`No session found or set, redirecting to events.`)

      cookies.delete("sb-access-token", { path: "/" })
      cookies.delete("sb-refresh-token", { path: "/" })
      return redirect("/events")
    }

    locals.isSignedIn = true
    locals.user = {
      id: userDetails.user_id,
      email: userDetails.email,
      details: userDetails,
    }
    return next()
  }
}
