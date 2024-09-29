import Docker from "dockerode";
import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { createMysqlContainer } from "./docker/CreateMysqlContainer";
import { deleteMysqlDatabase } from "./docker/DeleteMysqlDatabase";
import { pingDocker } from "./docker/ping";
import StartMysqlDatabase from "./docker/StartMysqlDatabase";
import stopMysqlDatabase from "./docker/StopMysqlDatabase";
import { syncMysql } from "./docker/syncMysql";

const docker = new Docker();

process.env.APP_ROOT = path.join(__dirname, '..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, '.output/public')

process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    webPreferences: {
      preload: path.join(MAIN_DIST, 'preload.js'),
    },
    icon: path.join(RENDERER_DIST, './favicon.png'),
    autoHideMenuBar: true,
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'))
  }
}

function initIpc() {
  
  // docker api
  ipcMain.handle('docker/list', async () => {
    const containers = await docker.listContainers({
      all: true
    });
    
    return containers;
  })
  ipcMain.handle('docker/ping', async () => {
    return pingDocker()
  })
  ipcMain.handle('docker/create/mysql', async (event, args) => {
    return await createMysqlContainer(args)
  })
  ipcMain.handle('docker/start/mysql', async (event, payload: string) => {
    return await StartMysqlDatabase(JSON.parse(payload))
  })
  ipcMain.handle('docker/stop/mysql', async (event, containerId) => {
    return await stopMysqlDatabase(containerId)
  })
  ipcMain.handle('docker/delete/mysql', (event, payload) => {
    return deleteMysqlDatabase(JSON.parse(payload))
  })
  ipcMain.handle('docker/sync', () => {
    return syncMysql()
  })
}



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(() => {
  initIpc()
  createWindow()
})