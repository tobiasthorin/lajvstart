import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../../../utils/constants"

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 })
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return new Response(error.message, { status: 500 })
  }

  const { access_token, refresh_token } = data.session
  cookies.set(ACCESS_TOKEN_COOKIE, access_token, { path: "/" })
  cookies.set(REFRESH_TOKEN_COOKIE, refresh_token, { path: "/" })

  return redirect("/dashboard")
}
