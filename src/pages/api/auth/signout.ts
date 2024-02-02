import type { APIRoute } from "astro"
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "../../../utils/constants"

export const GET: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(ACCESS_TOKEN_COOKIE, { path: "/" })
  cookies.delete(REFRESH_TOKEN_COOKIE, { path: "/" })

  return redirect("/signin")
}
