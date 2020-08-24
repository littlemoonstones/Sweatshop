import { BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

var aboutWindow
let aboutWindows = []
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#/about`
  : `file://${__dirname}/index.html#about`

function createAboutWindow() {
  console.log(`${__dirname}`)
  /**
   * Initial window options
   */
  if (aboutWindows.length == 0) {
    aboutWindow = new BrowserWindow({
      //   title: "hello-child",
      height: 400,
      useContentSize: true,
      width: 300,
      resizable: false,
      frame: false,
      // hasShadow: false
    })
    aboutWindows.push(aboutWindow)
    aboutWindow.loadURL(winURL)
  }

  aboutWindow.on('closed', () => {
    aboutWindow = null
  })

  return aboutWindow;
}

ipcMain.on("closed-about", ()=>{
  aboutWindow.close()
  aboutWindows.pop()
})

export default createAboutWindow;