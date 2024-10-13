import { electronConfig } from "./configs/Electron";
import { extendWebpackConfig } from '@nuxt/kit'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  modules: [
    'nuxt-electron',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],
  devtools: { enabled: false },
  electron: electronConfig,
  ssr: false,
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  },
  build: {
    extendWebpackConfig(config) {
      // Add a rule to handle .node files
      config.module.rules.push({
        test: /\.node$/,
        use: 'node-loader' // or 'native-loader' depending on your setup
      })
    }
  },
  experimental: {
    appManifest: false,
    payloadExtraction: false
  },
  router: {
    options: {
      hashMode: true, // prevent app from starting on 404 page
    },
  },
})
