import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 })
  }

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return new Response(`<p class='text-red-600'>${error.message}<p>`, {
      status: 403,
      headers: new Headers({
        "Content-Type": "text/html",
      }),
    })
  }

  return new Response(null, {
    status: 302,
    headers: { "HX-Redirect": "/signin?registered=true" },
  })
}
