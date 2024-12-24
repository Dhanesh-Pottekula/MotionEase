const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
const isDev = !app.isPackaged;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'electron', 'preload.js'),
      contextIsolation: true, // Isolate context for security
      enableRemoteModule: false, // Disable remote module
      nodeIntegration: false, // Disable node integration
    },
  });


  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;
  // Load React app
  mainWindow.loadURL(startURL); 

  // Optional: Open DevTools
  mainWindow.webContents.openDevTools();

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
});

// Quit app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
