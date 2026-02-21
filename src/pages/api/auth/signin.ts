import type { APIRoute } from "astro"

import { supabase } from "../../../lib/supabase"

export const POST: APIRoute = async ({ cookies, request }) => {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return new Response(
      '<p class="text-red-600">Email and password are required<p>',
      {
        headers: new Headers({
          "Content-Type": "text/html",
        }),
        status: 400,
      },
    )
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return new Response(`<p class='text-red-600'>${error.message}<p>`, {
      headers: new Headers({
        "Content-Type": "text/html",
      }),
      status: 403,
    })
  }

  const { access_token, refresh_token } = data.session
  cookies.set("sb-access-token", access_token, {
    path: "/",
    sameSite: "lax",
    secure: true,
  })
  cookies.set("sb-refresh-token", refresh_token, {
    path: "/",
    sameSite: "lax",
    secure: true,
  })

  return new Response(null, {
    headers: { "HX-Redirect": "/events" },
    status: 302,
  })
}
