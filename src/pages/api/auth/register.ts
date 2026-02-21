import type { APIRoute } from "astro"

import { supabase } from "../../../lib/supabase"
import { getUserDetailsByEmail } from "../../../services/userService"
import { errorResponse } from "../../../utils/responseUtils"

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

  const { data: existingUser } = await getUserDetailsByEmail(email)

  if (existingUser) {
    return errorResponse(`Det finns redan en användare med denna epost.`, 400)
  }

  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError)
    return errorResponse(`Error signing up: ${signUpError.message}`, 500)

  const filePath: null | string = null

  const { error: createProfileError } = await supabase
    .from("user_details")
    .insert({
      biography,
      birth_date: birthDate,
      created_at: data.user!.created_at,
      email,
      name,
      profile_picture_url: filePath,
      user_id: data.user!.id,
    })

  if (createProfileError)
    return errorResponse(
      `Error creating profile: ${createProfileError.message}`,
      500,
    )

  return new Response(null, {
    headers: { "HX-Redirect": "/verifyYourEmail" },
    status: 302,
  })
}
