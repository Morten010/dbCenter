import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Docker from "dockerode";
import type { CreateMysqlPayload } from "~/types/dockerApi";
import { createMysqlContainer } from "./docker/CreateMysqlContainer";

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

ipcMain.handle('docker/start/mysql', async (event, id) => {
  try {
    const container = docker.getContainer(id)

    await container.start()

    return {
      success: true,
      message: 'Successfully started container'
    }
  } catch (error) {
    return {
      success: true,
      message: 'Failed to start container'
    }
  }
})

ipcMain.handle('docker/stop/mysql', async (event, id) => {
  try {
    const container = docker.getContainer(id)

    await container.stop()

    return {
      success: true,
      message: 'Successfully shutdown container'
    }
  } catch (error) {
    return {
      success: true,
      message: 'Failed to shutdown container'
    }
  }
})