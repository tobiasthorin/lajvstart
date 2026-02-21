import SimpleMDE from "simplemde"

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface ImportMetaEnv {
    readonly DEBUG: "true" | undefined
    readonly DEBUG_LOGS: "true" | undefined
    readonly DEV_BUILD: boolean
    readonly DISCORD_BOT_TOKEN: string
    readonly EMAIL_HOST: string
    readonly EMAIL_PASSWORD: string
    readonly EMAIL_PORT: string
    readonly EMAIL_USER: string
    readonly SUPABASE_ANON_KEY: string
    readonly SUPABASE_URL: string
  }

  interface Window {
    SimpleMDE: SimpleMDE
  }

  declare const initFlowbite: () => void

  declare const htmx: {
    onLoad: (fn: () => void) => void
    process: (element: HTMLElement) => void
  }

  declare namespace App {
    interface Locals {
      isSignedIn: boolean
      user: {
        details: import("./types/supabase").Tables<"user_details">
        email: string
        id: string
      }
    }
  }
}
