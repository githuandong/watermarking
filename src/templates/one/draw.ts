import { isIcon, isLine, isText } from "../types";
export default async (
  path: string,
  ctx: CanvasRenderingContext2D,
  tpl: typeof import("./template").default,
  {
    sizeInit,
    loadImage,
  }: {
    sizeInit?: (size: { width: number; height: number }) => void;
    loadImage: (path: string) => Promise<HTMLImageElement>;
  }
) => {
  // 读取主图（node会有区别，所以使用传入函数）
  const img = await loadImage(path);

  const imgWidth = img.naturalWidth;
  const imgHeight = img.naturalHeight;
  // 边框宽度
  const borderWidth = Math.floor(imgHeight * tpl.border);
  // 信息容器高度
  const boxHeight = Math.floor(tpl.boxHeight * Math.min(imgWidth, imgHeight));
  // 设置画布尺寸
  const width = imgWidth + borderWidth * 2;
  const height = imgHeight + borderWidth + boxHeight;

  if (sizeInit) {
    sizeInit({
      width,
      height,
    });
  }

  // 重置画布
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);
  // 绘制阴影
  ctx.shadowOffsetX = Math.floor(boxHeight * tpl.shadow[0]);
  ctx.shadowOffsetY = Math.floor(boxHeight * tpl.shadow[1]);
  ctx.shadowBlur = Math.floor(boxHeight * tpl.shadow[2]);
  ctx.shadowColor = `rgba(0,0,0,${tpl.shadow[3]})`;
  // 写入图片
  ctx.drawImage(img, borderWidth, borderWidth, imgWidth, imgHeight);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;

  // 记录信息绘制区域坐标
  const boxX = borderWidth;
  const boxY = borderWidth + imgHeight;
  const paddingX = Math.floor(width * tpl.box.padding);
  ctx.textBaseline = "hanging";

  // 绘制机型日期
  const marginY = Math.floor(boxHeight * 0.1);

  const items = tpl.box.items;
  const find = (name: string) => tpl.box.items.find((e) => e.name === name);

  //  先行计算百分值
  items.forEach(({ style }) => {
    style.fontSize && (style.fontSize = Math.floor(style.fontSize * boxHeight));
  });

  for (const item of items) {
    if (isText(item)) {
      // 绘制文字
      const { name, value, style } = item;
      ctx.fillStyle = style.color;
      ctx.font = `${style.fontSize}px ${style.fontFamily}`;
      // 计算对应坐标
      (
        ({
          机型: () => {
            const el = find("拍摄日期").style;
            style.x = boxX + paddingX;
            style.y =
              boxY + (boxHeight - (style.fontSize + el.fontSize + marginY)) / 2;
          },
          拍摄日期: () => {
            const el = find("机型").style;
            style.x = el.x;
            style.y = el.y + el.fontSize + marginY;
          },
          拍摄参数: () => {
            const el = find("镜头");
            const textWidth =
              Math.max(
                ctx.measureText(value).width,
                ctx.measureText(el.value).width
              ) + paddingX;
            style.x = width - textWidth - borderWidth;
            style.y = find("机型").style.y;
          },
          镜头: () => {
            const el = find("拍摄参数");
            style.x = el.style.x;
            style.y = find("拍摄日期").style.y;
          },
        }) as any
      )[name]();
      ctx.fillText(value, style.x, style.y);
    }
    if (isLine(item)) {
      // 绘制分隔线
      const { style } = item;
      ctx.beginPath();
      ctx.lineWidth = Math.floor(boxHeight * 0.02);
      style.from = [
        find("拍摄参数").style.x - paddingX / 2,
        find("机型").style.y,
      ];
      style.to = [style.from[0], height - (find("机型").style.y - boxY)];
      ctx.moveTo(...style.from);
      ctx.lineTo(...style.to);
      ctx.strokeStyle = style.color;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    if (isIcon(item)) {
      if (item.value) {
        // 绘制图标
        const { style } = item;
        let logo = await loadImage(item.value);
        const el = find("分隔线").style;
        style.height = el.to[1] - el.from[1];
        style.width = Math.floor(
          (logo.naturalWidth / logo.naturalHeight) * style.height
        );
        style.x = el.from[0] - style.width - paddingX / 2;
        style.y = find("机型").style.y;
        ctx.drawImage(logo, style.x, style.y, style.width, style.height);
      }
    }
  }
};
