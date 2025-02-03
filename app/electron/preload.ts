import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('desktopApi', {
  send: (channel, data) => {
    // allowed channels
    const validChannels = [
      'setMenu',
      'locale',
      'appConfig',
      'pluginsLoaded',
      'run-command',
      'plugin-manager',
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel, func) => {
    const validChannels = [
      'currentMenu',
      'setMenu',
      'locale',
      'appConfig',
      'command-stdout',
      'command-stderr',
      'command-exit',
      'plugin-manager',
      'backendToken',
    ];
    console.log(`+++ Preload: Registering listener for "${channel}"`);
    if (validChannels.includes(channel)) {
      // Deliberately strip event as it includes `sender`
      ipcRenderer.on(channel, (event, ...args) => {
        console.log(`+++ Preload received "${channel}":`, JSON.stringify(args, null, 2));
        func(...args);
      });
    }
  },

  removeListener: (channel, func) => {
    ipcRenderer.removeListener(channel, func);
  },
});
