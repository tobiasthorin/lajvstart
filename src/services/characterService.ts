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

export async function getCharacterById(characterId: Character["id"]) {
  const { data, error } = await supabase
    .from("characters")
    .select()
    .eq("id", characterId)
    .single()

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

export async function editCharacter(
  userId: UserID,
  characterId: Character["id"],
  characterData: Pick<Character, "name" | "description" | "image_url">,
) {
  const character = await getCharacterById(characterId)

  if (!character)
    throw new Error(
      `Could not find character with id ${characterId} for updating.`,
    )

  const { data, error } = await supabase
    .from("characters")
    .update({
      name: characterData.name || character.name,
      description: characterData.description || character.description,
      image_url: characterData.image_url || character.image_url,
    })
    .eq("user_id", userId)
    .eq("id", characterId)
    .select()
    .single()

  if (error) throw new Error(error.message)

  return data
}
