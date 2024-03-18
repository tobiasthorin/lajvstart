import type { Database } from "./supabase"

export type LARPEvent = Database["public"]["Tables"]["events"]["Row"]
