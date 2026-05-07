<template>
  <div class="grid gap-4">
    <div class="flex flex-col items-center gap-2 py-2 text-center">
      <Icon name="boxicons:key" class="text-4xl text-primary" />
      <h3 class="text-lg font-semibold">Set up a passkey</h3>
      <p class="text-sm text-ink/60">
        Sign in faster with Touch ID, Face ID, or a security key. You can
        always do this later from your account settings.
      </p>
    </div>

    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>

    <AppButton
      full-width
      :loading="loading"
      loading-text="Setting up…"
      @click="handleSetup"
    >
      Set up passkey
    </AppButton>

    <AppButton v-if="skip" variant="ghost" full-width @click="emit('skip')">
      Skip for now
    </AppButton>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    skip?: boolean;
  }>(),
  { skip: true },
);

const emit = defineEmits<{
  success: [];
  skip: [];
}>();

const { setupPasskey, loading, error } = useAuth();

async function handleSetup() {
  try {
    await setupPasskey();
    emit("success");
  } catch {
    /* error shown via composable */
  }
}
</script>
