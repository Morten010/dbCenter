import type Dockerode from "dockerode";

export type DockerApiProps = {
    stopContainer: () => string;
    startContainer: () => string;
    createMysqlContainer: () => string;
    deleteMysqlContainer: () => string;
    getAllContainers: () => Promise< Dockerode.ContainerInfo[]>
}

