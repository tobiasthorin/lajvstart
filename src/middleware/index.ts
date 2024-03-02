import { defineMiddleware } from "astro/middleware"
import { supabase } from "../lib/supabase"
import micromatch from "micromatch"
import { getUserDetails } from "../services/userService"

const protectedRoutes = [
  "/dashboard(|/)",
  "/profile(|/)",
  "/editProfile(|/)",
  "/profileDetails(|/)",
]
const redirectRoutes = ["/", "/signin(|/)", "/register(|/)"]

export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect }, next) => {
    if (micromatch.isMatch(url.pathname, protectedRoutes)) {
      console.log("protected")
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

      const { data: userDetails, error: userError } = await getUserDetails(
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

      locals.user = {
        id: sessionData.user?.id!,
        email: sessionData.user?.email!,
        details: userDetails!,
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
        return redirect("/dashboard")
      }
    }

    return next()
  }
)
