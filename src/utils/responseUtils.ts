export function errorResponse(errorMessage: string, statusCode: number) {
  return new Response(`<p class='text-red-600'>${errorMessage}<p>`, {
    status: statusCode,
    headers: new Headers({
      "Content-Type": "text/html",
    }),
  })
}
