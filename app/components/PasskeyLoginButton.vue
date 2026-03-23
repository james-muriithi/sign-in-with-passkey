<template>
  <AppButton type="button" variant="secondary" full-width>
    <template #leading>
      <span class="h-2.5 w-2.5 rounded-full bg-primary" />
    </template>
    Continue with passkey
    <template #trailing>
      <Icon name="boxicons:key" class="text-lg" />
    </template>
  </AppButton>
</template>

<script setup lang="ts"></script>
