import { supabase } from "../lib/supabase"
import type { FileOptions } from "@supabase/storage-js"

export async function uploadFile(
  path: string,
  file: File,
  options?: FileOptions,
) {
  const { data, error } = await supabase.storage
    .from("user-files")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      ...options,
    })

  if (error) throw new Error(error.message)

  return data
}
