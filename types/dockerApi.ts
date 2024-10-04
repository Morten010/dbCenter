import type Dockerode from "dockerode";
import type { databaseStoreProps } from "./store";

export type DockerApiProps = {
    stopDatabase: (volumeName: string) => Promise<{
        success: boolean,
        message: string
    }>;
    startDatabase: (db: string) => Promise<{
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
    createDatabase: (payload: string) => Promise<{
        data: {
            volumeName: string
        },
        success: true,
        message: string,
    } | {
        success: false,
        message: string,
    }>;
    deleteMysqlContainer: (x: string) => Promise<{
        success: boolean,
        message: string
    }>;
    getAllContainers: () => Promise< Dockerode.ContainerInfo[]>;
    checkConnection: () => Promise<boolean>;
    allVolumes(): Promise<string[]>
    getConfig: (volumeName: string) => Promise<any>
    sync: (volumeId: string) => Promise<any>
}

export type CreateDatabasePayload = {
    databaseName: string;
    databasePort: string;
    databasePassword: string;
    databaseUser: string;
    database: string;
    version: {
        title: string;
        value: string;
    };
}