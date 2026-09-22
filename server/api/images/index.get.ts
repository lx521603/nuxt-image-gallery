export default eventHandler(async (event) => {
  return Object.keys(
    event.context.cloudflare?.env || {}
  )
})
