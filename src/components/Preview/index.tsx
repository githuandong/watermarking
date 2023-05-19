import { FC, useState, useEffect, useRef } from "react";
import styles from "./index.module.scss";
import useStroe from "@/store";
import _ from "lodash";

let oldImgPath = "";
let oldTplName = "";

const Preview: FC = () => {
  const cvsRef = useRef<HTMLCanvasElement | null>(null);
  const [cvsRect, setCvsRect] = useState({
    width: 0,
    height: 0,
  });
  const aspectRatioRef = useRef(0);
  const [imgPath, template, draw] = useStroe((state) => [
    state.imgPath,
    state.template,
    state.draw!,
  ]);

  /** 拖动处理 **/
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 不是左键点击不处理
    if (e.button !== 0) return;
    let down = {
      x: e.clientX,
      y: e.clientY,
    };
    // 鼠标拖动
    const onMouseMove = (e: MouseEvent) => {
      setOffset({
        x: offset.x + e.clientX - down.x,
        y: offset.y + e.clientY - down.y,
      });
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener(
      "mouseup",
      () => {
        document.removeEventListener("mousemove", onMouseMove);
      },
      { once: true }
    );
  };

  /** 滚轮缩放 **/
  const wheelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const wheelEL = wheelRef.current!;
    let origin: number[] | null = null;
    const handleWheel = (ev: WheelEvent) => {
      if (!imgPath && cvsRect.width > 0) return;
      ev.preventDefault();
      if (!origin) {
        // 第一次触发，计算原点
        const rect = cvsRef.current!.getBoundingClientRect();
        origin = [
          _.round((ev.clientX - rect.left) / rect.width, 4),
          _.round((ev.clientY - rect.top) / rect.height, 4),
        ];
        // 移动鼠标后移除原点
        document.addEventListener("mousemove", () => (origin = null), {
          once: true,
        });
      }
      let w = Math.floor(cvsRect.width * (1 + (ev.deltaY < 0 ? 0.05 : -0.05)));
      w = w <= 100 ? 100 : w;
      const h = Math.floor(w / aspectRatioRef.current);
      setCvsRect({
        width: w,
        height: h,
      });
      setOffset(() => ({
        x: Math.floor(ev.clientX - origin![0] * w),
        y: Math.floor(ev.clientY - origin![1] * h),
      }));
    };
    wheelEL.addEventListener("wheel", handleWheel, {
      passive: false,
    });
    return () => wheelEL.removeEventListener("wheel", handleWheel);
  }, [cvsRect, origin]);

  useEffect(() => {
    if (imgPath) {
      const isUpdate = oldImgPath === imgPath && oldTplName === template.name;
      !isUpdate && setCvsRect({ width: 0, height: 0 });
      const cvs = cvsRef.current!;
      const ctx = cvs.getContext("2d");

      draw(`file://${imgPath}`, ctx, _.cloneDeep(template), {
        sizeInit: ({ width, height }: any) => {
          // 设置画布宽高
          cvs.width = width;
          cvs.height = height;
          // 记录画布的宽高比，用于缩放
          aspectRatioRef.current = width / height;
          // 设置画布CSS宽高
          if (isUpdate) {
            setCvsRect(({ width }) => ({
              width,
              height: Math.floor(width / aspectRatioRef.current),
            }));
          } else {
            setCvsRect({
              width: window.innerWidth - 210 - 310,
              height: Math.floor(
                (window.innerWidth - 210 - 310) / aspectRatioRef.current
              ),
            });
          }
          !isUpdate && setOffset({ x: 210, y: 40 });
          oldImgPath = imgPath;
          oldTplName = template.name;
        },
        loadImage: (path: string) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
              resolve(img);
            };
          }),
      });
    }
  }, [imgPath, template]);

  return (
    <div ref={wheelRef} className={styles.wrap}>
      <canvas
        style={{
          ...cvsRect,
          left: offset.x,
          top: offset.y,
        }}
        onMouseDown={onMouseDown}
        ref={cvsRef}
      ></canvas>
    </div>
  );
};

export default Preview;
