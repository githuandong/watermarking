import { create } from "zustand";

export default create<{
  imgPath: string;
  template: any;
  draw: null | typeof import("@/templates/one/draw").default;
}>(() => ({
  imgPath: "",
  template: null,
  draw: null,
}));
