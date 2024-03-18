export function log(
  message: string,
  level: "info" | "warning" | "error" = "info"
) {
  if (!import.meta.env.DEBUG_LOGS) return

  const log = { timestamp: new Date().toISOString(), message }

  switch (level) {
    case "info":
      console.log(log)
      break
    case "warning":
      console.warn(log)
      break
    case "error":
      console.error(log)
      break

    default:
      break
  }
}
