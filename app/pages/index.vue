<template>
  <div class="p-5">
    <PasskeySetup v-if="!user?.hasPasskeys" />
    <div v-else-if="isAuthenticated">
      <h1 class="text-2xl font-bold">Welcome back, {{ user?.name }}!</h1>
      <p class="mt-2 text-muted/80">You are logged in with passkeys.</p>

      <div class="mt-6">
        <AppButton variant="danger" @click="logout">
          Logout
        </AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/auth";

const { user, isAuthenticated } = useAuthStore();
const { logout } = useAuth();
console.log("User:", user);
</script>
