import { useAuthStore } from "~/store/auth";

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.matched.length === 0 || to.meta.auth === false) {
    return;
  }

  const authStore = useAuthStore();
  if (to.path === "/auth/login" || to.path === "/auth/signup") {
    if (authStore.isAuthenticated) {
      return navigateTo("/");
    }
    return;
  }
  if (!authStore.isAuthenticated) {
    return navigateTo("/auth/login");
  }
});
