<template>
  <div class="w-full flex justify-center">
    <section>
      <div
        class="fade-up delay-1 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-ink/70"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-secondary" />
        CodeBase Login
      </div>

      <div class="mt-6 max-w-xl">
        <h1
          class="fade-up delay-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Welcome back to your hosting control room.
        </h1>
        <p class="fade-up delay-3 mt-4 max-w-lg text-base text-ink/70">
          Sign in to review deploys, inspect logs, and keep your infrastructure
          moving without surprises.
        </p>
      </div>

      <div
        class="fade-up delay-2 mt-8 rounded-[2rem] border border-ink/10 bg-ink/5 p-8 shadow-2xl shadow-base/60 backdrop-blur-sm"
      >
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold">Sign in to CodeBase</h2>
          <p class="text-sm text-ink/60">
            Pick up where your last deploy left off.
          </p>
        </div>

        <div class="mt-6 grid gap-4">
          <form class="grid gap-4">
            <AppInput
              id="email"
              v-model="form.email"
              label="Work email"
              type="email"
              placeholder="alex@codebase.dev"
              autocomplete="email"
            />

            <AppInput
              id="password"
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
            />

            <div
              class="flex flex-col gap-3 text-sm text-ink/70 sm:flex-row sm:items-center sm:justify-between"
            >
              <label class="inline-flex items-center gap-3">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="h-4 w-4 rounded border border-ink/20 bg-panel text-primary focus:ring-primary/30"
                />
                Remember this device
              </label>

              <NuxtLink
                to="/auth/signup"
                class="text-sm text-primary underline decoration-primary/40 underline-offset-4"
              >
                Need an account?
              </NuxtLink>
            </div>

            <button
              type="submit"
              class="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-base transition hover:-translate-y-0.5 cursor-pointer"
            >
              Sign in
            </button>

            <div
              class="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-muted/80 my-3"
            >
              <span class="h-px flex-1 bg-ink/10" />
              Or
              <span class="h-px flex-1 bg-ink/10" />
            </div>

            <button
              type="button"
              class="inline-flex items-center justify-center gap-3 rounded-xl border border-ink/10 bg-panel/70 px-4 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-panel"
            >
              <span class="h-2.5 w-2.5 rounded-full bg-primary" />
              Continue with passkey
              <Icon name="boxicons:key" class="text-lg" />
            </button>
          </form>
        </div>
      </div>

      <p class="mt-6 text-sm text-muted/80">
        Trouble signing in?
        <a href="#" class="text-ink underline underline-offset-4"
          >Reset your password</a
        >
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";

const form = reactive({
  email: "",
  password: "",
  remember: false,
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
