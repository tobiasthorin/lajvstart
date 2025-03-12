export function escapeCharacters(text: string) {
  return text.replace(/\"/g, "&quot;")
}

export function prettifyURL(url: string) {
  return url
    .trim()
    .replace(/^https*:\/\//, "")
    .replace(/\/$/, "")
}
