import { contextBridge, ipcRenderer } from 'electron'
import type { DockerApiProps } from "~/types/dockerApi"
import type { databaseStoreProps } from '~/types/store'

// Docker Api

const DOCKER_API: DockerApiProps = {
    stopContainer: (id) => ipcRenderer.invoke('docker/stop/mysql', id),
    startContainer: (db) => ipcRenderer.invoke('docker/start/mysql', db),
    createMysqlContainer: (x) => ipcRenderer.invoke('docker/create/mysql', x),
    deleteMysqlContainer: (db) => ipcRenderer.invoke('docker/delete/mysql', db),
    getAllContainers: () => ipcRenderer.invoke('docker/list'),
    checkConnection: () => ipcRenderer.invoke('docker/ping'),
    syncMysql: () => ipcRenderer.invoke('docker/sync')
}

contextBridge.exposeInMainWorld('docker', DOCKER_API)

