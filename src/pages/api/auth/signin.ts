import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"

export const POST: APIRoute = async ({ request, cookies }) => {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return new Response(
      '<p class="text-red-600">Email and password are required<p>',
      {
        status: 400,
        headers: new Headers({
          "Content-Type": "text/html",
        }),
      }
    )
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return new Response(`<p class='text-red-600'>${error.message}<p>`, {
      status: 403,
      headers: new Headers({
        "Content-Type": "text/html",
      }),
    })
  }

  const { access_token, refresh_token } = data.session
  cookies.set("sb-access-token", access_token, {
    sameSite: "lax",
    path: "/",
    secure: true,
  })
  cookies.set("sb-refresh-token", refresh_token, {
    sameSite: "lax",
    path: "/",
    secure: true,
  })

  return new Response(null, {
    status: 302,
    headers: { "HX-Redirect": "/dashboard" },
  })
}
