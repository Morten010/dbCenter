export type DockerApiProps = {
    stopContainer: () => string;
    startContainer: () => string;
    createMysqlContainer: () => string;
    deleteMysqlContainer: () => string;
}

