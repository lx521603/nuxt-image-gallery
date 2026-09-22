export default eventHandler(async () => {
  try {
    const result = await hubBlob().list({
      limit: 1000
    })

    return result
  } catch (e) {
    return {
      error: String(e)
    }
  }
})
