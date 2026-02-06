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

function widget_ventana(trans=false, fram=true) {
    win = new BrowserWindow({
        width: 600,
        height: 600,
        type: 'toolbar', // Depende del SO
        transparent: trans,
        frame: fram,
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
    const MenuTemplate = [
        {
            label: 'Archivo',
            submenu: [
                { label: 'Recargar', role: 'reload' },
                { type: 'separator' },
                { label: 'Salir', click: () => { app.quit(); } }
            ]
        },
        {
            label: 'Opciones',
            submenu: [
                { label: 'Ver en pantalla completa', role: 'togglefullscreen' },
                { label: 'Colocar con pin', click: () => {win=widget_ventana(true, true);console.log(win.frame);} },
                { label: 'Quitar pin', click: () => { win=widget_ventana(false, true);console.log(win.frame);} },
                { label: 'Siempre visible', click: () => { win.setAlwaysOnTop(true); win.reload(); } },
                { label: 'No siempre visible', click: () => { win.setAlwaysOnTop(false); win.reload(); } },
                { type: 'separator' },
                { label: 'Herramientas de desarrollo (Precaución)', role: 'toggledevtools' }
            ]
        },
        {
            label: 'Ayuda',
            submenu: [
                { label: 'Acerca de', click: ()=> {const aboutWin = new BrowserWindow({ width: 400, height: 300, modal: true, parent: win, resizable:false,title:"Acerca de CalendarWidget" , webPreferences: { nodeIntegration: true } });aboutWin.setMenu(null);  aboutWin.loadFile(path.join(__dirname, 'src', 'about.html')); } },
                { type: 'separator' },
                { label: 'Soporte Google Calendar', click: async () => { await shell.openExternal('https://google.com'); } }
            ]
        }
    ];
   
    const mainMenu = Menu.buildFromTemplate(MenuTemplate);
    Menu.setApplicationMenu(mainMenu);
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
