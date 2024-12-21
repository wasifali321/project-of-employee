const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getData: (key) => ipcRenderer.invoke('getData', key),
  setData: (key, value) => ipcRenderer.invoke('setData', key, value),
  getAppPath: () => ipcRenderer.invoke('getAppPath'),
});