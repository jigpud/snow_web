import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Layout, Input, Button, message, Table, Space, Tag, Pagination } from "antd";
import { useState, useEffect } from "react";
import { deleteAttraction, queryAttraction } from "../../../../api/attraction"
import { CreateAttraction } from "./CreateAttraction";
import { EditAttraction } from "./EditAttraction";
import "./index.less";

// 渲染景点列表的每一行
function renderTableColumns(onEditAttraction, onDeleteAttraction) {
  return [
    {
      title: "名称",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "简介",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "位置",
      key: "location",
      dataIndex: "location",
    },
    {
      title: "标签",
      key: "tags",
      dataIndex: "tags",
      render: tags => (
        <Space
          size="middle"
        >
          {tags.map(tag => (
            <Tag
              color="blue"
              key={tag}
            >
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "操作",
      key: "opration",
      render: attraction => (
        <Space
          size="middle"
        >
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEditAttraction({...attraction})}
          >
            编辑
          </Button>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => onDeleteAttraction({...attraction})}
            danger
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];
}

// 渲染分页
function renderPagination(total, pageSize, currentPage, onShowSizeChange, onChange, visible) {
  if (visible) {
    return (
      <Pagination
        className="attraction-list-pagination"
        total={total}
        pageSize={pageSize}
        current={currentPage}
        showQuickJumper
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        onChange={onChange}
      />
    );
  }
}

function AttractionManagement() {
  // state
  const [refresh, setRefresh] = useState(true);
  const [condition, setCondition] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [attractionList, setAttractionList] = useState([]);
  const [showCreateAttraction, setShowCreateAttraction] = useState(false);
  const [showEditAttraction, setShowEditAttraction] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  const [attractionForEdit, setAttractionForEdit] = useState({});

  useEffect(() => {
    queryAttraction(condition, pageSize, currentPage, (attractions, current, total) => {
      if (attractions.length > 0 || currentPage === 1) {
        setRefresh(false);
        setAttractionList(attractions);
        setCurrentPage(current);
        setTotalPage(total);
        setShowPagination(attractions.length > 0);
      } else {
        setCurrentPage(currentPage - 1);
        setTotalPage(totalPage - 1);
      }
    }, reason => {
      setRefresh(false);
      message.error(reason);
    });
  }, [refresh, condition, currentPage, pageSize, totalPage]);

  // callback
  const onPageSizeChange = (page, newPageSize) => {
    const newTotalPage = Math.round(pageSize * totalPage / newPageSize);
    setTotalPage(newTotalPage);
    setCurrentPage(page);
    setPageSize(newPageSize);
    setRefresh(true);
  };
  const onPageChange = page => {
    setCurrentPage(page);
    setRefresh(true);
  };
  const onRefresh = () => {
    setCurrentPage(1);
    setPageSize(10);
    setCondition("");
    setRefresh(true);
  };
  const onSearchAttraction = name => {
    setCondition(name);
    setRefresh(true);
  };
  const onEditAttraction = attraction => {
    setAttractionForEdit(attraction);
    setShowEditAttraction(true);
  }
  const onDeleteAttraction = attraction => {
    setRefresh(true);
    deleteAttraction(attraction.attractionId, () => {
      setRefresh(false);
      message.success("删除景点成功！")
    }, reason => {
      setRefresh(false);
      message.error(reason);
    })
  }

  return (
    <Layout
      className="attraction-management-root"
    >
      <Input.Group
        compact
      >
        <Input.Search
          className="query-attraction"
          allowClear
          size="large"
          onSearch={onSearchAttraction}
        />
        <Button
          className="create-attraction"
          type="primary"
          size="large"
          onClick={() => setShowCreateAttraction(true)}
        >
          创建
        </Button>
        <Button
          className="create-attraction"
          type="primary"
          size="large"
          onClick={onRefresh}
        >
          刷新
        </Button>
        <CreateAttraction
          visible={showCreateAttraction}
          onSuccess={() => setShowCreateAttraction(false)}
          onCancel={() => setShowCreateAttraction(false)}
        />
      </Input.Group>
      <Table
        className="attraction-list"
        dataSource={attractionList}
        columns={renderTableColumns(onEditAttraction, onDeleteAttraction)}
        bordered
        loading={refresh}
        pagination={false}
        rowKey={attraction => attraction.attractionId}
      />
      <EditAttraction
        visible={showEditAttraction}
        attraction={attractionForEdit}
        onCancel={() => setShowEditAttraction(false)}
        onSuccess={() => setShowEditAttraction(false)}
      />
      {renderPagination(totalPage * pageSize, pageSize, currentPage, onPageSizeChange, onPageChange, showPagination)}
    </Layout>
  );
}

export default AttractionManagement;
