
const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs protegidas para o navegador
contextBridge.exposeInMainWorld('electron', {
  navigate: (callback) => {
    ipcRenderer.on('navigate', (_, path) => callback(path));
  }
});
