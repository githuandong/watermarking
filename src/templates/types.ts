export type Item = {
  name: string;
  type: string;
  value?: string;
  style?: object;
};

export type Text = {
  name: string;
  type: string;
  value: string;
  style: {
    fontFamily: string;
    fontSize: number;
    color: string;
    x: number;
    y: number;
  };
};

export type Line = {
  name: string;
  type: string;
  style: {
    color: string;
    from: [number, number];
    to: [number, number];
  };
};

export type Icon = {
  name: string;
  type: string;
  value: string;
  style: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
};

export const isText = (obj: Item): obj is Text => obj.type === "text";
export const isLine = (obj: Item): obj is Line => obj.type === "line";
export const isIcon = (obj: Item): obj is Icon => obj.type === "icon";
