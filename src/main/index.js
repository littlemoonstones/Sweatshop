import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import createChildWindow from './pecd'
import createAboutWindow from './about'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  console.log(`${__dirname}`)
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 620,
    useContentSize: true,
    width: 600,
    frame: false,
    resizable: false
  })

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);

  // addWindow = new BrowserWindow({
  //   height: 960,
  //   width: 960,

  // })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})


ipcMain.on('open-child', () => {
  console.log("open-child: createChild")
  createChildWindow(mainWindow);
})

ipcMain.on('setWindowSizeChart', () => {
  mainWindow.setSize(960, 1000, true)
})

ipcMain.on('setWindowSizeDrag', () => {
  let width = 600;
  let height = 620
  mainWindow.setMinimumSize(width, height)
  mainWindow.setSize(width, height, true)
})

ipcMain.on('minimize', () => {
  mainWindow.minimize()
})

ipcMain.on('closed', () => {
  mainWindow.close()
})

ipcMain.on('open-about', () => {
  createAboutWindow()
})

const mainMenuTemplate = [{
  label: 'File',
  submenu: [{
          label: 'About',
          click() {
              createAboutWindow();
          }
      },
      {
          label: 'Quit',
          accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+W',
          click() {
              app.quit();
          }
      }
  ]
}];
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
