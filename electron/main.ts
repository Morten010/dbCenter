import Docker from "dockerode";
import { app, BrowserWindow, ipcMain, ipcRenderer } from "electron";
import path from "path";
import { createMysqlContainer } from "./docker/CreateMysqlContainer";
import { deleteMysqlDatabase } from "./docker/DeleteMysqlDatabase";
import { pingDocker } from "./docker/ping";
import StartMysqlDatabase from "./docker/StartMysqlDatabase";
import stopMysqlDatabase from "./docker/StopMysqlDatabase";
import { allVolumes } from "./docker/allVolumes";
import { readConfigFromVolume } from "./docker/getConfig";
import type { databaseStoreProps } from "~/types/store";
import mysql from 'mysql2/promise';
import { CheckStatus } from "./docker/checkStatus";
import { AppUpdater as _, autoUpdater } from "electron-updater"

autoUpdater.autoDownload = false;

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
  ipcMain.handle('docker/create/mysql', async (_event, args) => {
    return await createMysqlContainer(args)
  })
  ipcMain.handle('docker/start/mysql', async (_event, payload: string) => {
    return await StartMysqlDatabase(JSON.parse(payload))
  })
  ipcMain.handle('docker/stop/mysql', async (_event, containerId) => {
    return await stopMysqlDatabase(containerId)
  })
  ipcMain.handle('docker/delete/mysql', (_event, payload) => {
    return deleteMysqlDatabase(JSON.parse(payload))
  })
  ipcMain.handle('docker/volumes/all', () => {
    return allVolumes()
  })
  ipcMain.handle('docker/getConfig', (_event, volumeName) => {
    return readConfigFromVolume(volumeName)
  })
  ipcMain.handle('docker/sync', (_event, volumeId) => {
    return CheckStatus(volumeId)
  })

  // Mysql api
  ipcMain.handle('mysql/query', async (_event, payload) => {
    const {
      db,
      query
    }: {
      db: databaseStoreProps,
      query: string
    } = JSON.parse(payload)

    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        user: db.user,
        password: db.password,
        database: 'tables',
        port: Number(db.port)
      });

      const [results, fields] = await connection.query(
        query
      );
      

      await connection.end()
      return {
        success: true,
        data: results,
        fields: fields,
        message: 'Success'
      }
  } catch (err) {
    
      return {
        success: false,
        message: 'Failed to connect to mysql database',
        error: err
      }
  }
  })


  // update api
  ipcMain.handle('update/check', async () => {
    const res = await autoUpdater.checkForUpdates()
    const currentVersion = app.getVersion()
    console.log(res);

    if(res?.updateInfo.version !== currentVersion){
      return {
        success: true,
        message: `Version ${res?.updateInfo.version} is now available`,
        data: res,
        currentVersion: currentVersion
      }
    }
    
    return {
      success: false,
      message: 'No update available',
      data: res,
      currentVersion: currentVersion
    }
  })
  ipcMain.handle('update/run', () => {
    autoUpdater.quitAndInstall(false, true);
    return 'updating'
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