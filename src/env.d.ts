interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare const initFlowbite: () => void
declare const htmx: { onLoad: (fn: () => void) => void }

declare namespace App {
  interface Locals {
    user: {
      id: string
      email: string
      details: import("./types/supabase").Tables<"user_details">
      avatarUrl: string
    }
  }
}
