import type Dockerode from "dockerode";

export type DockerApiProps = {
    stopContainer: (id: string) => Promise<any>;
    startContainer: (id: string) => Promise<any>;
    createMysqlContainer: (payload: string) => Promise<boolean>;
    deleteMysqlContainer: () => string;
    getAllContainers: () => Promise< Dockerode.ContainerInfo[]>;
    checkConnection: () => Promise<boolean>
}

export type CreateMysqlPayload = {
    databaseName: string;
    databasePort: number;
    databasePassword: string;
    databaseUser: string;
}