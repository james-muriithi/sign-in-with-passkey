
export default {
  content: [
    "./app/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        base: "rgb(var(--cb-bg) / <alpha-value>)",
        surface: "rgb(var(--cb-surface) / <alpha-value>)",
        panel: "rgb(var(--cb-panel) / <alpha-value>)",
        primary: "rgb(var(--cb-text) / <alpha-value>)",
        muted: "rgb(var(--cb-muted) / <alpha-value>)",
        accent: "rgb(var(--cb-accent) / <alpha-value>)",
        "accent-2": "rgb(var(--cb-accent-2) / <alpha-value>)",
        glow: "rgb(var(--cb-glow) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--cb-font-sans)", "system-ui", "sans-serif"],
        display: ["var(--cb-font-display)", "serif"],
      },
    },
  },
};
