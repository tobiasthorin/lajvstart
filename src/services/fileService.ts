import { supabase } from "../lib/supabase"

export async function uploadFile(path: string, file: File) {
  const { data, error } = await supabase.storage
    .from("user-files")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (error) throw new Error(error.message)

  return data
}
