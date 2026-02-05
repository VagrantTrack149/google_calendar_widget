const {app, BrowserWindow, ipcMain, ipcRenderer,dialog, shell, Menu, MenuItem, Tray, nativeImage, Notification} = require("electron");
const path = require("path");
const url = require("url");

let mainWindow = null;
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
    mainWindow.loadFile("src/index.html");
    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}
//app.on("ready", mainWindow);

function widget_ventana() {
    const win = new BrowserWindow({
        width: 600,
        height: 600,
        type: 'toolbar', // Depende del SO
        transparent: true,
        frame: false,
        skipTaskbar: true, // No aparece en la barra de tareas
        resizable: true,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile("src/index.html");
    win.on("closed", () => {
        win = null;
        app.quit();
    });

    const iconPath = path.join(__dirname, 'public', 'img', 'jupiter.png');
    const icon = nativeImage.createFromPath(iconPath);
    const tray = new Tray(icon); 
    if (tray) {
        console.log(tray);
    }else{
        console.log("No se pudo crear el icono de la bandeja");
    }
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Cerrar', click: () => { win.close(); app.quit(); win= null; } },
        { label: 'Abrir', click: () => { win.show(); } },
        { label: 'Minimizar', click: () => { win.minimize(); } }
        
    ]);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('Widget Google Calendar');
}

app.on("ready", widget_ventana);