import oneTpl from "./one/template";
import oneDraw from "./one/draw";
import _ from "lodash";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

type Tags = Record<string, any>;

// 设置模板字段值
const setTplValue = (tpl: any, name: string, value: string) => {
  const items = tpl.box.items;
  const el = items.find((e: any) => e.name === name);
  el.value = value;
};

// 根据图片信息与模板生成新模板
const genTemplate = (tags: Tags, names: string[], tpl: any) => {
  const template = _.cloneDeep(tpl);
  const valueOf: Record<string, () => string> = {
    机型: () => tags.Model || tags.LensMake,
    拍摄日期: () =>
      dayjs.utc((tags.CreateDate || 0) * 1000).format("YYYY.MM.DD HH:mm:ss"),
    镜头: () => tags.LensModel,
    拍摄参数: () =>
      tags.FocalLength &&
      `${tags.FocalLength}mm  F${
        Math.round(Math.pow(1.4142, tags.ApertureValue) * 10) / 10
      }  1/${Math.ceil(Math.pow(2, tags.ShutterSpeedValue))}S  ISO${tags.ISO}`,
    图标: () => tags.LensMake || "NIKON",
  };
  if (tags && Object.keys(tags).length > 0) {
    names.forEach((name) => {
      setTplValue(template, name, valueOf[name]());
    });
  }
  return template;
};

export default [
  {
    template: oneTpl,
    draw: oneDraw,
    // 根据图片信息生成模板
    write: (tags: Tags) =>
      genTemplate(
        tags,
        ["机型", "拍摄日期", "镜头", "拍摄参数", "图标"],
        oneTpl
      ),
  },
];
