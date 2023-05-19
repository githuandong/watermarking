import { FC, useEffect, StrictMode } from "react";
import Images from "@/components/Images";
import Templates from "@/components/Templates";
import Preview from "@/components/Preview";
import Editor from "@/components/Editor";
import styles from "./app.module.scss";
// import useStore from "@/store";
import ReactDOM from "react-dom/client";
import "antd/dist/reset.css";

const App: FC = () => {
  useEffect(() => {
    // window.bridge.getLogos().then((logos) => {
    //   useStore.setState({
    //     logos,
    //   });
    // });
  });

  return (
    <div className={styles.main}>
      <Images />
      <Templates />
      <Preview />
      <Editor />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
