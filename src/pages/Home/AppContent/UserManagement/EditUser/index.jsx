import { Modal, Form, Button, Row, Col, message, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons/lib/icons";
import { updateUser } from "../../../../../api/user";
import "./index.less"

function EditUser({ visible, onCancel, onSuccess, user }) {
  // state
  const [userForEdit, setUserForEdit] = useState(user);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    setUserForEdit(user);
  }, [user]);

  // ref
  const formRef = useRef();

  // callback
  const onUpdate = userInfomation => {
    const modifiedUserInfomation = { ...userForEdit };
    modifiedUserInfomation.password = userInfomation["edit-password"];
    modifiedUserInfomation.age = userInfomation["edit-age"];
    modifiedUserInfomation.gender = userInfomation["edit-gender"];
    modifiedUserInfomation.nickname = userInfomation["edit-nickname"];
    modifiedUserInfomation.signature = userInfomation["edit-signature"];
    modifiedUserInfomation.likes = userInfomation["edit-likes"];
    console.log(modifiedUserInfomation);
    setUpdate(true);
    updateUser(modifiedUserInfomation, () => {
      setUpdate(false);
      message.success("更新成功！");
      formRef.current.resetFields();
      onSuccess();
    }, reason => {
      setUpdate(false);
      message.error(reason);
    });
  };
  const onCancelEdit = () => {
    formRef.current.resetFields();
    onCancel();
  }

  return (
    <Modal
      title="更新用户信息"
      footer={null}
      closable={false}
      visible={visible}
      centered
      destroyOnClose
      key={userForEdit.username}
    >
      <Form
        onFinish={onUpdate}
        ref={formRef}
      >
        <Form.Item
          label="用户名"
          name="edit-username"
          initialValue={userForEdit.username}
        >
          <Input
            disabled
          />
        </Form.Item>
        <Form.Item
          label="密码"
          name="edit-password"
          initialValue=""
        >
          <Input.Password
            placeholder="设置以更新密码"
          />
        </Form.Item>
        <Form.Item
          label="年龄"
          name="edit-age"
          initialValue={userForEdit.age}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="性别"
          name="edit-gender"
          initialValue={userForEdit.gender}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="昵称"
          name="edit-nickname"
          initialValue={userForEdit.nickname}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="个性签名"
          name="edit-signature"
          initialValue={userForEdit.signature}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="获赞"
          name="edit-likes"
          initialValue={userForEdit.likes}
        >
          <Input />
        </Form.Item>
        <Row
          justify="space-between"
        >
          <Col
            span={4}
            offset={14}
          >
            <Button
              onClick={onCancelEdit}
              loading={update}
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
              loading={update}
              icon={<SaveOutlined />}
            >
              保存
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default EditUser;
