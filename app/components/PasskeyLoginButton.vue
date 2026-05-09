<template>
  <div class="grid gap-2">
    <AppButton
      type="button"
      variant="secondary"
      full-width
      :loading="loading"
      loading-text="Authenticating…"
      @click="handleLogin"
    >
      <template #leading>
        <span class="h-2.5 w-2.5 rounded-full bg-primary" />
      </template>
      Continue with passkey
      <template #trailing>
        <Icon name="boxicons:key" class="text-lg" />
      </template>
    </AppButton>

    <p v-if="error" class="text-center text-sm text-red-500">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ success: [] }>();

const { loginWithPasskey, loading, error } = useAuth();

async function handleLogin() {
  try {
    await loginWithPasskey();
    emit("success");
  } catch {
    /* error shown above */
  }
}
</script>
