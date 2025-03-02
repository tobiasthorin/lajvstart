import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"
import { errorResponse } from "../../../utils/responseUtils"
import { getUserDetailsByEmail } from "../../../services/userService"

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData()
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()
  const name = formData.get("name")?.toString()
  const birthDate = formData.get("birthDate")?.toString()
  const biography = formData.get("biography")?.toString() || null

  if (!email || !password || !birthDate || !name) {
    return new Response("Email, password, birth date, name are required", {
      status: 400,
    })
  }

  const existingUser = await getUserDetailsByEmail(email)

  if (existingUser) {
    return errorResponse(`Det finns redan en användare med denna epost.`, 400)
  }

  const { error: signUpError, data } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError)
    return errorResponse(`Error signing up: ${signUpError.message}`, 500)

  let filePath: string | null = null

  const { error: createProfileError } = await supabase
    .from("user_details")
    .insert({
      user_id: data.user!.id,
      created_at: data.user!.created_at,
      biography,
      birth_date: birthDate,
      profile_picture_url: filePath,
      name,
      email,
    })

  if (createProfileError)
    return errorResponse(
      `Error creating profile: ${createProfileError.message}`,
      500,
    )

  return new Response(null, {
    status: 302,
    headers: { "HX-Redirect": "/verifyYourEmail" },
  })
}
