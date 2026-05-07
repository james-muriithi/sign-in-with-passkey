<template>
  <div class="w-full flex justify-center">
    <div>
      <div
        class="fade-up delay-1 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-ink/5 px-4 py-1 text-[11px] uppercase tracking-[0.35em] text-ink/70"
      >
        <span class="h-1.5 w-1.5 rounded-full bg-secondary" />
        CodeBase Signup
      </div>

      <div class="my-6 max-w-xl">
        <h1
          class="fade-up delay-2 font-display text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Create your CodeBase workspace and go live fast.
        </h1>
        <p class="fade-up delay-3 mt-4 max-w-lg text-base text-ink/70">
          Spin up your team, connect your repo, and ship production-ready apps
          from one clean dashboard.
        </p>
      </div>
      <div
        class="fade-up delay-2 rounded-2xl border border-ink/10 bg-ink/5 p-4 lg:p-8 shadow-2xl shadow-base/70 backdrop-blur"
      >
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold">Create your CodeBase account</h2>
          <p class="text-sm text-ink/60">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <div class="mt-6 grid gap-4">
          <!-- Step 1: signup form -->
          <form
            v-if="step === 'form'"
            class="grid gap-4"
            @submit.prevent="submitSignup"
          >
            <AppInput
              id="name"
              v-model="form.name"
              label="Full name"
              placeholder="Alex Morgan"
              autocomplete="name"
              :error="
                v$.name.$dirty && v$.name.$error
                  ? String(v$.name.$errors[0]?.$message)
                  : undefined
              "
              @blur="v$.name.$touch()"
            />

            <AppInput
              id="email"
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="alex@studio.com"
              autocomplete="email"
              :error="
                v$.email.$dirty && v$.email.$error
                  ? String(v$.email.$errors[0]?.$message)
                  : undefined
              "
              @blur="v$.email.$touch()"
            />

            <AppInput
              id="password"
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autocomplete="new-password"
              hint="Use 8+ characters with a mix of letters and numbers."
              :error="
                v$.password.$dirty && v$.password.$error
                  ? String(v$.password.$errors[0]?.$message)
                  : undefined
              "
              @blur="v$.password.$touch()"
            />

            <AppInput
              id="repeat-password"
              v-model="form.repeatPassword"
              label="Repeat password"
              type="password"
              placeholder="••••••••"
              autocomplete="new-password"
              :error="
                v$.repeatPassword.$dirty && v$.repeatPassword.$error
                  ? String(v$.repeatPassword.$errors[0]?.$message)
                  : undefined
              "
              @blur="v$.repeatPassword.$touch()"
            />

            <p v-if="error" class="text-sm text-red-500">
              {{ error }}
            </p>

            <AppButton
              type="submit"
              full-width
              class="mt-2"
              :loading="loading"
              loading-text="Creating account…"
              :disabled="v$.$invalid"
            >
              Create account
            </AppButton>
          </form>

          <!-- Step 2: passkey setup prompt -->
          <div v-else class="grid gap-4">
            <div class="flex flex-col items-center gap-2 py-2 text-center">
              <Icon name="boxicons:key" class="text-4xl text-primary" />
              <h3 class="text-lg font-semibold">Set up a passkey</h3>
              <p class="text-sm text-ink/60">
                Sign in faster with Touch ID, Face ID, or a security key. You
                can always do this later from your account settings.
              </p>
            </div>

            <p v-if="error" class="text-sm text-red-500">
              {{ error }}
            </p>

            <AppButton
              full-width
              :loading="loading"
              loading-text="Setting up…"
              @click="handleSetupPasskey"
            >
              Set up passkey
            </AppButton>

            <AppButton variant="ghost" full-width @click="skipPasskey">
              Skip for now
            </AppButton>
          </div>
        </div>
      </div>

      <p class="mt-6 text-center text-xs text-ink/50">
        Already have an account?
        <NuxtLink
          class="text-ink underline underline-offset-4"
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
import useVuelidate from "@vuelidate/core";
import {
  email,
  helpers,
  minLength,
  required,
  sameAs,
} from "@vuelidate/validators";

definePageMeta({
  layout: "auth",
});

const step = ref<"form" | "passkey">("form");

const form = reactive({
  name: "John Doe",
  email: "johndoe@gmail.com",
  password: "password",
  repeatPassword: "password",
});

const rules = computed(() => ({
  name: { required: helpers.withMessage("Name is required", required) },
  email: {
    required: helpers.withMessage("Email is required", required),
    email: helpers.withMessage("Invalid email", email),
  },
  password: {
    required: helpers.withMessage("Password is required", required),
    minLength: helpers.withMessage(
      "Password must be at least 8 characters",
      minLength(8),
    ),
  },
  repeatPassword: {
    required: helpers.withMessage("Repeat password is required", required),
    sameAsPassword: helpers.withMessage(
      "Passwords do not match",
      sameAs(form.password),
    ),
  },
}));

const v$ = useVuelidate(rules, form);
const { signup, setupPasskey, loading, error } = useAuth();

async function submitSignup() {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  try {
    const { repeatPassword, ...signupData } = form;
    await signup(signupData);
    step.value = "passkey";
  } catch {
    /* error shown via composable */
  }
}

async function handleSetupPasskey() {
  try {
    await setupPasskey();
    await navigateTo("/");
  } catch {
    /* error shown via composable */
  }
}

function skipPasskey() {
  navigateTo("/");
}
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
