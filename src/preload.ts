const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("bridge", {
  importFile() {
    return ipcRenderer.invoke("select-file");
  },
  getLogos() {
    return ipcRenderer.invoke("get-logo");
  },
  export(template: any, paths: string[]) {
    return ipcRenderer.invoke("export", template, paths);
  },
});
