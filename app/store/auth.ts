import type { UserProfile } from "~~/server/api/auth/profile.get"


export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  const setUser = (u: UserProfile) => {
    user.value = u
  }

  const clearUser = () => {
    user.value = null
  }

  return { user, isAuthenticated, setUser, clearUser }
})
