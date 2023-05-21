import { FC } from "react";
import styles from "./index.module.scss";
import templates from "@/templates/index";
import useStore from "@/store";

const Images: FC = () => {
  const name = useStore((state) => state.template)?.name;

  return (
    <div className={styles.wrap}>
      {templates.map((e) => (
        <div
          className={`${styles.imgItem} ${
            name === e.template.name ? styles.active : ""
          }`}
          key={e.template.name}
        >
          <img src={e.demo} alt="pic" />
          <span>{e.template.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Images;
