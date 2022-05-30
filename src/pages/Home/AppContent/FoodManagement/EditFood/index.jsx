import { CloseOutlined, SaveOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Modal, Row, Col, Button, message, Input, Upload } from "antd";
import { useState, useRef, useEffect } from "react";
import { updateFood } from "../../../../../api/food";
import { getFoodImgUploadToken, uploadImg } from "../../../../../api/qiniu";
import "./index.less";

function EditFood({ visible, onCancel, onSuccess, food }) {
  // state
  const [foodForEdit, setFoodForEdit] = useState({});
  const [update, setUpdate] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setFoodForEdit(food);
    if (food.pictures) {
      setFileList(food.pictures.map(picture => ({
        url: picture,
        status: "done",
        uid: picture
      })));
    }
  }, [food]);

  // ref
  const formRef = useRef();

  // callback
  const reset = () => {
    formRef.current.resetFields();
  }
  const onUpdate = foodInformation => {
    const modifiedFood = {};
    modifiedFood.foodId = foodForEdit.foodId;
    modifiedFood.name = foodInformation["edit-name"];
    modifiedFood.description = foodInformation["edit-description"];
    modifiedFood.pictures = fileList.map(file => file.url);
    setUpdate(true);
    updateFood(modifiedFood, () => {
      setUpdate(false);
      message.success("更新美食信息成功！");
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
  const onPictureListChange = ({ fileList }) => {
    setFileList(fileList);
  }
  const onUploadPicture = ({ file, onProgress, onError, onSuccess }) => {
    getFoodImgUploadToken(({ uploadToken, key }) => {
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
      title="更新美食信息"
      footer={null}
      closable={false}
      visible={visible}
      centered
      key={JSON.stringify(foodForEdit)}
    >
      <Form
        onFinish={onUpdate}
        ref={formRef}
      >
        <Form.Item
          label="名称"
          name="edit-name"
          initialValue={foodForEdit.name}
          rules={[{
            required: true,
            message: "请输入美食名称！",
          }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="简介"
          name="edit-description"
          initialValue={foodForEdit.description}
          rules={[{
            required: true,
            message: "请输入美食简介！",
          }]}
        >
          <Input.TextArea
            rows={5}
          />
        </Form.Item>
        <Form.Item
          label="美食照片"
          name="edit-pictures"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            accept="img"
            customRequest={onUploadPicture}
            onChange={onPictureListChange}
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

export default EditFood;
