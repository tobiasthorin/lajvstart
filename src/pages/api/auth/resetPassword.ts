import type { APIRoute } from "astro"

import { supabase } from "../../../lib/supabase"

export const POST: APIRoute = async ({ redirect, request }) => {
  const formData = await request.formData()
  const password = formData.get("password")?.toString()
  const accessToken = formData.get("accessToken")?.toString()
  const refreshToken = formData.get("refreshToken")?.toString()

  if (!password || !accessToken || !refreshToken) {
    return new Response(
      '<p class="text-red-600">Email, tokens, is required<p>',
      {
        headers: new Headers({
          "Content-Type": "text/html",
        }),
        status: 400,
      },
    )
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  })

  if (sessionError) {
    return new Response(`<p class='text-red-600'>${sessionError.message}<p>`, {
      headers: new Headers({
        "Content-Type": "text/html",
      }),
      status: 403,
    })
  }

  await supabase.auth.updateUser({ password })

  return redirect("/signin")
}
