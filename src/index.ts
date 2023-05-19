import { app, BrowserWindow, ipcMain, dialog, nativeImage } from "electron";
import path from "path";
import fs from "fs";
import ExifParser from "exif-parser";
// const templates = require("./templates/index");
// const { createCanvas, loadImage } = require("canvas");

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      webSecurity: false,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  // mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {
  createWindow();
});

// 各平台常规处理
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 处理图片选择
ipcMain.handle("select-file", () =>
  dialog
    .showOpenDialog(mainWindow, {
      properties: ["openFile", "multiSelections"],
      filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "tiff"] }],
    })
    .then(({ filePaths }) => {
      return Promise.all(
        filePaths.map(async (path) => {
          const nativeImageObj = await nativeImage.createThumbnailFromPath(
            path,
            {
              width: 300,
              height: 150,
            }
          );
          return {
            path,
            dataURL: nativeImageObj.toDataURL(),
          };
        })
      );
    })
);

// 读取图片EXIF
ipcMain.handle("read-file", async (_, path) => {
  const buffer = await new Promise((resolve) => {
    fs.readFile(path, (err, data) => {
      if (err) throw err;
      resolve(data);
    });
  });
  const parser = ExifParser.create(buffer);
  const result = parser.parse();
  return result.tags;
});

// // 根据模板导出
// ipcMain.handle("export", async (_, template, paths) => {
//   // 根据名称找到对应的渲染函数
//   const { draw } = templates.find((e) => e.template.name === template.name);
//   const cvs = createCanvas(100, 100);
//   const ctx = cvs.getContext("2d");
//   // 获取存储文件夹
//   const res = await dialog.showSaveDialog(mainWindow);
//   if (!res.filePath) return;
//   paths.forEach(async (path) => {
//     await draw(path, ctx, template, {
//       sizeInit: ({ width, height }) => {
//         cvs.width = width;
//         cvs.height = height;
//       },
//       loadImage: (p) =>
//         new Promise((resolve) => {
//           loadImage(p).then(resolve);
//         }),
//     });
//     const buffer = cvs.toBuffer("image/jpeg");
//     fs.writeFile(`${res.filePath}/${path.basename(path)}`, buffer);
//   });
// });
