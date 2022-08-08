import { contextBridge, ipcRenderer } from 'electron';
// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('desktopApi', {
  send: (channel, data) => {
    // allowed channels
    const validChannels = ['setMenu', 'locale', 'appConfig', 'pluginsLoaded'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = ['currentMenu', 'setMenu', 'locale', 'appConfig'];
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, ({}, ...args) => func(...args));
    }
  },
});
