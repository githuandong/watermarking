// 照片底部展示
const tpl = {
  name: "底部水印",
  // 边框宽度，相对图片height
  border: 0.02,
  // 水印区域高度，相对图片height
  boxHeight: 0.13,
  // 水印区域绘制元数据
  box: {
    // 上右下左间距，相对boxHeight
    padding: 0.02,
    items: [
      {
        name: "机型",
        type: "text",
        value: "",
        style: {
          fontFamily: `"Helvetica Neue", sans-serif`,
          fontSize: 0.22,
          color: "#333",
          x: 0,
          y: 0,
        },
      },
      {
        name: "拍摄日期",
        type: "text",
        value: "",
        style: {
          fontFamily: `"Helvetica Neue", sans-serif`,
          fontSize: 0.16,
          color: "#999",
          x: 0,
          y: 0,
        },
      },
      {
        name: "拍摄参数",
        type: "text",
        value: "",
        style: {
          fontFamily: `"Helvetica Neue", sans-serif`,
          fontSize: 0.22,
          color: "#333",
          x: 0,
          y: 0,
        },
      },
      {
        name: "镜头",
        type: "text",
        value: "",
        style: {
          fontFamily: `"Helvetica Neue", sans-serif`,
          fontSize: 0.16,
          color: "#999",
          x: 0,
          y: 0,
        },
      },
      {
        name: "分隔线",
        type: "line",
        style: {
          color: "#f2f2f2",
          from: [0, 0],
          to: [0, 0],
        },
      },
      {
        name: "图标",
        type: "icon",
        value: "nikon",
        style: {
          width: 0,
          height: 0,
          x: 0,
          y: 0,
        },
      },
    ],
  },
};

export default tpl;
