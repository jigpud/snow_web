import { Layout, Menu, Avatar } from "antd";
import { NavLink } from "react-router-dom";
import { UserOutlined, AppstoreOutlined, CameraOutlined } from "@ant-design/icons/lib/icons";
import { userContext } from "../../../components/UserProvider";
import { useContext, useState } from "react";
import "./index.less";

const { Sider } = Layout;

function SiderMenu() {
  // state
  const [collapsed, setCollapsed] = useState(false);

  // context
  const { setIsLogin } = useContext(userContext);

  // callback
  const onCollapse = () => {
    setCollapsed(!collapsed);
  }
  const onLogout = () => {
    localStorage.setItem("token", "");
    setIsLogin(false);
  };
  const onMenuItemSelet = ({key}) => {
    if (key === "logout") {
      onLogout();
    }
  }

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
      <div className="logo"/>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["user_management_users"]}
        defaultOpenKeys={["user_management"]}
        onSelect={onMenuItemSelet}>
        <Menu.SubMenu key="user_management" title="用户管理" icon={<UserOutlined/>}>
          <Menu.Item key="user_management_users" icon={<AppstoreOutlined/>}>
            <NavLink to="/user">用户列表</NavLink>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="attraction_management" title="景点管理" icon={<CameraOutlined/>}>
          <Menu.Item key="attraction_management_users" icon={<AppstoreOutlined/>}>
            <NavLink to="/attraction">景点列表</NavLink>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="logout" icon={<Avatar className="avatar"/>}>
          退出登陆
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default SiderMenu;
