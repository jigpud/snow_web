import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Layout, Input, Button, message, Table, Space, Pagination } from "antd";
import { useState, useEffect } from "react";
import { deleteFood, queryFood } from "../../../../api/food"
import CreateFood from "./CreateFood";
import EditFood from "./EditFood";
import "./index.less";

// 渲染美食列表的每一行
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
      title: "操作",
      key: "opration",
      render: food => (
        <Space
          size="middle"
        >
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEditAttraction({...food})}
          >
            编辑
          </Button>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => onDeleteAttraction({...food})}
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
        className="food-list-pagination"
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

function FoodManagement() {
  // state
  const [refresh, setRefresh] = useState(true);
  const [condition, setCondition] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [foodList, setFoodList] = useState([]);
  const [showCreateFood, setShowCreateFood] = useState(false);
  const [showEditFood, setShowEditFood] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  const [foodForEdit, setFoodForEdit] = useState({});

  useEffect(() => {
    queryFood(condition, pageSize, currentPage, (foods, current, total) => {
      if (foods.length > 0 || currentPage === 1) {
        setRefresh(false);
        setFoodList(foods);
        setCurrentPage(current);
        setTotalPage(total);
        setShowPagination(foods.length > 0);
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
  const onSearchFood = name => {
    setCondition(name);
    setRefresh(true);
  };
  const onEditFood = food => {
    setFoodForEdit(food);
    setShowEditFood(true);
  }
  const onDeleteFood = food => {
    setRefresh(true);
    deleteFood(food.foodId, () => {
      setRefresh(false);
      message.success("删除美食成功！")
    }, reason => {
      setRefresh(false);
      message.error(reason);
    })
  }

  return (
    <Layout
      className="food-management-root"
    >
      <Input.Group
        compact
      >
        <Input.Search
          className="query-food"
          allowClear
          size="large"
          onSearch={onSearchFood}
        />
        <Button
          className="create-food"
          type="primary"
          size="large"
          onClick={() => setShowCreateFood(true)}
        >
          创建
        </Button>
        <Button
          className="create-food"
          type="primary"
          size="large"
          onClick={onRefresh}
        >
          刷新
        </Button>
        <CreateFood
          visible={showCreateFood}
          onSuccess={() => setShowCreateFood(false)}
          onCancel={() => setShowCreateFood(false)}
        />
      </Input.Group>
      <Table
        className="food-list"
        dataSource={foodList}
        columns={renderTableColumns(onEditFood, onDeleteFood)}
        bordered
        loading={refresh}
        pagination={false}
        rowKey={food => food.foodId}
      />
      <EditFood
        visible={showEditFood}
        food={foodForEdit}
        onCancel={() => setShowEditFood(false)}
        onSuccess={() => setShowEditFood(false)}
      />
      {renderPagination(totalPage * pageSize, pageSize, currentPage, onPageSizeChange, onPageChange, showPagination)}
    </Layout>
  );
}

export default FoodManagement;
