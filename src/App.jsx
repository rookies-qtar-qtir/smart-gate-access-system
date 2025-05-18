import { useState } from 'react'
import './App.css'
import { Outlet, useLocation } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const { Footer, Content } = Layout;

const App = () => {
  const location = useLocation();

  return (
    <Layout className="bg-gray-100 flex w-full">
      <Sidebar />
      <Layout>
        <Header />
        <Content className="overflow-y-auto">
          <Outlet key={location.pathname} />
        </Content>
        <Footer className="bg-white p-4 shadow-inner">
          <div className="text-center text-gray-500 text-sm">
            &copy; 2025 Smart Gate Access System - All Rights Reserved
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
