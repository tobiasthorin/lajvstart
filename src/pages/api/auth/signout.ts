import type { APIRoute } from "astro"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../../../utils/constants"
import { HxRedirect } from "../../../utils/navigationUtils"

export const GET: APIRoute = async ({ cookies }) => {
  cookies.delete(ACCESS_TOKEN_COOKIE, { path: "/" })
  cookies.delete(REFRESH_TOKEN_COOKIE, { path: "/" })

  return HxRedirect("/signin")
}
