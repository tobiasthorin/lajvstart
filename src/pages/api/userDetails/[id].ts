import type { APIRoute } from "astro"
import { supabase } from "../../../lib/supabase"

function returnError(errorMessage: string) {
  return new Response(`<p class='text-red-600'>${errorMessage}<p>`, {
    status: 500,
    headers: new Headers({
      "Content-Type": "text/html",
    }),
  })
}

export const PUT: APIRoute = async ({ request, params, redirect }) => {
  const formData = await request.formData()
  const name = formData.get("name")?.toString()
  const biography = formData.get("biography")?.toString()
  const userId = params.id

  if (!name || !userId || !biography) {
    return new Response("Name, userId, biography are required", { status: 400 })
  }

  const avatarFile = formData.get("profilePicture") as File | null

  let filePath: string | null = null

  if (avatarFile) {
    if (!avatarFile.type.includes("image/"))
      // TODO: file size
      return new Response("Invalid file type", { status: 400 })

    const fileNameParts = avatarFile.name.split(".")
    const fileExtention = fileNameParts[fileNameParts.length - 1]

    const { data: fileUploadData, error: fileUploadError } =
      await supabase.storage
        .from("user-files")
        .upload(`avatars/${userId}.${fileExtention}`, avatarFile, {
          cacheControl: "3600",
          upsert: true,
        })

    if (fileUploadError) return returnError(fileUploadError.message)

    filePath = `https://wgynzdvpnljfdbwevvuq.supabase.co/storage/v1/object/public/user-files/${fileUploadData.path}`
  }

  const { error: updateError } = await supabase
    .from("user_details")
    .update({ name, biography, profile_picture_url: filePath })
    .eq("user_id", userId)

  if (updateError) return returnError(updateError.message)

  return redirect("/profileDetails")
}
