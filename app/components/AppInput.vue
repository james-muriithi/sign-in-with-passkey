<template>
  <div class="grid gap-2">
    <label
      v-if="label"
      :for="id"
      class="text-xs uppercase tracking-[0.2em] text-white/50"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :name="name || id"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :value="modelValue ?? ''"
      class="w-full rounded-xl border border-primary/10 bg-panel/60 px-4 py-3 text-sm text-primary placeholder:text-muted/70 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/20"
      @input="onInput"
    />
    <p v-if="hint" class="text-xs text-white/40">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
type InputProps = {
  id: string;
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  autocomplete?: string;
  modelValue?: string;
  hint?: string;
};

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  autocomplete: "off",
});

const emit = defineEmits<{
  (event: "update:modelValue", value: string): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  emit("update:modelValue", target?.value ?? "");
};
</script>
