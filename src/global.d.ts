interface Window {
  bridge: {
    importFile: () => Promise<
      {
        dataURL: string;
        path: string;
      }[]
    >;
    readEXIF: (path: string) => Promise<any>;
    // getLogos: () => Promise<Record<string, string>>;
    export: (tpl: any, paths: string[]) => Promise<any>;
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
