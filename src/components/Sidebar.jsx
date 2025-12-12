import Logo from "./Logo";
import { Menu, Layout, Button } from 'antd';
import { HomeOutlined, ControlOutlined, HistoryOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';
import { useMQTT } from "../services/MqttContext";
import TestPublisher from "../test/PublishJson";
import RFIDTestPublisher from "../test/PublishRfid";
import PublishControl from "../test/PublishControl";

function Sidebar({ collapsed, setCollapsed }) {
  const { isConnected, deviceStatus } = useMQTT();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
      <div className="flex flex-col h-full">

        {/* Header/Logo Section */}
        <div className="h-16 flex items-center justify-center border-b border-gray-700 text-[0.3rem]">
          <Logo collapsed={collapsed} />
        </div>

        {/* Menu Section\ */}
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

        {/* Test Components - Hanya tampil dalam development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="border-t border-gray-700 p-2 space-y-1">
            <TestPublisher />
            <RFIDTestPublisher />
            <PublishControl />
          </div>
        )}
        
        {/* User Profile Section */}
        {user && (
          <div className="border-t border-gray-700 bg-gray-800 p-3">
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
              {/* User Info */}
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">
                    {user.name}
                  </div>
                  <div className="text-gray-400 text-xs truncate">
                    {user.role}
                  </div>
                </div>
              )}
              
              {/* Logout Button */}
              <Button 
                type="text" 
                size="small" 
                onClick={handleLogout}
                className="text-gray-400 hover:text-white hover:bg-gray-700 flex items-center justify-center"
                icon={<span className="text-red-500"><LogoutOutlined /></span>}
                title="Logout"
              />
            </div>
          </div>
        )}

        {/* Status Section */}
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

      </div>
    </Layout.Sider>
  );
}

export default Sidebar;