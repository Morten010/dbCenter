import { contextBridge, ipcRenderer } from 'electron'
import type { DockerApiProps } from "~/types/dockerApi"
import type { MysqlApiProps } from '~/types/mysqlApi'

// Docker Api

const DOCKER_API: DockerApiProps = {
    stopContainer: (id) => ipcRenderer.invoke('docker/stop/mysql', id),
    startContainer: (db) => ipcRenderer.invoke('docker/start/mysql', db),
    createMysqlContainer: (x) => ipcRenderer.invoke('docker/create/mysql', x),
    deleteMysqlContainer: (db) => ipcRenderer.invoke('docker/delete/mysql', db),
    getAllContainers: () => ipcRenderer.invoke('docker/list'),
    checkConnection: () => ipcRenderer.invoke('docker/ping'),
    allVolumes: () => ipcRenderer.invoke('docker/volumes/all'),
    getConfig: (volumeName: string) => ipcRenderer.invoke('docker/getConfig', volumeName),
    sync: (volumeId: string) => ipcRenderer.invoke('docker/sync', volumeId)
}

contextBridge.exposeInMainWorld('docker', DOCKER_API)

const MYSQL_API: MysqlApiProps = {
    query: (payload: string) => ipcRenderer.invoke('mysql/query', payload)
}

contextBridge.exposeInMainWorld('mysql', MYSQL_API)