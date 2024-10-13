import { electronConfig } from "./configs/Electron";
import { extendWebpackConfig } from '@nuxt/kit'
import esbuild from 'esbuild'

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
    extend(config, { isClient, isServer }) {
      if (isServer) {
        // Add esbuild plugin for .node files
        config.plugins.push({
          name: 'node-file-loader',
          setup(build) {
            // Handle .node files as file types
            build.onResolve({ filter: /\.node$/ }, args => ({
              path: args.path,
              namespace: 'node-file'
            }))

            build.onLoad({ filter: /.*/, namespace: 'node-file' }, async args => ({
              contents: await fs.promises.readFile(args.path),
              loader: 'file'
            }))
          }
        })
      }
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
