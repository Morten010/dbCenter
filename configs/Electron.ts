import type { ElectronOptions } from "nuxt-electron";

export const electronConfig: Partial<ElectronOptions> = {
    build: [
        {
          // Main-Process entry file of the Electron App.
          entry: 'electron/main.ts',
        },
        {
            entry: 'electron/preload.ts',
            onstart(args) {
                // Notify the Renderer-Process to reload the page when the Preload-Scripts build is complete, 
                // instead of restarting the entire Electron App.
                args.reload()
            },    
        }
    ],
    renderer: {}
}