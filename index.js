const {app, BrowserWindow, ipcMain, ipcRenderer,dialog, shell, Menu, MenuItem, Tray, nativeImage, Notification} = require("electron");
const path = require("path");
const url = require("url");
const fs = require('fs');

let mainWindow = null;
let win = null;
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
    win = new BrowserWindow({
        width: 600,
        height: 600,
        type: 'toolbar', // Depende del SO
        transparent: false,
        frame: true,
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

    function applyConfig(cfg) {
        if (!win || !cfg) return;
        if (typeof cfg.alwaysOnTop === 'boolean') win.setAlwaysOnTop(cfg.alwaysOnTop);
        if (typeof cfg.movable === 'boolean' && win.setMovable) win.setMovable(cfg.movable);
        if (typeof cfg.resizable === 'boolean') win.setResizable(cfg.resizable);
        if (typeof cfg.width === 'number' && typeof cfg.height === 'number') win.setSize(cfg.width, cfg.height);
        if (typeof cfg.x === 'number' && typeof cfg.y === 'number') win.setPosition(cfg.x, cfg.y);
        console.log('Applied config', cfg);
    }

    function loadConfig() {
        const cfgPath = path.join(__dirname, 'widget-config.json');
        try {
            if (fs.existsSync(cfgPath)) {
                const raw = fs.readFileSync(cfgPath, 'utf8');
                const cfg = JSON.parse(raw);
                applyConfig(cfg);
            } else {
                console.log('No config file found at', cfgPath);
            }
        } catch (err) {
            console.error('Failed to load config:', err);
        }
    }
    const MenuTemplate = [
        {
            label: 'Archivo',
            submenu: [
                { label: 'Recargar', role: 'reload' },
                { label: 'Recargar configuración', click: () => { loadConfig(); } },
                { type: 'separator' },
                { label: 'Salir', click: () => { app.quit(); } }
            ]
        },
        {
            label: 'Opciones',
            submenu: [
                { label: 'Ver en pantalla completa', role: 'togglefullscreen' },
                { label: 'Colocar con pin', click: () => { if (win) {  win.setMovable(false); win.setResizable(false); console.log('Pin'); } } },
                { label: 'Quitar pin', click: () => { if (win) {  win.setMovable(true); win.setResizable(true); console.log('No pin'); } } },
                { label: 'Siempre visible', click: () => { if (win) { win.setAlwaysOnTop(true); console.log('Top'); } } },
                { label: 'No siempre visible', click: () => { if (win) { win.setAlwaysOnTop(false); console.log('No top'); } } },
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
    console.log(iconPath);
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
