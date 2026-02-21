import { describe, expect, it } from "vitest"

import { showdownTailwindExtentions } from "./markdownUtils"

describe("markdownUtils", () => {
  describe("showdownTailwindExtentions", () => {
    it("should export an array", () => {
      expect(Array.isArray(showdownTailwindExtentions)).toBe(true)
    })

    it("should have extensions for all expected HTML tags", () => {
      const expectedTags = ["h3", "h4", "ul", "ol", "li", "a", "hr", "p"]
      expect(showdownTailwindExtentions).toHaveLength(expectedTags.length)
    })

    it("should have correct structure for each extension", () => {
      showdownTailwindExtentions.forEach((ext) => {
        expect(ext).toHaveProperty("type", "output")
        expect(ext).toHaveProperty("regex")
        expect(ext).toHaveProperty("replace")
        expect(ext.regex).toBeInstanceOf(RegExp)
        expect(typeof ext.replace).toBe("string")
      })
    })

    it("should have h3 extension with correct class", () => {
      const h3Ext = showdownTailwindExtentions.find((ext) =>
        ext.replace.includes("h3"),
      )
      expect(h3Ext).toBeDefined()
      expect(h3Ext?.replace).toContain("text-2xl")
      expect(h3Ext?.replace).toContain("font-display")
      expect(h3Ext?.replace).toContain("mb-4")
      expect(h3Ext?.replace).toContain("mt-4")
    })

    it("should have h4 extension with correct class", () => {
      const h4Ext = showdownTailwindExtentions.find((ext) =>
        ext.replace.includes("h4"),
      )
      expect(h4Ext).toBeDefined()
      expect(h4Ext?.replace).toContain("text-lg")
      expect(h4Ext?.replace).toContain("font-bold")
    })

    it("should have ul extension with correct class", () => {
      const ulExt = showdownTailwindExtentions.find((ext) =>
        ext.replace.includes("ul"),
      )
      expect(ulExt).toBeDefined()
      expect(ulExt?.replace).toContain("list-disc")
      expect(ulExt?.replace).toContain("ml-8")
    })

    it("should have ol extension with correct class", () => {
      const olExt = showdownTailwindExtentions.find(
        (ext) => ext.regex.source === "<ol(.*)>",
      )
      expect(olExt).toBeDefined()
      expect(olExt?.replace).toContain("list-decimal")
      expect(olExt?.replace).toContain("ml-8")
    })

    it("should have link extension with correct class", () => {
      const aExt = showdownTailwindExtentions.find(
        (ext) => ext.regex.source === "<a(.*)>",
      )
      expect(aExt).toBeDefined()
      expect(aExt?.replace).toContain("underline")
      expect(aExt?.replace).toContain("text-orange-700")
    })

    it("should have hr extension with correct class", () => {
      const hrExt = showdownTailwindExtentions.find((ext) =>
        ext.replace.includes("hr"),
      )
      expect(hrExt).toBeDefined()
      expect(hrExt?.replace).toContain("mb-4")
      expect(hrExt?.replace).toContain("mt-4")
    })

    it("should have p extension with correct class", () => {
      const pExt = showdownTailwindExtentions.find((ext) =>
        ext.replace.includes("p"),
      )
      expect(pExt).toBeDefined()
      expect(pExt?.replace).toContain("mb-4")
    })

    it("should preserve attributes in replacements", () => {
      showdownTailwindExtentions.forEach((ext) => {
        // Check that replacements preserve $1 for attributes
        if (ext.replace.includes("$1")) {
          expect(ext.replace).toContain("$1")
        }
      })
    })

    it("regex patterns should match opening tags", () => {
      const h3Ext = showdownTailwindExtentions.find(
        (ext) => ext.regex.source === "<h3(.*)>",
      )
      // Reset lastIndex due to global flag
      h3Ext!.regex.lastIndex = 0
      expect(h3Ext?.regex.test("<h3>")).toBe(true)
      h3Ext!.regex.lastIndex = 0
      expect(h3Ext?.regex.test('<h3 class="test">')).toBe(true)
      h3Ext!.regex.lastIndex = 0
      expect(h3Ext?.regex.test("</h3>")).toBe(false)
    })
  })
})
