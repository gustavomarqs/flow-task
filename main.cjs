const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js') // Caminho no ambiente empacotado
        : path.join(__dirname, 'src/preload.js'), // Caminho no ambiente de desenvolvimento
      contextIsolation: true, // Recomendado para segurança
      nodeIntegration: false, // Recomendado para segurança
    },
  });

  const indexPath = app.isPackaged
    ? `file://${path.join(__dirname, 'dist/index.html')}` // Caminho no ambiente empacotado
    : 'http://localhost:5173'; // Caminho no ambiente de desenvolvimento

  win.loadURL(indexPath);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
