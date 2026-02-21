/// <reference path="../.astro/types.d.ts" />

import SimpleMDE from "simplemde"

declare global {
  interface ImportMetaEnv {
    readonly SUPABASE_URL: string
    readonly SUPABASE_ANON_KEY: string
    readonly DEBUG: "true" | undefined
    readonly DEBUG_LOGS: "true" | undefined
    readonly DEV_BUILD: boolean
    readonly EMAIL_HOST: string
    readonly EMAIL_PORT: string
    readonly EMAIL_USER: string
    readonly EMAIL_PASSWORD: string
    readonly DISCORD_BOT_TOKEN: string
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
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
        id: string
        email: string
        details: import("./types/supabase").Tables<"user_details">
      }
    }
  }
}
