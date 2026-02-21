export function log(
  message: string,
  level: "error" | "info" | "warning" = "info",
) {
  if (!import.meta.env.DEBUG_LOGS) return

  const log = { message, timestamp: new Date().toISOString() }

  switch (level) {
    case "error":
      console.error(log)
      break
    case "info":
      console.log(log)
      break
    case "warning":
      console.warn(log)
      break

    default:
      break
  }
}
