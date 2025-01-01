import { baseURL } from "./../../../utils/constants"
import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()

  if (!email) {
    return new Response('<p class="text-red-600">Email is required<p>', {
      status: 400,
      headers: new Headers({
        "Content-Type": "text/html",
      }),
    })
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${baseURL}/resetPassword`,
  })

  if (error) {
    return new Response(`<p class='text-red-600'>${error.message}<p>`, {
      status: 403,
      headers: new Headers({
        "Content-Type": "text/html",
      }),
    })
  }

  return new Response(
    '<p class="text-green-600">A reset password link has been sent to your email.<p>',
    {
      status: 200,
      headers: new Headers({
        "Content-Type": "text/html",
      }),
    },
  )
}
