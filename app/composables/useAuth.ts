import {
  startRegistration,
  startAuthentication,
} from "@simplewebauthn/browser";
import { useAuthStore } from "~/store/auth";

export const useAuth = () => {
  const store = useAuthStore();
  const loading = ref(false);
  const error = ref<string | null>(null);
  const toast = useToast();

  function clearError() {
    error.value = null;
  }

  async function signup({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    clearError();
    loading.value = true;
    try {
      const { user } = await $fetch("/api/auth/signup", {
        method: "POST",
        body: { name, email, password },
      });
      store.setUser(user);
    } catch (e: unknown) {
      error.value =
        (e as { data?: { message?: string } })?.data?.message ??
        "Signup failed";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function login(email: string, password: string) {
    clearError();
    loading.value = true;
    try {
      const { user } = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      store.setUser(user);
    } catch (e: unknown) {
      error.value =
        (e as { data?: { message?: string } })?.data?.message ??
        "Invalid email or password";
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function setupPasskey(passkeyName?: string) {
    clearError();
    loading.value = true;
    try {
      const options = await $fetch("/api/auth/generate-registration-options", {
        method: "POST",
      });

      const response = await startRegistration({ optionsJSON: options });
      await $fetch("/api/auth/verify-registration", {
        method: "POST",
        body: { response, passkeyName },
      });
    } catch (e: unknown) {
      const errorMessage =
        (e as { message?: string })?.message ?? "Passkey setup failed";
      error.value = errorMessage;
      toast.add({
        title: "Passkey setup failed",
        description: errorMessage,
        color: "warning",
      });
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function loginWithPasskey() {
    clearError();
    loading.value = true;
    try {
      const options = await $fetch(
        "/api/auth/generate-authentication-options",
        { method: "POST" },
      );
      const response = await startAuthentication({ optionsJSON: options });
      const { user } = await $fetch("/api/auth/verify-authentication", {
        method: "POST",
        body: { response },
      });
      store.setUser(user);
    } catch (e: unknown) {
      const errorMessage =
        (e as { message?: string })?.message ?? "Passkey authentication failed";
      error.value = errorMessage;
      toast.add({
        title: "Passkey authentication failed",
        description: errorMessage,
        color: "warning",
      });
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    clearError();
    loading.value = true;
    try {
      await $fetch("/api/auth/logout", { method: "POST" });
      store.clearUser();
      await navigateTo("/auth/login");
    } catch {
      // Still clear local state even if the server call fails
      store.clearUser();
      await navigateTo("/auth/login");
    } finally {
      loading.value = false;
    }
  }

  return {
    user: computed(() => store.user),
    isAuthenticated: computed(() => store.isAuthenticated),
    loading: readonly(loading),
    error: readonly(error),
    clearError,
    signup,
    login,
    loginWithPasskey,
    setupPasskey,
    logout,
  };
};
