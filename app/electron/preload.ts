import { contextBridge, ipcRenderer } from 'electron';

export type ReceiveOpts = {
  once?: boolean;
};

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
  receive: (channel, func, opts: ReceiveOpts = {}) => {
    const { once = false } = opts;
    const validPrefixes = ['commandResponse-'];
    const validChannels = ['currentMenu', 'setMenu', 'locale', 'appConfig'];
    if (
      validChannels.includes(channel) ||
      validPrefixes.some(prefix => channel.startsWith(prefix))
    ) {
      // Deliberately strip event as it includes `sender`
      if (once) {
        ipcRenderer.once(channel, ({}, ...args) => func(...args));
      } else {
        ipcRenderer.on(channel, ({}, ...args) => func(...args));
      }
    }
  },
  invoke: (channel, data) => {
    // allowed channels
    const validChannels = ['runCommand'];
    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
  },
});
