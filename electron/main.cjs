const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Store = require('electron-store');

const store = new Store();

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  // In development, use the Vite dev server
  if (process.env.ELECTRON === 'true') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from dist directory
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Save window state
  let windowState = store.get('windowState', {
    width: 1200,
    height: 800,
    isMaximized: false
  });

  mainWindow.on('close', () => {
    windowState = {
      ...windowState,
      isMaximized: mainWindow.isMaximized(),
      ...(!mainWindow.isMaximized() && {
        width: mainWindow.getBounds().width,
        height: mainWindow.getBounds().height,
      })
    };
    store.set('windowState', windowState);
  });

  // Restore window state
  if (windowState.isMaximized) {
    mainWindow.maximize();
  } else {
    mainWindow.setBounds({
      width: windowState.width,
      height: windowState.height,
      x: undefined,
      y: undefined
    });
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.handle('getData', (_, key) => {
  return store.get(key);
});

ipcMain.handle('setData', (_, key, value) => {
  store.set(key, value);
  return true;
});

ipcMain.handle('getAppPath', () => {
  return app.getPath('userData');
});