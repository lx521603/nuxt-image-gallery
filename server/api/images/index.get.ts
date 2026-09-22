export default eventHandler(async (event) => {
  try {
    const { blobs } = await hubBlob().list({
      limit: 1000
    })

    return blobs
  } catch (error) {
    return {
      error: String(error),
      envKeys: Object.keys(
        event.context.cloudflare?.env || {}
      ),
      hasHubBlob: !!event.context.cloudflare?.env?.hubBlob
    }
  }
})