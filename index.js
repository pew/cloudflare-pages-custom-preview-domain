addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

addEventListener('scheduled', (event) => {
  event.waitUntil(handleScheduled())
})

async function handleScheduled() {
  const apiEndpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}/deployments`
  const req = await fetch(apiEndpoint, { headers: { 'X-Auth-Email': email, 'X-Auth-Key': apiKey } })
  const resp = await req.json()
  for (const element of resp.result) {
    if (element.environment === 'preview') {
      await deployment_id.put('preview_name', element.url)
      return element.url
    }
  }
}

async function handleRequest(request) {
  const url = await deployment_id.get('preview_name')
  // Make the headers mutable by re-constructing the Request.
  request = new Request(request)
  let response = await fetch(url + new URL(request.url).pathname, request)
  // Make the headers mutable by re-constructing the Response.
  response = new Response(response.body, response)
  return response
}
