import type { DockerApiProps } from "~/types/dockerApi"

const { contextBridge, ipcRenderer } = require('electron')

// docker api

const DOCKER_API: DockerApiProps = {
    stopContainer: () => "Container Stopped",
    startContainer: () => "Container Started",
    createMysqlContainer: () => "Created mysql container",
    deleteMysqlContainer: () => "deleted mysql container",
}

contextBridge.exposeInMainWorld('docker', DOCKER_API)

// os api
