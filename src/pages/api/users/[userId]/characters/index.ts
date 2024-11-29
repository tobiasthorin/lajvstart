import type { APIRoute } from "astro"
import { uploadFile } from "../../../../../services/fileService"
import { errorResponse } from "../../../../../utils/responseUtils"
import { createCharacter } from "../../../../../services/characterService"
import { getExtention } from "../../../../../utils/storageUtils"

export const POST: APIRoute = async ({ request, params, rewrite }) => {
  const formData = await request.clone().formData()
  const characterName = formData.get("characterName")?.toString()
  const characterDescription = formData.get("characterDescription")?.toString()

  const userId = params.userId
  if (!userId)
    return new Response("Missing userId", {
      status: 400,
    })

  if (!characterName || !characterDescription) {
    return new Response("Missing fields", {
      status: 400,
    })
  }

  const pictureFile = formData.get("characterPicture") as File | null

  let filePath: string | null = null

  if (pictureFile) {
    const extention = getExtention(pictureFile)
    try {
      filePath = (
        await uploadFile(
          `characters/${crypto.randomUUID()}.${extention})`,
          pictureFile,
        )
      ).path
    } catch (error) {
      if (error instanceof Error) return errorResponse(error.message, 500)
      else return errorResponse("Unkonwn error")
    }
  }

  try {
    await createCharacter(userId, {
      name: characterName,
      description: characterDescription,
      image_url: `${import.meta.env.SUPABASE_URL}/storage/v1/object/public/user-files/${filePath}`,
    })
  } catch (error) {
    if (error instanceof Error) return errorResponse(error.message, 500)
  }

  return rewrite("/characters")
}
