import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Vault from './lib/vault/Vault'
import windowStateKeeper from 'electron-window-state'

const name = process.env.MAIN_VITE_NAME || 'test'
const topic = process.env.MAIN_VITE_TOPIC || 'test-topic'
const vault = new Vault({ name, storage: `./temp/${name}`, topic })

function createWindow(): void {
  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 900,
    defaultHeight: 670,
    file: `window-state-${name}.json`,
  })

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
    },
  })

  // Lets us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  vault.initialize()
  vault.ready().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
})

let readyToQuit = false
let count = 0
const countDown = async () => {
  console.log(count)
  count--

  if (count > 0) {
    setTimeout(() => countDown(), 500)
  } else {
    readyToQuit = true
    app.quit()
  }
}
app.on('will-quit', async (event) => {
  if (!readyToQuit) {
    event.preventDefault()
    console.log('shutting down...')
    await vault.shutdown()
    countDown()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  console.log('window-all-closed')
  // For development, we'll quit the app when all windows are closed even on macOS.
  app.quit()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.handle('getState', () => {
  return vault.getState()
})

ipcMain.handle('create', (_event, collection: string, doc: Record<string, unknown>) => {
  return vault.create(collection, doc)
})
