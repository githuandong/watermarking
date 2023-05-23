interface Window {
  bridge: {
    importFile: () => Promise<
      {
        dataURL: string;
        path: string;
        tags: Record<string, any>;
      }[]
    >;
    readEXIF: (path: string) => Promise<any>;
    export: (tplName: strinng, imgList: any[]) => Promise<any>;
  };
}

declare module "*.module.scss" {
  const styles: Record<string, string>;
  export default styles;
}

declare module "exif-parser";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";
declare module "@/assets/font/iconfont.js";
