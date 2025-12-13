import { useState } from 'react';
import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import CustomHeader from './components/Header';

const { Footer, Content } = Layout;

const App = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <Layout className="bg-gray-100 flex w-full h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout>
        <CustomHeader collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content className="overflow-y-auto">
          <Outlet key={location.pathname} />
        </Content>
        {/* <Footer className="bg-white p-4 shadow-inner">
          <div className="text-center text-gray-500 text-sm">
            &copy; 2025 Smart Gate Access System - All Rights Reserved
          </div>
        </Footer> */}
      </Layout>
    </Layout>
  );
};

export default App;
