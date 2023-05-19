import _ from "lodash";
import dayjs from "dayjs";
import useStore from "@/store";
import templates from "./index";
import { getMakeLogo } from "./logos";

// 设置模板字段值
const setTplValue = (tpl: any, name: string, value: string) => {
  const items = tpl.box.items;
  const el = items.find((e: any) => e.name === name);
  el.value = value;
};

export const initPreview = (path: string) => {
  // 默认选用第一个模板
  const tpl = templates[0];
  window.bridge.readEXIF(path).then((res) => {
    const template = _.cloneDeep(tpl.template);
    if (res && Object.keys(res).length > 0) {
      setTplValue(template, "机型", res.Model || res.LensMake);
      setTplValue(
        template,
        "拍摄日期",
        dayjs.utc(res.CreateDate * 1000).format("YYYY.MM.DD HH:mm:ss")
      );
      setTplValue(template, "镜头", res.LensModel);
      setTplValue(
        template,
        "拍摄参数",
        `${res.FocalLength}mm  F${
          Math.round(Math.pow(1.4142, res.ApertureValue) * 10) / 10
        } 1/${Math.ceil(Math.pow(2, res.ShutterSpeedValue))}S ISO${res.ISO}`
      );
      setTplValue(template, "图标", getMakeLogo(res.LensMake));
    }
    useStore.setState({
      imgPath: path,
      template,
      draw: tpl.draw,
    });
  });
};
