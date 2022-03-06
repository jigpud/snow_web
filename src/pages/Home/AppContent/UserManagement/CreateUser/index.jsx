import { Modal, Form, Input, message, Row, Col, Button } from "antd";
import { useState, useRef } from "react";
import { CloseOutlined, UserAddOutlined } from "@ant-design/icons/lib/icons";
import { createUser } from "../../../../../api/user";
import "./index.less";

function CreateUser({ visible, onCancel, onSuccess }) {
  // state
  const [create, setCreate] = useState(false);

  // ref
  const formRef = useRef();

  // callback
  const onCreateUser = ({ username, password }) => {
    setCreate(true);
    createUser(username, password, () => {
      setCreate(false);
      message.success("创建成功！");
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
      title="创建用户"
      footer={null}
      closable={false}
    >
      <Form
        onFinish={onCreateUser}
        ref={formRef}
      >
        <Form.Item
          label="手机号"
          name="username"
          rules={[{
            required: true,
            message: "请输入正确的手机号！",
            pattern: /^1[3456789]\d{9}$/,
            max: 11,
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: "密码不能为空！",
            },
            {
              min: 8,
              message: "密码不能低于八位！",
            },
            {
              max: 18,
              message: "密码最长十八位！",
            },
          ]}
        >
          <Input.Password
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
              icon={<UserAddOutlined />}
            >
              创建
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default CreateUser;
