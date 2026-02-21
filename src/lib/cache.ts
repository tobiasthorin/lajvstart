import { log } from "./logger"

export const EVENT_COLLECTIONS_CACHE = "events_collections"
export const EVENTS_CACHE = "events"
export const USER_EVENTS_CACHE = "user_events"
export const USERS_CACHE = "users"

const cacheStore: Record<
  string,
  Map<string, { expiresAt: number | undefined; value: unknown }>
> = {}
const defaultNamespace = "defaultNamespace"

function expired(expiresAt?: number) {
  return expiresAt && expiresAt < Date.now()
}

function getNamedCache<T>(namespace: string) {
  if (!cacheStore[namespace]) {
    log(`CACHE INIT: "${namespace}"`)
    cacheStore[namespace] = new Map<
      string,
      { expiresAt: number | undefined; value: T }
    >()
  }

  return cacheStore[namespace]!
}

function useNamespace<T>(namespace: string) {
  const namedCache = getNamedCache<T>(namespace)
  function get(key: string) {
    const { expiresAt, value } = namedCache.get(key) || {}

    if (value === undefined) {
      log(`CACHE MISS: "${namespace}"."${key}" is not set`)
      return undefined
    }

    if (expired(expiresAt)) {
      log(
        `CACHE EXP: "${namespace}"."${key}" has expired ${expiresAt !== undefined && `at ${new Date(expiresAt)}`}`,
      )
      remove(key)
      return undefined
    }

    log(`CACHE HIT: Returning "${namespace}.${key}"`)
    return value as T
  }

  function set(key: string, value: T, timeout?: number) {
    const expiresAt = timeout ? Date.now() + timeout : undefined

    log(`CACHE SET: setting "${namespace}.${key}"`)
    namedCache.set(key, { expiresAt, value })
  }

  function remove(key: string) {
    log(`CACHE DEL: removing "${namespace}.${key}"`)
    namedCache.delete(key)
  }

  function clear() {
    log(`CACHE CLEAR: clearing "${namespace}"`)
    namedCache.clear()
  }

  function timeTillExpires(key: string) {
    const { expiresAt } = namedCache.get(key) || {}

    if (expiresAt === undefined) return undefined

    if (expired(expiresAt)) return 0

    return expiresAt - Date.now()
  }

  return { clear, get, remove, set, timeTillExpires }
}

const { get, remove, set } = useNamespace(defaultNamespace)

export { get, remove, set, useNamespace }
