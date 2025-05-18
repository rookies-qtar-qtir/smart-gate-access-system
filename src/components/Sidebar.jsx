// component/Sidebar.jsx

import { useState } from "react";
import Logo from "./Logo";
import { Button, Menu, Layout } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HomeOutlined,
  ControlOutlined,
  HistoryOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const { Sider } = Layout;

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const items = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
      onClick: () => navigate('/')
    },
    {
      key: '/gate-control',
      icon: <ControlOutlined />,
      label: 'Kontrol Palang',
      onClick: () => navigate('/gate-control')
    },
    {
      key: '/access-log',
      icon: <HistoryOutlined />,
      label: 'Log Akses',
      onClick: () => navigate('/access-log')
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Users',
      onClick: () => navigate('/users')
    }
  ];

  const activeMenuItem = items.find((item) => item.key === location.pathname) || {};

  return (
    <Layout.Sider
      collapsed={collapsed}
      trigger={null} // Hide the default trigger
      className="min-h-screen relative"
      width={200}
      collapsedWidth={80}
    >
      {/* Sidebar Content */}
      <div className="flex items-center p-4">
        {!collapsed && <Logo className="mr-2" />}
      </div>

      <div className="p-4 bg-gray-900">
        <h2 className="text-xl font-bold">IoT Dashboard</h2>
      </div>

      {/* Menu */}
      <Menu
        selectedKeys={[activeMenuItem.key]}
        mode="inline"
        theme="dark"
        inlineCollapsed={collapsed}
        items={items}
        className="sidebar-menu border-t border-gray-700 mt-6 space-y-1"
      />

      {/* Collapse Button */}
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={toggleCollapsed}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white"
      />

      <div className="p-4 mt-auto bg-gray-900 text-sm space-y-1">
        <div><span>Broker:</span> <span id="broker-status" className="text-red-400">Disconnected</span></div>
        <div><span>Device:</span> <span id="device-status" className="text-red-400">Disconnected</span></div>
      </div>
    </Layout.Sider>
  );
}

export default Sidebar;
