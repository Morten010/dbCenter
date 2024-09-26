import type { DockerApiProps } from "./types/dockerApi";

// global.d.ts
export {}

declare global {
  interface Window {
    docker: DockerApiProps;
  }
}