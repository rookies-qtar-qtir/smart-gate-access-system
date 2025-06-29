// component/Sidebar.jsx

import Logo from "./Logo";
import { Menu, Layout } from 'antd';
import { HomeOutlined, ControlOutlined, HistoryOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import TestPublisher from "../test/PublishJson";
import { useMQTT } from "../services/MqttContext";
import RFIDTestPublisher from "../test/PublishRfid";
import PublishControl from "../test/PublishControl";

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
      className="min-h-screen"
      width={200}
      collapsedWidth={80}
      style={{
        background: '#001529'
      }}
    >
      {/* Container untuk mengatur layout vertikal */}
      <div className="flex flex-col h-full ">

        {/* Header/Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-gray-700 text-[0.3rem]">
          <Logo collapsed={collapsed} />
        </div>



        {/* Menu Section - Flex grow untuk mengambil space yang tersisa */}
        <div className="flex-1 overflow-y-auto">
          <Menu
            selectedKeys={[activeMenuItem.key]}
            mode="inline"
            theme="dark"
            inlineCollapsed={collapsed}
            items={items}
            className="h-full border-none"
            style={{
              background: 'transparent',
              borderRight: 'none'
            }}
          />
        </div>

        {/* Status Section - Fixed di bottom */}
        <div className="border-t border-gray-700 bg-gray-800">
          <div className={`p-3 text-xs space-y-2 ${collapsed ? 'text-center' : ''}`}>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Broker:</span>
              <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
                {collapsed ? (isConnected ? '●' : '●') : (isConnected ? 'Connected' : 'Disconnected')}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Device:</span>
              <span className={deviceStatus.online ? 'text-green-400' : 'text-red-400'}>
                {collapsed ? (deviceStatus.online ? '●' : '●') : (deviceStatus.online ? 'Connected' : 'Disconnected')}
              </span>
            </div>
          </div>
        </div>

        {/* Test Components - Hanya tampil dalam development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="border-t border-gray-700 p-2 space-y-1">
            <TestPublisher />
            <RFIDTestPublisher />
            <PublishControl />
          </div>
        )}
      </div>
    </Layout.Sider>
  );
}

export default Sidebar;