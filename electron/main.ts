import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path';
import { fileURLToPath } from 'url';
import Docker from 'dockerode'

const docker = new Docker()

const filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const dirname = path.dirname(filename);

app.whenReady().then(() => {
  new BrowserWindow({
    webPreferences: {
        preload: path.join(dirname, '/preload.js'),
        nodeIntegration: true
    }
  }).loadURL(process.env.VITE_DEV_SERVER_URL!)
})

ipcMain.handle('docker-command', async (event, command, params) => {
  try {
    // Example: Handle various Dockerode commands
    if (command === 'listContainers') {
      const containers = await docker.listContainers();
      console.log(containers);
      
      return containers;
    }
    // Add more commands as needed
  } catch (error) {
    // @ts-expect-error
    return { error: error.message };
  }
});