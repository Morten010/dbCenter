import type { DockerApiProps } from "./types/dockerApi";
import type { MysqlApiProps } from "./types/mysqlApi";

// global.d.ts
export {}

declare global {
  interface Window {
    docker: DockerApiProps;
    mysql: MysqlApiProps
  }
}