import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"

export const PUT: APIRoute = async ({ request, params, redirect }) => {
  const formData = await request.formData()
  const name = formData.get("name")?.toString()
  const biography = formData.get("biography")?.toString()
  const userId = params.id

  if (!name || !userId || !biography) {
    return new Response("Name, userId, biography are required", { status: 400 })
  }

  const { error } = await supabase
    .from("userDetails")
    .update({ name, biography })
    .eq("user_id", userId)

  if (error) {
    return new Response(`<p class='text-red-600'>${error.message}<p>`, {
      status: 500,
      headers: new Headers({
        "Content-Type": "text/html",
      }),
    })
  }

  return redirect("/profileDetails")
}
