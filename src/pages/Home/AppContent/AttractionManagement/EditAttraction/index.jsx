import { CloseOutlined, SaveOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Modal, Row, Col, Button, message, Input, Space, Tag, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { useState, useRef, useEffect } from "react";
import { updateAttraction } from "../../../../../api/attraction";
import { getAttractionImgUploadToken, uploadImg } from "../../../../../api/qiniu";
import "./index.less";

export function EditAttraction({ visible, onCancel, onSuccess, attraction }) {
  // state
  const [attractionForEdit, setAttractionForEdit] = useState({});
  const [update, setUpdate] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState(false);

  useEffect(() => {
    setAttractionForEdit(attraction);
    if (attraction.photos) {
      setFileList(attraction.photos.map(photo => ({
        url: photo,
        status: "done",
        uid: photo
      })));
    }
    if (attraction.tags) {
      setTags([...attraction.tags]);
    }
  }, [attraction]);

  // ref
  const formRef = useRef();
  const tagInputRef = useRef();

  // callback
  const reset = () => {
    formRef.current.resetFields();
  }
  const onUpdate = attractionInformation => {
    const modifiedAttraction = {};
    modifiedAttraction.attractionId = attractionForEdit.attractionId;
    modifiedAttraction.name = attractionInformation["edit-name"];
    modifiedAttraction.description = attractionInformation["edit-description"];
    modifiedAttraction.location = attractionInformation["edit-location"];
    modifiedAttraction.tags = tags;
    modifiedAttraction.photos = fileList.map(file => file.url);
    setUpdate(true);
    updateAttraction(modifiedAttraction, () => {
      setUpdate(false);
      message.success("更新景点信息成功！");
      reset();
      onSuccess();
    }, reason => {
      setUpdate(false);
      message.error(reason);
    });
  }
  const onCancelEdit = () => {
    reset();
    onCancel();
  }
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
  const onPhotoListChange = ({ fileList }) => {
    setFileList(fileList);
  }
  const onUploadPhoto = ({ file, onProgress, onError, onSuccess }) => {
    getAttractionImgUploadToken(({ uploadToken, key }) => {
      uploadImg(file, key, uploadToken, url => {
        file["url"] = url;
        onSuccess(file);
        message.success("图片已上传！");
      }, reason => {
        onError();
        message.error(reason);
      }, percent => {
        onProgress(percent);
      });
    }, reason => {
      onError();
      message.error(reason);
    });
  }

  return (
    <Modal
      title="更新景点信息"
      footer={null}
      closable={false}
      visible={visible}
      centered
      key={attractionForEdit.attractionId}
    >
      <Form
        onFinish={onUpdate}
        ref={formRef}
      >
        <Form.Item
          label="名称"
          name="edit-name"
          initialValue={attractionForEdit.name}
          rules={[{
            required: true,
            message: "请输入景点名称！",
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="简介"
          name="edit-description"
          initialValue={attractionForEdit.description}
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
          name="edit-location"
          initialValue={attractionForEdit.location}
          rules={[{
            required: true,
            message: "请输入景点位置！",
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="标签"
          name="edit-tags"
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
        <Form.Item
          label="景点照片"
          name="edit-photos"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            accept="img"
            customRequest={onUploadPhoto}
            onChange={onPhotoListChange}
          >
            <PlusOutlined/> 上传
          </Upload>
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
