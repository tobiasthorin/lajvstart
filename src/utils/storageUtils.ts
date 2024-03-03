import { supabase } from "../lib/supabase"
import type { UserID } from "../services/userService"
import { BadRequestError, InternalError } from "./errorUtils"

export async function uploadAvatar(avatarFile: File, userId: UserID) {
  if (!avatarFile.type.includes("image/"))
    // TODO: file size
    throw new BadRequestError("Invalid file type")

  const fileNameParts = avatarFile.name.split(".")
  const fileExtention = fileNameParts[fileNameParts.length - 1]

  const { data: fileUploadData, error: fileUploadError } =
    await supabase.storage
      .from("user-files")
      .upload(`avatars/${userId}.${fileExtention}`, avatarFile, {
        cacheControl: "3600",
        upsert: true,
      })

  if (fileUploadError) throw new InternalError(fileUploadError.message)

  return `https://wgynzdvpnljfdbwevvuq.supabase.co/storage/v1/object/public/user-files/${fileUploadData.path}`
}
