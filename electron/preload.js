const { contextBridge, ipcRenderer } = require('electron');

// Expose APIs to the Renderer process
contextBridge.exposeInMainWorld('electron', {
  // Example: Send message to the Main process
  sendMessage: (channel, data) => {
    const validChannels = ['toMain']; // Whitelist channels
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },

  // Example: Receive message from the Main process
  onMessage: (channel, callback) => {
    const validChannels = ['fromMain']; // Whitelist channels
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
});
