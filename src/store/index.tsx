import { create } from "zustand";

export type ImgItem = {
  dataURL: string;
  path: string;
  tags: Record<string, any>;
};

export default create<{
  imgList: ImgItem[];
  selectedImg: ImgItem | null;
  template: any;
}>(() => ({
  imgList: [],
  selectedImg: null,
  template: null,
}));
