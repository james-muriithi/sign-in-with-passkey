import type { User } from "~/generated/prisma/client"

type AuthUser = Pick<User, 'id' | 'email' | 'name'>

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = computed(() => user.value !== null)

  const setUser = (u: AuthUser) => {
    user.value = u
  }

  const clearUser = () => {
    user.value = null
  }

  return { user, isAuthenticated, setUser, clearUser }
})
