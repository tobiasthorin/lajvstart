import type { APIRoute } from "astro"

export const POST: APIRoute = async () => {
  return new Response(`<p class="text-red-700">TEST</p>`, {
    status: 400,
    headers: new Headers({
      "Content-Type": "text/html",
    }),
  })
}
