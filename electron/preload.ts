import type { DockerApiProps } from "~/types/dockerApi"
import Docker from "dockerode"
import { contextBridge, ipcRenderer } from 'electron'

// docker api
const docker = new Docker()

const DOCKER_API: DockerApiProps = {
    stopContainer: () => "Container Stopped",
    startContainer: () => "Container Started",
    createMysqlContainer: () => "Created mysql container",
    deleteMysqlContainer: () => "deleted mysql container",
    getAllContainers: () => ipcRenderer.invoke('docker-command', 'listContainers'),
    checkConnection: () => ipcRenderer.invoke('docker-command', 'checkConnection')
}

contextBridge.exposeInMainWorld('docker', DOCKER_API)
