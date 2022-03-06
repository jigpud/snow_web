import React from 'react';
import ReactDOM from 'react-dom';
import SnowApp from './SnowApp';
import { BrowserRouter } from "react-router-dom";
import UserProvider from "./components/UserProvider";
import { ConfigProvider } from 'antd';
import zhCN from "antd/lib/locale/zh_CN";

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <UserProvider>
          <SnowApp/>
        </UserProvider>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
