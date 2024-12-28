const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
let mainWindow;
const isDev = !app.isPackaged;
function createMainWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
    // width: 1000,
    // height: 600,
    frame: false,
    autoHideMenuBar: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Isolate context for security
      enableRemoteModule: false, // Disable remote module
      nodeIntegration: false, // Disable node integration
    },

  });

  // Set the window to be visible on all workspaces
  mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  mainWindow.setIgnoreMouseEvents(true);

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  
  // Load React app
  mainWindow.loadURL(startURL);

  // Optional: Open DevTools
  // mainWindow.webContents.openDevTools();

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createMainWindow);

// Quit app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Ensure to create the window on macOS when no windows are open
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.on('allow-mouse-events', (event, bounds) => {
  mainWindow.setIgnoreMouseEvents(false);
});

ipcMain.on('reset-ignore-mouse-events', () => {
  mainWindow.setIgnoreMouseEvents(true);
});