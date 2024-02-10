export function HxRedirect(path: string) {
  return new Response(undefined, {
    status: 200,
    headers: new Headers({
      "HX-Location": JSON.stringify({ path, event: "asdf" }),
    }),
  })
}
