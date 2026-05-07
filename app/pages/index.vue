<template>
  <div class="p-5">
    <PasskeySetup v-if="!user.hasPasskeys" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/auth";

const user = useAuthStore();
</script>
