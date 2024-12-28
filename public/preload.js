const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script is executing');
// Expose APIs to the Renderer process
contextBridge.exposeInMainWorld('electron', {
  sendMessage: (channel, data) => {
    const validChannels = ['allow-mouse-events',"reset-ignore-mouse-events"]; // Add the allowed channels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },//TODO

  onMessage: (channel, callback) => {
    const validChannels = ['fromMain']; // Add the allowed channels
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
});
