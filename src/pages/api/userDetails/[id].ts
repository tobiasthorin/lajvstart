import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"
import { errorResponse } from "../../../utils/responseUtils"
import { uploadAvatar } from "../../../utils/storageUtils"
import { BadRequestError, InternalError } from "../../../utils/errorUtils"
import type { UserDetails } from "../../../services/userService"

export const PUT: APIRoute = async ({ request, params, redirect }) => {
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

  let filePath: string | null = null

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
    name,
    biography,
    birth_date: birthDate,
    birth_date_public: !!birthDatePublic,
    special_needs: specialNeeds || null,
  }

  if (filePath) newData.profile_picture_url = filePath

  const { error: updateError } = await supabase
    .from("user_details")
    .update(newData)
    .eq("user_id", userId)

  if (updateError) return errorResponse(updateError.message, 500)

  return redirect("/profile/details")
}
