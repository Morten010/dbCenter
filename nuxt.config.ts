import { electronConfig } from "./configs/Electron";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: ['nuxt-electron', '@nuxt/icon', '@nuxtjs/tailwindcss'], 
  devtools: { enabled: true },
  electron: electronConfig,
  ssr: false
})