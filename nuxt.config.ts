import { electronConfig } from "./configs/Electron";

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
  experimental: {
    appManifest: false,
    payloadExtraction: false
  },
  router: {
    options: {
      hashMode: true, // prevent app from starting on 404 page
    },
  },
  builder: 'webpack',
  
  hooks: {
    'webpack:config'(configs) {
      // Modify the Webpack configuration here
      console.log('Webpack config hook called');
      configs.forEach((config) => {
        // Example: Add a new plugin
        config.module?.rules?.push({
          test: /\.node$/,
          loader: "node-loader",
        })
        
      });
    }
  }
})
