const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
  importFile() {
    return ipcRenderer.invoke("select-file");
  },
  readEXIF(path: string) {
    return ipcRenderer.invoke("read-file", path);
  },
  getLogos() {
    return ipcRenderer.invoke("get-logo");
  },
  export() {
    return ipcRenderer.invoke("export");
  },
});
