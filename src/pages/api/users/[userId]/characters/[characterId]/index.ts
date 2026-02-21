import type { APIRoute } from "astro"

import {
  deleteCharacter,
  editCharacter,
} from "../../../../../../services/characterService"
import { uploadFile } from "../../../../../../services/fileService"
import { errorResponse } from "../../../../../../utils/responseUtils"
import { getExtention } from "../../../../../../utils/storageUtils"

export const DELETE: APIRoute = async ({ params }) => {
  if (!params.characterId) return errorResponse("No character ID")

  try {
    await deleteCharacter(Number(params.characterId))
    return new Response("Deleted", {
      status: 200,
    })
  } catch (error) {
    if (error instanceof Error) return errorResponse(error.message)
    return errorResponse(
      `Could not delete character with id ${params.characterId}`,
    )
  }
}

export const PUT: APIRoute = async ({ params, request, rewrite }) => {
  const formData = await request.clone().formData()
  const characterName = formData.get("characterName")?.toString()
  const characterDescription = formData.get("characterDescription")?.toString()

  const userId = params.userId
  const characterId = params.characterId

  if (!userId || !characterId)
    return new Response("Missing userId or characterId", {
      status: 400,
    })

  if (!characterName || !characterDescription) {
    return new Response("Missing fields", {
      status: 400,
    })
  }

  const pictureFile = formData.get("characterPicture") as File | null

  let filePath: null | string = null

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
    await editCharacter(userId, Number(characterId), {
      description: characterDescription,
      image_url: `${import.meta.env.SUPABASE_URL}/storage/v1/object/public/user-files/${filePath}`,
      name: characterName,
    })
  } catch (error) {
    if (error instanceof Error) return errorResponse(error.message, 500)
  }

  return rewrite(
    `/api/users/${userId}/characters/${characterId}/updateResponse`,
  )
}
