// LocalBrain Electron Main Process
// Native macOS app with instant hot reload

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV !== 'production';

// Import IPC handlers (will be compiled TypeScript)
let setupIPCHandlers;
try {
  setupIPCHandlers = require('./main/ipc-handlers').setupIPCHandlers;
} catch (error) {
  console.warn('⚠️ IPC handlers not compiled yet, using fallback handlers');
}

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

let mainWindow;

async function waitForNextJS(url, maxAttempts = 30) {
  const http = require('http');
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await new Promise((resolve, reject) => {
        http.get(url, (res) => {
          if (res.statusCode === 200) resolve();
          else reject();
        }).on('error', reject);
      });
      return true;
    } catch {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  return false;
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1b1b1d',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev
    },
    show: false
  });

  // Show window when ready to prevent flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  if (isDev) {
    // Wait for Next.js dev server to be ready (try common ports)
    const ports = [3000, 3001, 3002, 3003];
    let nextURL = null;
    let nextReady = false;

    for (const port of ports) {
      const url = `http://localhost:${port}`;
      nextReady = await waitForNextJS(url);
      if (nextReady) {
        nextURL = url;
        break;
      }
    }

    if (nextReady && nextURL) {
      console.log(`✅ Loading Next.js from ${nextURL}`);
      mainWindow.loadURL(nextURL);
      mainWindow.webContents.openDevTools();
    } else {
      console.error('❌ Next.js dev server failed to start on any port');
    }
  } else {
    // Production - load from built files
    mainWindow.loadFile(path.join(__dirname, 'renderer/out/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  // Setup IPC handlers after window is created
  if (setupIPCHandlers) {
    setupIPCHandlers(mainWindow);
  } else {
    console.warn('⚠️ Using fallback IPC handlers');
    // Fallback handlers (same as before)
    ipcMain.handle('ai:send-message', async (event, { provider, message, context }) => {
      return { success: true, response: 'AI service handler ready' };
    });
    ipcMain.handle('voice:start-recording', async (event) => {
      return { success: true, status: 'recording' };
    });
    ipcMain.handle('voice:stop-recording', async (event) => {
      return { success: true, status: 'stopped' };
    });
    ipcMain.handle('context:add-file', async (event, filePath) => {
      return { success: true, fileId: 'temp-id' };
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
