import { defineMiddleware } from "astro/middleware"
import { supabase } from "../lib/supabase"
import micromatch from "micromatch"
import { getUserDetails, type UserDetails } from "../services/userService"
import { log } from "../lib/logger"
import { useNamespace } from "../lib/cache"

const protectedRoutes = ["/events(|/)*", "/profile(|/)*"]
const redirectRoutes = ["/", "/signin(|/)", "/register(|/)"]

const usersCache = useNamespace<UserDetails>("users")

export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect }, next) => {
    if (micromatch.isMatch(url.pathname, protectedRoutes)) {
      log(`Accessing protected route: ${url.pathname}`)
      const accessToken = cookies.get("sb-access-token")
      const refreshToken = cookies.get("sb-refresh-token")

      const isSignedOut = !accessToken || !refreshToken

      if (isSignedOut) {
        return redirect("/signin")
      }

      const { data: sessionData, error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      })

      let userDetails = usersCache.get(sessionData.user?.id!)

      if (!userDetails) {
        log(`Getting user details for ${sessionData.user?.id!} from DB.`)

        const { data: userData, error: userError } = await getUserDetails(
          sessionData.user?.id!
        )

        if (error || userError) {
          cookies.delete("sb-access-token", {
            path: "/",
          })
          cookies.delete("sb-refresh-token", {
            path: "/",
          })
          return redirect("/signin")
        }

        usersCache.set(sessionData.user?.id!, userData!, 1000 * 60 * 60)
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
      })
      cookies.set("sb-refresh-token", sessionData?.session?.refresh_token!, {
        sameSite: "lax",
        path: "/",
        secure: true,
      })
    }

    if (micromatch.isMatch(url.pathname, redirectRoutes)) {
      const accessToken = cookies.get("sb-access-token")
      const refreshToken = cookies.get("sb-refresh-token")

      const isSignedIn = accessToken && refreshToken

      if (isSignedIn) {
        log(`Logged in user redirectinng to '/events'`)
        return redirect("/events")
      }
    }

    return next()
  }
)
