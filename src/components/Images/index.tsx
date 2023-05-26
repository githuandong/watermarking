import { FC } from "react";
import styles from "./index.module.scss";
import useStore from "@/store/index";
import _ from "lodash";
import { ImgItem } from "@/store";
import templates from "@/templates";
import { message } from "antd";
import Icon from "@/components/Icon";

const Images: FC = () => {
  const { imgList, selectedImg, template } = useStore((state) => state);

  const setActiveImg = (item: ImgItem | null) => {
    useStore.setState({
      selectedImg: item || null,
      template: item ? templates[0].write(item.tags) : null,
    });
  };

  const handleImport = () => {
    window.bridge.importFile().then((files) => {
      if (files.length > 0) {
        let list = [
          ...imgList,
          ...files.filter((e) => !imgList.find((p) => p.path === e.path)),
        ];
        useStore.setState({
          imgList: list,
        });
        if (!selectedImg) {
          setActiveImg(list[0]);
        }
      }
    });
  };

  const handleExport = () => {
    if (imgList.length === 0) {
      message.warning("请先导入图片");
      return;
    }
    window.bridge
      .export(
        template,
        imgList.map((e) => ({
          path: e.path,
          tags: e.tags,
        }))
      )
      .then(() => {
        message.success("导出成功！");
      });
  };
  const handleRemove = (index: number) => {
    const newList = [...imgList];
    newList.splice(index, 1);
    if (newList.length > 0) {
      setActiveImg(newList[0]);
    } else {
      setActiveImg(null);
    }
    useStore.setState({
      imgList: newList,
    });
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.btns}>
        <div onClick={handleImport}>导入图片</div>
        <div onClick={handleExport}>一键导出</div>
      </div>
      {imgList.map((item, index) => (
        <div
          key={item.path}
          className={`${styles.imgWrap} ${
            selectedImg.path === item.path ? styles.active : ""
          }`}
        >
          <img draggable={false} src={item.dataURL} alt="pic" />
          <div className={styles.icons}>
            <Icon onClick={() => handleRemove(index)} type="icon-shanchu" />
            <Icon
              onClick={() =>
                selectedImg.path !== item.path && setActiveImg(item)
              }
              type="icon-eye-fill"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Images;
