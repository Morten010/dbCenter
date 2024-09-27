import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Docker from "dockerode";
import type { CreateMysqlPayload } from "~/types/dockerApi";
import { createMysqlContainer } from "./docker/CreateMysqlContainer";
import StartMysqlDatabase from "./docker/StartMysqlDatabase";
import type { databaseStoreProps } from "~/types/store";
import stopMysqlDatabase from "./docker/StopMysqlDatabase";
import { deleteMysqlDatabase } from "./docker/DeleteMysqlDatabase";

const docker = new Docker();

const filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const dirname = path.dirname(filename);

app.whenReady().then(() => {
  new BrowserWindow({
    webPreferences: {
      preload: path.join(dirname, "/preload.js"),
      nodeIntegration: true,
    },
    icon: path.join(dirname, '../public/favicon.png'),
    autoHideMenuBar: true,
  }).loadURL(process.env.VITE_DEV_SERVER_URL!);
});

ipcMain.handle('docker/list', async () => {
  const containers = await docker.listContainers({
    all: true
  });
  
  return containers;
})


ipcMain.handle('docker/ping', async () => {
  try {
    // Ping docker to check connection
    const ping = await docker.ping();

    // turn binary into string
    const pingstr = Buffer.from(ping).toString("utf-8");

    return pingstr === "OK";
  } catch (error) {
    return false
  }
})

ipcMain.handle('docker/create/mysql', async (event, args) => {
  
  return await createMysqlContainer(args)
})

ipcMain.handle('docker/start/mysql', async (event, payload: string) => {
  try {
    const db: databaseStoreProps = JSON.parse(payload)
    console.log(db);
    

    return await StartMysqlDatabase(db)
  } catch (error) {
    console.log(error);
    
    return {
      success: true,
      message: 'Failed to start database'
    }
  }
})

ipcMain.handle('docker/stop/mysql', async (event, containerId) => {
  return await stopMysqlDatabase(containerId)
})

ipcMain.handle('docker/delete/mysql', (event, payload) => {
  const db: databaseStoreProps = JSON.parse(payload) 

  return deleteMysqlDatabase(db)
})