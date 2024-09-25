// global.d.ts
export {}

declare global {
  interface Window {
    docker: any; // Replace `any` with the specific type for `docker` if you know it
  }
}