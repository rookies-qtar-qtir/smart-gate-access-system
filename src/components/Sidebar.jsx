// component/Sidebar.jsx

import Logo from "./Logo";
import { Menu, Layout } from 'antd';
import { HomeOutlined, ControlOutlined, HistoryOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import TestPublisher from "../test/PublishJson";
import { useMQTT } from "../services/MqttContext";
import RFIDTestPublisher from "../test/PublishRfid";


function Sidebar({ collapsed, setCollapsed }) {
  const { isConnected, deviceStatus } = useMQTT();

  const navigate = useNavigate();
  const location = useLocation();

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
      trigger={null}
      className="min-h-screen max-h-screen relative"
      width={200}
      collapsedWidth={80}
    >
      {/* Sidebar Content */}
      <div className="items-center p-4">
        {!collapsed && <Logo className="mr-2" />}
        {collapsed && <div className="h-10 w10 py-10"></div>}
      </div>

      {/* Menu */}
      <div className="">
        <Menu
          selectedKeys={[activeMenuItem.key]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
          items={items}
          className="sidebar-menu border-t border-gray-700 mt-6 space-y-1 bg-white"
        />
      </div>

      <div className={`py-4 bg-gray-900 text-sm space-y-1 ${collapsed ? 'text-xs' : 'text-sm'}`}>
        <div><span>Broker:</span> <span className={isConnected ? 'text-green-400' : 'text-red-400'}>{isConnected ? 'Connected' : 'Disconnected'}</span></div>
        <div><span>Device:</span> <span className={deviceStatus.online == true ? 'text-green-400' : 'text-red-400'}>{deviceStatus.online == true ? 'Connected' : 'Disconnected'}</span></div>
      </div>

      <TestPublisher />
      <RFIDTestPublisher />
    </Layout.Sider>
  );
}

export default Sidebar;
