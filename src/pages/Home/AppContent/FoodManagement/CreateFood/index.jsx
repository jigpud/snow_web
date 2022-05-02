import { Modal, Form, Input, message, Row, Col, Button } from "antd";
import { useState, useRef } from "react";
import { CloseOutlined, AppstoreAddOutlined } from "@ant-design/icons/lib/icons";
import { createFood } from "../../../../../api/food";
import "./index.less";

function CreateFood({ visible, onCancel, onSuccess }) {
  // state
  const [create, setCreate] = useState(false);

  // ref
  const formRef = useRef();

  // callback
  const onCreateFood = foodInformation => {
    setCreate(true);
    const name = foodInformation["create-name"];
    const description = foodInformation["create-description"];
    createFood(name, description, () => {
      setCreate(false);
      message.success("创建美食成功！");
      formRef.current.resetFields();
      onSuccess();
    }, reason => {
      setCreate(false);
      message.error(reason);
    });
  };
  const onCancelCreate = () => {
    formRef.current.resetFields();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      title="创建美食"
      footer={null}
      closable={false}
    >
      <Form
        onFinish={onCreateFood}
        ref={formRef}
      >
        <Form.Item
          label="名称"
          name="create-name"
          rules={[{
            required: true,
            message: "请输入美食名称！",
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="简介"
          name="create-description"
          rules={[
            {
              required: true,
              message: "请输入美食简介！",
            },
          ]}
        >
          <Input.TextArea
            rows={5}
          />
        </Form.Item>
        <Row
          justify="space-between"
        >
          <Col
            span={4}
            offset={14}
          >
            <Button
              onClick={onCancelCreate}
              loading={create}
              icon={<CloseOutlined />}
            >
              取消
            </Button>
          </Col>
          <Col
            span={4}
          >
            <Button
              type="primary"
              htmlType="submit"
              loading={create}
              icon={<AppstoreAddOutlined />}
            >
              创建
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default CreateFood;
