import { log } from "./logger"

export const EVENT_COLLECTIONS_CACHE = "events_collections"
export const EVENTS_CACHE = "events"
export const USER_EVENTS_CACHE = "user_events"
export const USERS_CACHE = "users"

const cacheStore: Record<
  string,
  Map<string, { value: unknown; expiresAt: number | undefined }>
> = {}
const defaultNamespace = "defaultNamespace"

function expired(expiresAt?: number) {
  return expiresAt && expiresAt < Date.now()
}

function getNamedCache<T>(namespace: string) {
  if (!cacheStore[namespace]) {
    cacheStore[namespace] = new Map<
      string,
      { value: T; expiresAt: number | undefined }
    >()
  }

  return cacheStore[namespace]!
}

function useNamespace<T>(namespace: string) {
  const namedCache = getNamedCache<T>(namespace)
  function get(key: string) {
    const { value, expiresAt } = namedCache.get(key) || {}

    if (value === undefined) {
      log(`CACHE: "${namespace}"."${key}" is not set`)
      return undefined
    }

    if (expired(expiresAt)) {
      log(`CACHE: "${namespace}"."${key}" has expired`)
      remove(key)
      return undefined
    }

    log(`CACHE: Returning "${namespace}.${key}"`)
    return value as T
  }

  function set(key: string, value: T, timeout?: number) {
    const expiresAt = timeout ? Date.now() + timeout : undefined

    log(`CACHE: setting "${namespace}.${key}"`)
    namedCache.set(key, { value, expiresAt })
  }

  function remove(key: string) {
    namedCache.delete(key)
  }

  function clear() {
    namedCache.clear()
  }

  function timeTillExpires(key: string) {
    const { expiresAt } = namedCache.get(key) || {}

    if (expiresAt === undefined) return undefined

    if (expired(expiresAt)) return 0

    return expiresAt - Date.now()
  }

  return { get, set, remove, clear, timeTillExpires }
}

const { get, set, remove } = useNamespace(defaultNamespace)

export { get, set, remove, useNamespace }
