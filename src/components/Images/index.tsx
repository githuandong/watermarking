import { FC, useState } from "react";
import styles from "./index.module.scss";
import useStore from "@/store/index";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import _ from "lodash";
import { initPreview } from "@/templates/utils";

dayjs.extend(utc);

const Images: FC = () => {
  const [imgs, setImgs] = useState<
    {
      dataURL: string;
      path: string;
    }[]
  >([]);
  const imgPath = useStore((state) => state.imgPath);

  const setActiveImg = (item: (typeof imgs)[0]) => {
    initPreview(item.path);
  };

  const handleImport = () => {
    window.bridge.importFile().then((files) => {
      if (files.length > 0) {
        let list = [
          ...imgs,
          ...files
            .filter((e) => !imgs.find((p) => p.path === e.path))
            .map((e) => ({
              dataURL: e.dataURL,
              path: e.path,
            })),
        ];
        setImgs(list);
        if (!imgPath) {
          setActiveImg(list[0]);
        }
      }
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.btns}>
        <div onClick={handleImport}>导入图片</div>
        {/* <div>一键导出</div> */}
      </div>
      {imgs.map((item) => (
        <div
          key={item.path}
          onClick={() => imgPath !== item.path && setActiveImg(item)}
          className={`${styles.imgWrap} ${
            imgPath === item.path ? styles.active : ""
          }`}
        >
          <img draggable={false} src={item.dataURL} alt="pic" />
        </div>
      ))}
    </div>
  );
};

export default Images;
