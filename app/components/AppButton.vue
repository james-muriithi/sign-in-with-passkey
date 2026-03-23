<template>
  <component
    :is="componentTag"
    v-bind="componentAttrs"
    :class="buttonClass"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
    <slot
      v-else
      name="leading"
    />

    <span>
      {{ loading && loadingText ? loadingText : undefined }}
      <slot v-if="!(loading && loadingText)" />
    </span>

    <slot name="trailing" />
  </component>
</template>

<script setup lang="ts">
import { computed, resolveComponent, useAttrs } from "vue";
import type { RouteLocationRaw } from "vue-router";

defineOptions({
  inheritAttrs: false,
});

type ButtonProps = {
  to?: RouteLocationRaw;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  external?: boolean;
};

const props = withDefaults(defineProps<ButtonProps>(), {
  type: "button",
  variant: "primary",
  size: "md",
  disabled: false,
  loading: false,
  loadingText: "",
  fullWidth: false,
  external: false,
});

const attrs = useAttrs();
const nuxtLink = resolveComponent("NuxtLink");

const isLink = computed(() => Boolean(props.to || props.href));
const isDisabled = computed(() => props.disabled || props.loading);

const componentTag = computed(() => {
  if (isLink.value && isDisabled.value) {
    return "span";
  }

  if (props.to) {
    return nuxtLink;
  }

  if (props.href) {
    return "a";
  }

  return "button";
});

const componentAttrs = computed(() => {
  if (props.to && !isDisabled.value) {
    return {
      ...attrs,
      to: props.to,
    };
  }

  if (props.href && !isDisabled.value) {
    return {
      ...attrs,
      href: props.href,
      target: props.external ? "_blank" : attrs.target,
      rel: props.external ? "noopener noreferrer" : attrs.rel,
    };
  }

  if (isLink.value) {
    return {
      ...attrs,
      "aria-disabled": "true",
      tabindex: -1,
    };
  }

  return {
    ...attrs,
    type: props.type,
    disabled: isDisabled.value,
    "aria-busy": props.loading ? "true" : undefined,
  };
});

const sizeClassMap: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-3.5 text-base",
};

const variantClassMap: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-base shadow-lg shadow-primary/10 hover:bg-brand-200",
  secondary:
    "border border-ink/10 bg-panel/70 text-ink hover:border-primary/30 hover:bg-panel",
  outline:
    "border border-ink/15 bg-transparent text-ink hover:border-primary/40 hover:bg-ink/5",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  danger:
    "bg-highlight text-ink shadow-lg shadow-highlight/15 hover:bg-highlight-400",
};

const buttonClass = computed(() => {
  return [
    "inline-flex items-center justify-center gap-3 rounded-xl font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 focus:ring-offset-base",
    sizeClassMap[props.size],
    variantClassMap[props.variant],
    props.fullWidth ? "w-full" : "w-auto",
    isDisabled.value ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:-translate-y-0.5",
  ];
});
</script>
