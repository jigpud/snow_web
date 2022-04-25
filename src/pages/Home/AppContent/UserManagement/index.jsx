import { Input, Select, Table, Layout, Button, Pagination, message, Avatar, Space, Typography, Tag } from "antd";
import { useEffect, useState } from "react";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons/lib/icons";
import { deleteUser, queryUser } from "../../../../api/user";
import "./index.less";

const { Option } = Select;
const { Search } = Input;

// 渲染用户列表的每一行
function renderTableColumns(onEditUser, onDeleteUser) {
  return [
    {
      title: "用户名",
      key: "username",
      render: user => (
        <Space
          size="middle"
        >
          <Avatar
            src={user.avatar}
            icon={<UserOutlined />}
          />
          <Typography.Text>{user.username}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "年龄",
      key: "age",
      dataIndex: "age",
    },
    {
      title: "性别",
      key: "gender",
      dataIndex: "gender",
      render: gender => {
        let color = "#e5e8e8";
        let genderChar = "未设置";
        if (gender === "female") {
          color = "pink";
          genderChar = "女";
        } else if (gender === "male") {
          color = "blue";
          genderChar = "男";
        }
        return (
          <Tag
            color={color}
          >
            {genderChar}
          </Tag>
        );
      },
    },
    {
      title: "昵称",
      key: "nickname",
      dataIndex: "nickname",
    },
    {
      title: "个性签名",
      key: "signature",
      dataIndex: "signature",
    },
    {
      title: "操作",
      render: user => (
        <Space
          size="middle"
        >
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEditUser({...user})}
          >
            编辑
          </Button>
          <Button
            type="primary"
            icon={<DeleteOutlined />}
            onClick={() => onDeleteUser({...user})}
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
function renderPagination(total, pageSize, current, onShowSizeChange, onChange, visible) {
  if (visible) {
    return (
      <Pagination
        className="user-list-pagination"
        total={total}
        pageSize={pageSize}
        current={current}
        showQuickJumper
        showSizeChanger
        onShowSizeChange={onShowSizeChange}
        onChange={onChange}
      />
    );
  }
}

function UserManagement() {
  // state
  const [userList, setUserList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage]= useState(1);
  const [condition, setCondition] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [queryType, setQueryType] = useState("username");
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  const [userForEdit, setUserForEdit] = useState({});

  useEffect(() => {
    if (refresh) {
      let username = "";
      let nickname = "";
      if (queryType === "username") {
        username = condition;
      } else if (queryType === "nickname") {
        nickname = condition;
      }
      queryUser(username, nickname, pageSize, currentPage, (users, current, total) => {
        if (users.length > 0 || currentPage === 1) {
          setRefresh(false);
          setUserList(users);
          setCurrentPage(current);
          setTotalPage(total);
          setShowPagination(users.length > 0);
        } else {
          setCurrentPage(currentPage - 1);
          setTotalPage(totalPage - 1);
        }
      }, reason => {
        setRefresh(false);
        message.error(reason);
      });
    }
  }, [refresh, condition, queryType, currentPage, pageSize, totalPage]);

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
  const onSearchUser = c => {
    setCondition(c);
    setCurrentPage(1);
    setPageSize(10);
    setRefresh(true);
  };
  const onEditUser = user => {
    setUserForEdit(user);
    setShowEditUser(true);
  };
  const onDeleteUser = user => {
    setRefresh(true);
    deleteUser(user.userid, () => {
      setRefresh(false);
      message.success("删除用户成功！");
    }, reason => {
      setRefresh(false);
      message.error(reason);
    });
  };

  return (
    <Layout
      className="user-management-root"
    >
      <Input.Group
        compact
      >
        <Select
          defaultValue={queryType}
          className="query-type"
          size="large"
          onChange={type => setQueryType(type)}
        >
          <Option value="username">用户名</Option>
          <Option value="nickname">昵称</Option>
        </Select>
        <Search
          allowClear
          className="query-user"
          size="large"
          onSearch={onSearchUser}
        />
        <Button
          size="large"
          className="create-user"
          type="primary"
          onClick={() => setShowCreateUser(true)}
        >
          创建
        </Button>
        <Button
          size="large"
          type="primary"
          onClick={onRefresh}
          className="create-user"
        >
          刷新
        </Button>
        <CreateUser
          visible={showCreateUser}
          onCancel={() => setShowCreateUser(false)}
          onSuccess={() => setShowCreateUser(false)}
        />
      </Input.Group>
      <Table
        className="user-list"
        dataSource={userList}
        columns={renderTableColumns(onEditUser, onDeleteUser)}
        bordered
        loading={refresh}
        pagination={false}
        rowKey={user => user.userid}
      />
      <EditUser
        visible={showEditUser}
        user={userForEdit}
        onCancel={() => setShowEditUser(false)}
        onSuccess={() => setShowEditUser(false)}
      />
      {renderPagination(totalPage * pageSize, pageSize, currentPage, onPageSizeChange, onPageChange, showPagination)}
    </Layout>
  );
}

export default UserManagement;
