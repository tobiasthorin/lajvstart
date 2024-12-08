import type { APIRoute } from "astro"
import { deleteCharacter } from "../../../../../services/characterService"
import { errorResponse } from "../../../../../utils/responseUtils"

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
