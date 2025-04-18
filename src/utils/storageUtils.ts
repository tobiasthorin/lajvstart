import { uploadFile } from "../services/fileService"
import type { UserID } from "../services/userService"
import { BadRequestError, InternalError } from "./errorUtils"

const IMAGE_SIZE_LIMIT = 5e7

export function getExtention(file: File) {
  const fileNameParts = file.name.split(".")
  return fileNameParts[fileNameParts.length - 1]
}

export async function uploadAvatar(avatarFile: File, userId: UserID) {
  if (!avatarFile.type.includes("image/"))
    // TODO: file size
    throw new BadRequestError("Invalid file type")

  const fileExtention = getExtention(avatarFile)

  let fileData: { path: string }
  try {
    fileData = await uploadFile(
      `avatars/${userId}.${fileExtention}`,
      avatarFile,
    )
  } catch (error) {
    console.error("Error when uploading image (avatar)", error)
    if (error instanceof Error) throw new InternalError(error.message)
    return null
  }

  return `${import.meta.env.SUPABASE_URL}/storage/v1/object/public/user-files/${
    fileData.path
  }`
}

export async function uploadEventPicture(
  eventPictureFile: File,
  eventId: UserID,
) {
  if (!eventPictureFile.type.includes("image/"))
    throw new BadRequestError("Ogiltig filtyp. Endast bilder är tillåtna.")
  if (eventPictureFile.size >= IMAGE_SIZE_LIMIT)
    throw new BadRequestError("För stor fil, max storlek 50Mb.")

  const fileExtention = getExtention(eventPictureFile)

  let fileData: { path: string }
  try {
    fileData = await uploadFile(
      `events/${eventId}.${fileExtention}`,
      eventPictureFile,
    )
  } catch (error) {
    console.error("Error when uploading image (event picture)", error)
    if (error instanceof Error) throw new InternalError(error.message)
    return null
  }

  return `${import.meta.env.SUPABASE_URL}/storage/v1/object/public/user-files/${
    fileData.path
  }`
}

export async function uploadEventBanner(
  eventPictureFile: File,
  eventId: UserID,
) {
  return await uploadEventPicture(eventPictureFile, `${eventId}-banner`)
}
