/**
 * Minimal AlterU deployment adapter for Before We Get Home.
 *
 * The deployment package serves the compiled `dist/` beside this handler.
 * Player identity, saves and generated media remain on the platform runtime;
 * this worker deliberately creates no second persistence layer.
 */
export async function handleApi(request) {
  const url = new URL(request.url)

  if (request.method === 'GET' && url.pathname === '/api/health') {
    return Response.json({
      ok: true,
      game: 'before-we-get-home',
      campaign: 'complete',
    })
  }

  return new Response('Not Found', { status: 404 })
}
