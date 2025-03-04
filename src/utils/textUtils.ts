export function escapeCharacters(text: string) {
  return text.replace(/\"/g, "&quot;")
}
