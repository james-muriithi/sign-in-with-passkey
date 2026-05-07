// https://nuxt.com/docs/api/configuration/nuxt-config

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    webauthn: {
        rpName: process.env.WEBAUTHN_RP_NAME ?? 'My App',
        rpId: process.env.WEBAUTHN_RP_ID ?? 'localhost',
        origin: process.env.WEBAUTHN_ORIGIN ?? 'http://localhost:3000',
    }
  },
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@pinia/nuxt'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})