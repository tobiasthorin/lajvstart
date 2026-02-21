import { beforeEach, describe, expect, it, vi } from "vitest"

import * as fileService from "../services/fileService"
import { BadRequestError, InternalError } from "./errorUtils"
import {
  getExtention,
  uploadAvatar,
  uploadEventBanner,
  uploadEventPicture,
} from "./storageUtils"

// Mock the fileService
vi.mock("../services/fileService", () => ({
  uploadFile: vi.fn(),
}))

describe("getExtention", () => {
  it("should extract file extension from filename", () => {
    const file = new File([], "document.pdf", { type: "application/pdf" })
    const result = getExtention(file)
    expect(result).toBe("pdf")
  })

  it("should extract extension from image file", () => {
    const file = new File([], "photo.jpg", { type: "image/jpeg" })
    const result = getExtention(file)
    expect(result).toBe("jpg")
  })

  it("should handle multiple dots in filename", () => {
    const file = new File([], "my.photo.backup.png", { type: "image/png" })
    const result = getExtention(file)
    expect(result).toBe("png")
  })

  it("should handle no extension", () => {
    const file = new File([], "readme", { type: "text/plain" })
    const result = getExtention(file)
    expect(result).toBe("readme")
  })

  it("should preserve extension case", () => {
    const file = new File([], "image.JPG", { type: "image/jpeg" })
    const result = getExtention(file)
    expect(result).toBe("JPG")
  })
})

describe("uploadAvatar", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should reject non-image files", async () => {
    const file = new File(["content"], "document.pdf", {
      type: "application/pdf",
    })
    const userId = "user123" as any

    await expect(uploadAvatar(file, userId)).rejects.toThrow(BadRequestError)
  })

  it("should reject non-image mime types", async () => {
    const file = new File(["content"], "video.mp4", { type: "video/mp4" })
    const userId = "user123" as any

    await expect(uploadAvatar(file, userId)).rejects.toThrow(
      "Invalid file type",
    )
  })

  it("should accept image files", async () => {
    const file = new File(["image data"], "avatar.jpg", { type: "image/jpeg" })
    const userId = "user123" as any

    vi.mocked(fileService.uploadFile).mockResolvedValue({
      fullPath: "avatars/user123.jpg",
      id: "123",
      path: "avatars/user123.jpg",
    })

    const result = await uploadAvatar(file, userId)
    expect(result).toBeDefined()
  })

  it("should call uploadFile with correct path", async () => {
    const file = new File(["image data"], "pic.png", { type: "image/png" })
    const userId = "user456" as any

    vi.mocked(fileService.uploadFile).mockResolvedValue({
      fullPath: "avatars/user456.png",
      id: "456",
      path: "avatars/user456.png",
    })

    await uploadAvatar(file, userId)

    expect(fileService.uploadFile).toHaveBeenCalledWith(
      "avatars/user456.png",
      file,
    )
  })

  it("should return public URL for avatar", async () => {
    const file = new File(["image"], "avatar.jpg", { type: "image/jpeg" })
    const userId = "user789" as any

    vi.mocked(fileService.uploadFile).mockResolvedValue({
      fullPath: "avatars/user789.jpg",
      id: "789",
      path: "avatars/user789.jpg",
    })

    const result = await uploadAvatar(file, userId)
    expect(result).toContain("user-files/avatars/user789.jpg")
  })

  it("should handle uploadFile errors", async () => {
    const file = new File(["image"], "avatar.jpg", { type: "image/jpeg" })
    const userId = "user123" as any

    vi.mocked(fileService.uploadFile).mockRejectedValue(
      new Error("Upload failed"),
    )

    await expect(uploadAvatar(file, userId)).rejects.toThrow(InternalError)
  })

  it("should return null on non-Error exception", async () => {
    const file = new File(["image"], "avatar.jpg", { type: "image/jpeg" })
    const userId = "user123" as any

    vi.mocked(fileService.uploadFile).mockRejectedValue("string error")

    const result = await uploadAvatar(file, userId)
    expect(result).toBeNull()
  })
})

describe("uploadEventPicture", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should reject non-image files", async () => {
    const file = new File(["content"], "document.pdf", {
      type: "application/pdf",
    })
    const eventId = "event123" as any

    await expect(uploadEventPicture(file, eventId)).rejects.toThrow(
      BadRequestError,
    )
  })

  it("should reject files larger than 50MB", async () => {
    // Create a mock file that reports size as 51MB
    const file = new File(["x".repeat(51e7)], "large.jpg", {
      type: "image/jpeg",
    })
    const eventId = "event123" as any

    await expect(uploadEventPicture(file, eventId)).rejects.toThrow(
      BadRequestError,
    )
    await expect(uploadEventPicture(file, eventId)).rejects.toThrow(
      "För stor fil",
    )
  })

  it("should accept valid image files under size limit", async () => {
    const file = new File(["small image"], "event.jpg", { type: "image/jpeg" })
    const eventId = "event123" as any

    vi.mocked(fileService.uploadFile).mockResolvedValue({
      fullPath: "events/event123.jpg",
      id: "123",
      path: "events/event123.jpg",
    })

    const result = await uploadEventPicture(file, eventId)
    expect(result).toBeDefined()
  })

  it("should call uploadFile with event path", async () => {
    const file = new File(["image"], "pic.png", { type: "image/png" })
    const eventId = "event456" as any

    vi.mocked(fileService.uploadFile).mockResolvedValue({
      fullPath: "events/event456.png",
      id: "456",
      path: "events/event456.png",
    })

    await uploadEventPicture(file, eventId)

    expect(fileService.uploadFile).toHaveBeenCalledWith(
      "events/event456.png",
      file,
    )
  })

  it("should return public URL for event picture", async () => {
    const file = new File(["image"], "event.jpg", { type: "image/jpeg" })
    const eventId = "event789" as any

    vi.mocked(fileService.uploadFile).mockResolvedValue({
      fullPath: "events/event789.jpg",
      id: "789",
      path: "events/event789.jpg",
    })

    const result = await uploadEventPicture(file, eventId)
    expect(result).toContain("user-files/events/event789.jpg")
  })

  it("should handle upload errors", async () => {
    const file = new File(["image"], "event.jpg", { type: "image/jpeg" })
    const eventId = "event123" as any

    vi.mocked(fileService.uploadFile).mockRejectedValue(
      new Error("Upload failed"),
    )

    await expect(uploadEventPicture(file, eventId)).rejects.toThrow(
      InternalError,
    )
  })

  it("should return null on non-Error exception", async () => {
    const file = new File(["image"], "event.jpg", { type: "image/jpeg" })
    const eventId = "event123" as any

    vi.mocked(fileService.uploadFile).mockRejectedValue("unknown error")

    const result = await uploadEventPicture(file, eventId)
    expect(result).toBeNull()
  })
})

describe("uploadEventBanner", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should upload file with banner suffix", async () => {
    const file = new File(["image"], "banner.jpg", { type: "image/jpeg" })
    const eventId = "event123" as any

    vi.mocked(fileService.uploadFile).mockResolvedValue({
      fullPath: "events/event123-banner.jpg",
      id: "123",
      path: "events/event123-banner.jpg",
    })

    await uploadEventBanner(file, eventId)

    expect(fileService.uploadFile).toHaveBeenCalledWith(
      "events/event123-banner.jpg",
      file,
    )
  })

  it("should return public URL for banner", async () => {
    const file = new File(["image"], "banner.jpg", { type: "image/jpeg" })
    const eventId = "event456" as any

    vi.mocked(fileService.uploadFile).mockResolvedValue({
      fullPath: "events/event456-banner.jpg",
      id: "456",
      path: "events/event456-banner.jpg",
    })

    const result = await uploadEventBanner(file, eventId)
    expect(result).toContain("user-files/events/event456-banner.jpg")
  })

  it("should reject non-image files", async () => {
    const file = new File(["content"], "banner.pdf", {
      type: "application/pdf",
    })
    const eventId = "event123" as any

    await expect(uploadEventBanner(file, eventId)).rejects.toThrow()
  })

  it("should reject oversized files", async () => {
    const file = new File(["x".repeat(51e7)], "banner.jpg", {
      type: "image/jpeg",
    })
    const eventId = "event123" as any

    await expect(uploadEventBanner(file, eventId)).rejects.toThrow()
  })
})
