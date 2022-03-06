import { Layout } from "antd";
import SiderMenu from "./SiderMenu";
import AppContent from "./AppContent";
import "./index.less";

function Home() {
  return (
    <Layout className="home">
      <SiderMenu />
      <AppContent />
    </Layout>
  );
}

export default Home;
