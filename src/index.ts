import { app, BrowserWindow, ipcMain, dialog, nativeImage } from "electron";
import path from "path";
import fs from "fs";
import ExifParser from "exif-parser";
import templates from "./templates/index";
import { getMakeLogo } from "./templates/logos";
import { createCanvas, loadImage } from "canvas";

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
          // 生成缩略图
          const nativeImageObj = await nativeImage.createThumbnailFromPath(
            path,
            {
              width: 300,
              height: 150,
            }
          );
          // 读取EXIF
          const buffer = await new Promise<Buffer>((resolve) => {
            fs.readFile(path, (err, data) => {
              if (err) throw err;
              resolve(data);
            });
          });
          const parser = ExifParser.create(buffer);
          const tags = parser.parse().tags;
          return {
            path,
            dataURL: nativeImageObj.toDataURL(),
            tags,
          };
        })
      );
    })
);

// 根据模板导出
ipcMain.handle(
  "export",
  async (
    _,
    tpl: any,
    imgList: { path: string; tags: Record<string, string> }[]
  ) => {
    // 根据名称找到对应的渲染函数
    const {
      draw,
      template: rawTpl,
      write,
    } = templates.find((e) => e.template.name === tpl.name);
    const cvs = createCanvas(100, 100);
    const ctx: any = cvs.getContext("2d");

    let exportPath = "";
    let dir = "";
    let isOne = imgList.length === 1;

    if (imgList.length === 1) {
      // 只导出一个图片，选择存储地点并重命名
      const res = await dialog.showSaveDialog(mainWindow, {
        title: "导出图片",
        defaultPath: `WATER_${imgList[0].path.split(/[\/\\]/).pop()}`,
        buttonLabel: "确定",
      });
      exportPath = res.filePath;
    } else {
      // 获取存储文件夹
      const { filePaths: dirs } = await dialog.showOpenDialog(mainWindow, {
        title: "选择导出文件夹",
        properties: ["openDirectory"],
        buttonLabel: "确定",
      });
      dir = dirs[0];
    }

    if (!(path || dir)) return;

    for (const imgItem of imgList) {
      // 单张图使用传递过来的数据，多图则使用EXIF元数据
      const template = isOne ? tpl : write(imgItem.tags);
      // 厂商logo地址转为绝对地址
      let e = template.box.items.find((e: any) => e.type === "icon");
      e.value = path.join(__dirname, getMakeLogo(e.value));
      // 绘制水印
      await draw(imgItem.path, ctx, template, {
        sizeInit: ({ width, height }) => {
          cvs.width = width;
          cvs.height = height;
        },
        loadImage: (p: string) =>
          new Promise((resolve) => {
            loadImage(p)
              .then((img) => resolve(img as any))
              .catch((e) => {
                console.log(e);
              });
          }),
      });
      // 导出
      const buffer = cvs.toBuffer("image/jpeg", {
        quality: 1,
      });
      await new Promise<void>((resolve) => {
        fs.writeFile(
          isOne
            ? exportPath
            : `${dir}/WATER_${imgItem.path.split(/[\/\\]/).pop()}`,
          buffer,
          (err) => {
            if (!err) {
              resolve();
            }
          }
        );
      });
    }
  }
);
