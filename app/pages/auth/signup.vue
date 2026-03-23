<template>
  <div class="w-full flex justify-center">
    <div>
      <div
        class="fade-up delay-1 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-primary/70"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-accent-2" />
        CodeBase Signup
      </div>

      <div class="my-6 max-w-xl">
        <h1
          class="fade-up delay-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Welcome back to your hosting control room.
        </h1>
        <p class="fade-up delay-3 mt-4 max-w-lg text-base text-primary/70">
          Launch on CodeBase. Ship faster, scale cleanly.
        </p>
      </div>
      <div
        class="fade-up delay-2 rounded-3xl border border-primary/10 bg-primary/5 p-8 shadow-2xl shadow-base/70 backdrop-blur"
      >
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold">Create your CodeBase account</h2>
          <p class="text-sm text-primary/60">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <div class="mt-6 grid gap-4">
          <button
            type="button"
            class="group inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-base transition hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <span class="h-2.5 w-2.5 rounded-full bg-accent-2" />
            Continue with Passkey
            <Icon name="boxicons:key" />
          </button>

          <div
            class="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted/80"
          >
            <span class="h-px flex-1 bg-primary/10" />
            Or
            <span class="h-px flex-1 bg-primary/10" />
          </div>

          <form class="grid gap-4">
            <AppInput
              id="name"
              v-model="form.name"
              label="Full name"
              placeholder="Alex Morgan"
              autocomplete="name"
            />

            <AppInput
              id="email"
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="alex@studio.com"
              autocomplete="email"
            />

            <AppInput
              id="password"
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autocomplete="new-password"
              hint="Use 8+ characters with a mix of letters and numbers."
            />

            <AppInput
              id="repeat-password"
              label="Repeat password"
              type="password"
              placeholder="••••••••"
              autocomplete="new-password"
            />

            <button
              type="submit"
              class="mt-2 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent/90 via-accent-2/90 to-teal-200/90 px-4 py-3 text-sm font-semibold text-base transition hover:-translate-y-0.5"
            >
              Create account
            </button>
          </form>
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-primary/50">
        Already have an account?
        <NuxtLink
          class="text-primary underline underline-offset-4"
          to="/auth/login"
        >
          Sign in
        </NuxtLink>
      </p>

      <p class="mt-3 text-center text-[11px] text-muted/80">
        By continuing, you agree to the Terms and acknowledge the Privacy
        Policy.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  name: "",
  email: "",
  company: "",
  password: "",
});

definePageMeta({
  layout: "auth",
});
</script>

<style scoped>
.fade-up {
  animation: fadeUp 0.7s ease-out both;
}

.fade-up.delay-1 {
  animation-delay: 0.1s;
}

.fade-up.delay-2 {
  animation-delay: 0.2s;
}

.fade-up.delay-3 {
  animation-delay: 0.3s;
}

.fade-up.delay-4 {
  animation-delay: 0.4s;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
