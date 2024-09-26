import type Dockerode from "dockerode";
import type { databaseStoreProps } from "./store";

export type DockerApiProps = {
    stopContainer: (id: string) => Promise<{
        success: boolean,
        message: string
    }>;
    startContainer: (db: string) => Promise<{
        success: true;
        message: string;
        data: {
            containerId:string
        }
    } | {
        success: false;
        message: string;
        error: string;
    }>;
    createMysqlContainer: (payload: string) => Promise<{
        data: {
            volumeName: string
        },
        success: true,
        message: string,
    } | {
        success: false,
        message: string,
    }>;
    deleteMysqlContainer: () => string;
    getAllContainers: () => Promise< Dockerode.ContainerInfo[]>;
    checkConnection: () => Promise<boolean>;
}

export type CreateMysqlPayload = {
    databaseName: string;
    databasePort: number;
    databasePassword: string;
    databaseUser: string;
}