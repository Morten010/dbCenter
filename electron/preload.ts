import { contextBridge, ipcRenderer } from 'electron'
import type { DockerApiProps } from "~/types/dockerApi"

// docker api

const DOCKER_API: DockerApiProps = {
    stopContainer: (id) => ipcRenderer.invoke('docker/stop/mysql', id),
    startContainer: (id) => ipcRenderer.invoke('docker/start/mysql', id),
    createMysqlContainer: (x) => ipcRenderer.invoke('docker/create/mysql', x),
    deleteMysqlContainer: () => "deleted mysql container",
    getAllContainers: () => ipcRenderer.invoke('docker/list'),
    checkConnection: () => ipcRenderer.invoke('docker/ping')
}

contextBridge.exposeInMainWorld('docker', DOCKER_API)
