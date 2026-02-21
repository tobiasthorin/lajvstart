import type { APIRoute } from "astro"

import { supabase } from "../../../lib/supabase"
import { baseURL } from "./../../../utils/constants"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()

  if (!email) {
    return new Response('<p class="text-red-600">Email is required<p>', {
      headers: new Headers({
        "Content-Type": "text/html",
      }),
      status: 400,
    })
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseURL}/resetPassword`,
  })

  if (error) {
    return new Response(`<p class='text-red-600'>${error.message}<p>`, {
      headers: new Headers({
        "Content-Type": "text/html",
      }),
      status: 403,
    })
  }

  return new Response(
    '<p class="text-green-600">A reset password link has been sent to your email.<p>',
    {
      headers: new Headers({
        "Content-Type": "text/html",
      }),
      status: 200,
    },
  )
}
