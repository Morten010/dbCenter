import { app, BrowserWindow } from 'electron'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename);

app.whenReady().then(() => {
  new BrowserWindow({
    webPreferences: {
        preload: path.join(__dirname, '/preload.js')
    }
  }).loadURL(process.env.VITE_DEV_SERVER_URL!)
})
