import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(async () => {
  const store = useAuthStore()
  const fetchWithCookies = useRequestFetch()

  // callOnce ensures this runs on SSR *or* client, never both.
  // On client hydration the SSR result is already in the store — no double fetch, no redirect flash.
  await callOnce(async () => {
    try {
      const user = await fetchWithCookies('/api/auth/profile')
      if (user) {
        store.setUser(user)
      }
    }
    catch {
      // No valid session — store stays empty, middleware handles redirect
    }
  })
})
