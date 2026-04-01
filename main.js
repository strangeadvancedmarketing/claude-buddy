const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const WebSocket = require('ws');

let mainWindow;
let wss;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  const windowWidth = 300;
  const windowHeight = 400;
  const margin = 16;

  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: screenWidth - windowWidth - margin,
    y: screenHeight - windowHeight - margin,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile('index.html');

  // Allow click-through on transparent areas but keep interactivity on the widget
  mainWindow.setIgnoreMouseEvents(false);

  // Forward IPC from renderer to set ignore mouse events on transparent areas
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    mainWindow.setIgnoreMouseEvents(ignore, options || { forward: true });
  });
}

function startWebSocketServer() {
  wss = new WebSocket.Server({ port: 9876 });

  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('hook-event', message);
        }
      } catch (e) {
        // ignore malformed messages
      }
    });

    ws.on('error', () => {});
  });

  wss.on('error', (err) => {
    if (err.code !== 'EADDRINUSE') {
      console.error('WebSocket server error:', err.message);
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  startWebSocketServer();
});

app.on('window-all-closed', () => {
  if (wss) wss.close();
  app.quit();
});
