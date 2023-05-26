import { FC, useEffect } from "react";
import styles from "./index.module.scss";
import useStore from "@/store";
import { Form, Input, Slider, message } from "antd";
import _ from "lodash";
import { logos } from "@/templates/logos";

const SelectLogo: FC<{
  onChange?: (v: any) => void;
  value?: any;
}> = ({ value, onChange }) => {
  return (
    <div className={styles.logos}>
      {Object.entries(logos).map(([_, path]) => (
        <div
          key={path}
          className={`${styles.logoItem} ${
            value === path ? styles.active : ""
          }`}
          onClick={() => {
            path !== value && onChange && onChange(path);
          }}
        >
          <img src={path} alt="icon" />
        </div>
      ))}
    </div>
  );
};

const FormInput: FC<{ item: any; index: number }> = ({ item, index }) => {
  if (item.type === "text") {
    return (
      <Form.Item label={item.name} name={["box", "items", index, "value"]}>
        <Input />
      </Form.Item>
    );
  }
  if (item.type === "icon") {
    return (
      <Form.Item label={item.name} name={["box", "items", index, "value"]}>
        <SelectLogo />
      </Form.Item>
    );
  }
  return null;
};

const Images: FC = () => {
  const { selectedImg, template } = useStore((state) => state);
  const [form] = Form.useForm();

  const handleExport = () => {
    window.bridge
      .export(template, [
        {
          path: selectedImg.path,
          tags: selectedImg.tags,
        },
      ])
      .then(() => {
        message.success("导出成功！");
      });
  };

  useEffect(() => {
    form.setFieldsValue(_.cloneDeep(template));
  }, [template]);

  return (
    <div className={styles.wrap}>
      <Form
        form={form}
        className={styles.form}
        layout="vertical"
        onValuesChange={_.debounce(() => {
          useStore.setState({
            template: form.getFieldsValue(true),
          });
        }, 300)}
      >
        {selectedImg && (
          <>
            <div onClick={handleExport} className={styles.btnWrap}>
              导出图片
            </div>
            <div style={{ padding: 18 }}>
              <Form.Item label="边框宽度" name="border">
                <Slider min={0} step={0.01} max={0.5} />
              </Form.Item>
              {template.box.items.map((e: any, index: number) => (
                <FormInput key={e.name} index={index} item={e} />
              ))}
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default Images;
