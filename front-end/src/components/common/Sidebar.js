import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  UploadOutlined,
  SettingOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const { Sider } = Layout;

const Sidebar = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/'),
    },
    {
      key: '/orders',
      icon: <FileTextOutlined />,
      label: 'Purchase Orders',
      onClick: () => navigate('/orders'),
    },
    {
      key: '/import',
      icon: <UploadOutlined />,
      label: 'Data Import',
      onClick: () => navigate('/import'),
    },
    {
      key: '/export',
      icon: <DownloadOutlined />,
      label: 'Export Data',
      onClick: () => navigate('/export'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => navigate('/settings'),
    },
  ];

  const selectedKey = location.pathname === '/' ? '/' : location.pathname;

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={256}
      className="sidebar"
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;
