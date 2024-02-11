import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

export const supabase = createClient<Database>(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY
)
