const classMap: Record<string, string> = {
  a: "underline text-orange-700",
  h3: "text-2xl font-display mb-4 mt-4",
  h4: "text-lg font-bold mb-4 mt-4",
  hr: "mb-4 mt-4",
  li: "ui item",
  ol: "list-decimal ml-8 mb-4 mt-4",
  p: "mb-4",
  ul: "list-disc ml-8 mb-4 mt-4",
}

export const showdownTailwindExtentions = Object.keys(classMap).map((key) => ({
  regex: new RegExp(`<${key}(.*)>`, "g"),
  replace: `<${key} class="${classMap[key]}" $1>`,
  type: "output",
}))
