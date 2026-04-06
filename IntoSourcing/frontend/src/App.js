import React, { useState, useEffect } from 'react';
import { Layout, Menu, Breadcrumb, Button, message } from 'antd';
import { UploadOutlined, BarChartOutlined, FileOutlined, SettingOutlined } from '@ant-design/icons';
import './App.css';
import Dashboard from './pages/Dashboard';
import DataImport from './pages/DataImport';
import Orders from './pages/Orders';
import ApiService from './services/ApiService';

const { Header, Content, Footer, Sider } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <BarChartOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'orders',
      icon: <FileOutlined />,
      label: 'Purchase Orders',
    },
    {
      key: 'import',
      icon: <UploadOutlined />,
      label: 'Data Import',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <Orders />;
      case 'import':
        return <DataImport />;
      case 'settings':
        return <div><h2>Settings</h2><p>Settings page coming soon</p></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo">
          <h1 style={{ color: 'white', textAlign: 'center', margin: 0, padding: '16px' }}>
            {!collapsed && 'PO System'}
          </h1>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          items={menuItems}
          onClick={(e) => setCurrentPage(e.key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '16px 24px' }}>
            <h2 style={{ margin: 0 }}>Purchase Order Management System</h2>
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'Home' }, { title: currentPage }]} />
          <div style={{ padding: 24, background: '#fff', minHeight: 'calc(100vh - 200px)' }}>
            {renderContent()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', background: '#f0f2f5', marginTop: 'auto' }}>
          Purchase Order System ©2026 | Real-time Data Management and Analytics
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;

