import type { APIRoute } from "astro"

import type { UserDetails } from "../../../services/userService"

import { supabase } from "../../../lib/supabase"
import { BadRequestError, InternalError } from "../../../utils/errorUtils"
import { errorResponse } from "../../../utils/responseUtils"
import { uploadAvatar } from "../../../utils/storageUtils"

export const PUT: APIRoute = async ({ params, request }) => {
  const formData = await request.formData()
  const name = formData.get("name")?.toString()
  const biography = formData.get("biography")?.toString()
  const birthDate = formData.get("birthDate")?.toString()
  const birthDatePublic = formData.get("birthDatePublic")?.toString()
  const specialNeeds = formData.get("specialNeeds")?.toString()
  const userId = params.id

  if (!name || !userId || !biography || !birthDate) {
    return new Response("Name, userId, biography, birthDate are required", {
      status: 400,
    })
  }

  const avatarFile = formData.get("profilePicture") as File | null

  let filePath: null | string = null

  if (avatarFile) {
    try {
      filePath = await uploadAvatar(avatarFile, userId)
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof InternalError)
        return errorResponse(error.message, error.errorCode)
      else throw error
    }
  }

  const newData: Partial<UserDetails> = {
    biography,
    birth_date: birthDate,
    birth_date_public: !!birthDatePublic,
    name,
    special_needs: specialNeeds || null,
  }

  if (filePath) newData.profile_picture_url = filePath

  const { error: updateError } = await supabase
    .from("user_details")
    .update(newData)
    .eq("user_id", userId)

  if (updateError) return errorResponse(updateError.message, 500)

  return new Response(null, {
    headers: new Headers({
      "HX-Location": '{"path":"/profile", "target":"#main"}',
    }),
  })
}
