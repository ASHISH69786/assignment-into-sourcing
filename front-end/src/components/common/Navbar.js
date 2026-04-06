import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space } from 'antd';
import { LogoutOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import '../styles/Navbar.css';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    ApiService.logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      role: 'menuitem',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <Header className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">📊 PO Management System</h2>
      </div>
      <div className="navbar-right">
        <Space>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;
