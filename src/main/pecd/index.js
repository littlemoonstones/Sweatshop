import { BrowserWindow, ipcMain } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

var childWindow
let childWindows = []
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080/#/chart-child`
  : `file://${__dirname}/index.html#chart-child`

function createChildWindow(parentWindow) {
  console.log("child_num: ", childWindows.length)
  /**
   * Initial window options
   */
  if (childWindows.length == 0) {
    childWindow = new BrowserWindow({
      //   title: "hello-child",
      height: 960,
      useContentSize: true,
      width: 400,
      frame: false,
      resizable: true,
      parent: parentWindow
    })
    childWindows.push(childWindow)
    childWindow.loadURL(winURL)
  }

  childWindow.on('closed', () => {
    childWindow = null
  })
  // return childWindow;
}
ipcMain.on('setWindowSizeDrag', () => {
    if(childWindow){
    childWindow.close();
    childWindow = null;
    childWindows.pop()
  }
})

ipcMain.on("closed-child", ()=>{
  childWindow.close()
  childWindow = null
  childWindows.pop()
})
// app.on('ready', createChildWindow)

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })

// app.on('activate', () => {
//   if (childWindow === null) {
//     createChildWindow()
//   }
// })

export default createChildWindow;