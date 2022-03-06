import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import "./index.less"

const { Content } = Layout;

function AppContent() {
  return (
    <Content className="app-content">
      <Outlet/>
    </Content>
  );
}

export default AppContent;
