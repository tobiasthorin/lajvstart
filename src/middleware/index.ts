import { defineMiddleware } from "astro/middleware"
import { supabase } from "../lib/supabase"
import micromatch from "micromatch"
import { getUserDetails } from "../services/userService"

const protectedRoutes = ["/dashboard(|/)", "/profile(|/)"]
const redirectRoutes = ["/", "/signin(|/)", "/register(|/)"]

export const onRequest = defineMiddleware(
  async ({ locals, url, cookies, redirect }, next) => {
    if (micromatch.isMatch(url.pathname, protectedRoutes)) {
      const accessToken = cookies.get("sb-access-token")
      const refreshToken = cookies.get("sb-refresh-token")

      const isSignedOut = !accessToken || !refreshToken

      if (isSignedOut) {
        return redirect("/signin")
      }

      const { data, error } = await supabase.auth.setSession({
        refresh_token: refreshToken.value,
        access_token: accessToken.value,
      })

      const { data: userDetails, error: userError } = await getUserDetails(
        data.user?.id!
      )

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("user-files")
        .getPublicUrl(`avatars/${data.user?.email!}`)

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
        id: data.user?.id!,
        email: data.user?.email!,
        details: userDetails!,
        avatarUrl: publicUrl,
      }

      cookies.set("sb-access-token", data?.session?.access_token!, {
        sameSite: "lax",
        path: "/",
        secure: true,
      })
      cookies.set("sb-refresh-token", data?.session?.refresh_token!, {
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
