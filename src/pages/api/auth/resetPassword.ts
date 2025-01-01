import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData()
  const password = formData.get("password")?.toString()
  const accessToken = formData.get("accessToken")?.toString()
  const refreshToken = formData.get("refreshToken")?.toString()

  if (!password || !accessToken || !refreshToken) {
    return new Response(
      '<p class="text-red-600">Email, tokens, is required<p>',
      {
        status: 400,
        headers: new Headers({
          "Content-Type": "text/html",
        }),
      },
    )
  }

  const { error: sessionError } = await supabase.auth.setSession({
    refresh_token: refreshToken,
    access_token: accessToken,
  })

  if (sessionError) {
    return new Response(`<p class='text-red-600'>${sessionError.message}<p>`, {
      status: 403,
      headers: new Headers({
        "Content-Type": "text/html",
      }),
    })
  }

  await supabase.auth.updateUser({ password })

  return redirect("/signin")
}
