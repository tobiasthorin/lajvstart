import { supabase } from "../lib/supabase"
import type { Tables } from "../types/supabase"
import type { UserID } from "./userService"

export type Character = Tables<"characters">

export async function createCharacter(
  userId: UserID,
  characterData: Pick<Character, "name" | "description" | "image_url">,
) {
  const { data, error } = await supabase
    .from("characters")
    .insert({ user_id: userId, ...characterData })
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}

export async function getCharactersForUser(userId: UserID) {
  const { data, error } = await supabase
    .from("characters")
    .select()
    .eq("user_id", userId)

  if (error) throw new Error(error.message)

  return data
}

export async function deleteCharacter(characterId: Character["id"]) {
  const { error } = await supabase
    .from("characters")
    .update({ deleted: true })
    .eq("id", characterId)

  if (error) throw new Error(error.message)
}
