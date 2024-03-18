import { supabase } from "../lib/supabase"
import type { UserID } from "../services/userService"
import { BadRequestError, InternalError } from "./errorUtils"

function getExtention(file: File) {
  const fileNameParts = file.name.split(".")
  return fileNameParts[fileNameParts.length - 1]
}

export async function uploadAvatar(avatarFile: File, userId: UserID) {
  if (!avatarFile.type.includes("image/"))
    // TODO: file size
    throw new BadRequestError("Invalid file type")

  const fileExtention = getExtention(avatarFile)

  const { data: fileUploadData, error: fileUploadError } =
    await supabase.storage
      .from("user-files")
      .upload(`avatars/${userId}.${fileExtention}`, avatarFile, {
        cacheControl: "3600",
        upsert: true,
      })

  if (fileUploadError) throw new InternalError(fileUploadError.message)

  return `${import.meta.env.SUPABASE_URL}/storage/v1/object/public/user-files/${
    fileUploadData.path
  }`
}

export async function uploadEventPicture(
  eventPictureFile: File,
  eventId: UserID
) {
  if (!eventPictureFile.type.includes("image/"))
    // TODO: file size
    throw new BadRequestError("Invalid file type")

  const fileExtention = getExtention(eventPictureFile)

  const { data: fileUploadData, error: fileUploadError } =
    await supabase.storage
      .from("user-files")
      .upload(`events/${eventId}.${fileExtention}`, eventPictureFile, {
        cacheControl: "3600",
        upsert: true,
      })

  if (fileUploadError) throw new InternalError(fileUploadError.message)

  return `${import.meta.env.SUPABASE_URL}/storage/v1/object/public/user-files/${
    fileUploadData.path
  }`
}
