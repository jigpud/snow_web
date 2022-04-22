import { AppstoreAddOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, message, Modal, Row, Col, Button, Space, Tag } from "antd";
import { useState, useRef } from "react";
import { createAttraction } from "../../../../../api/attraction";
import "./index.less";

export function CreateAttraction({ visible, onCancel, onSuccess }) {
  // state
  const [create, setCreate] = useState(false);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState(false);

  // ref
  const formRef = useRef();
  const tagInputRef = useRef();

  // callback
  const reset = () => {
    formRef.current.resetFields();
    setTags([]);
    setNewTag(false);
  }
  const onCreateAttraction = attractionInformation => {
    setCreate(true);
    const name = attractionInformation["create-name"];
    const description = attractionInformation["create-description"];
    const location = attractionInformation["create-location"];
    createAttraction(name, description, location, tags, () => {
      setCreate(false);
      message.success("创建景点成功！");
      reset();
      onSuccess();
    }, reason => {
      setCreate(false);
      message.error(reason);
    });
  }
  const onCancelCreate = () => {
    reset();
    onCancel();
  };
  const onNewTagConfirm = () => {
    const newInputTag = tagInputRef.current.input.value;
    if (newInputTag && tags.indexOf(newInputTag) === -1) {
      tags.push(newInputTag);
      setTags(tags);
    }
    setNewTag(false);
  }
  const onTagClose = closedTag => {
    const newTags = tags.filter(tag => tag !== closedTag);
    setTags(newTags);
  }

  return (
    <Modal
      visible={visible}
      title="创建景点"
      footer={null}
      closable={false}
    >
      <Form
        onFinish={onCreateAttraction}
        ref={formRef}
      >
        <Form.Item
          label="名称"
          name="create-name"
          rules={[{
            required: true,
            message: "请输入景点名称！",
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="简介"
          name="create-description"
          rules={[{
            required: true,
            message: "请输入景点简介！",
          }]}
        >
          <Input.TextArea
            rows={5}
          />
        </Form.Item>
        <Form.Item
          label="位置"
          name="create-location"
          rules={[{
            required: true,
            message: "请输入景点位置！",
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="标签"
          name="create-tags"
        >
          <Space
            wrap
          >
            {tags.map(tag => (
              <Tag
                color="blue"
                closable
                onClose={() => onTagClose(tag)}
                key={tag}
              >
                {tag}
              </Tag>
            ))}
            {newTag && (
              <Input
                size="small"
                ref={tagInputRef}
                onPressEnter={onNewTagConfirm}
                onBlur={onNewTagConfirm}
                key="new-tag-input"
              />
            )}
            {!newTag && (
              <Tag
                color="blue"
                onClick={() => setNewTag(true)}
                key="new-tag"
              >
                <PlusOutlined /> 添加标签
              </Tag>
            )}
          </Space>
        </Form.Item>
        <Row
          className="footer"
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
