/**
 * Preload script - exposes safe APIs to the renderer process.
 */
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('frontier', {
  platform: process.platform,
  version: require('./package.json').version,
});
