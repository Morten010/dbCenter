import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import Docker from "dockerode";

const docker = new Docker();

const filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const dirname = path.dirname(filename);

app.whenReady().then(() => {
  new BrowserWindow({
    webPreferences: {
      preload: path.join(dirname, "/preload.js"),
      nodeIntegration: true,
    },
  }).loadURL(process.env.VITE_DEV_SERVER_URL!);
});

ipcMain.handle("docker-command", async (event, command, params) => {
  try {
    // Example: Handle various Dockerode commands
    switch (command) {
      case "listContainers":
        const containers = await docker.listContainers();

        return containers;
      case "checkConnection":
        try {
          // Ping docker to check connection
          const ping = await docker.ping();

          // turn binary into string
          const pingstr = Buffer.from(ping).toString("utf-8");

          return pingstr === "OK";
        } catch (error) {
          return false
        }
      default:
        return "Command does not exist";
    }
    // Add more commands as needed
  } catch (error) {
    // @ts-expect-error
    return { error: error.message };
  }
});
