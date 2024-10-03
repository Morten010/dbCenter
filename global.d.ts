import type { DockerApiProps } from "./types/dockerApi";
import type { MysqlApiProps } from "./types/mysqlApi";
import type { updateApiProps } from "./types/updateApi";

// global.d.ts
export {}

declare global {
  interface Window {
    docker: DockerApiProps;
    mysql: MysqlApiProps;
    update: updateApiProps;
  }
}