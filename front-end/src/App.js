import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import DataImport from './pages/DataImport';
import Export from './pages/Export';
import Settings from './pages/Settings';
import './App.css';

const { Content } = Layout;

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ height: '100vh' }}>
        <Navbar />
        <Layout style={{ height: 'calc(100vh - 64px)' }}>
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapse={setSidebarCollapsed}
          />
          <Layout>
            <Content style={{ overflow: 'auto', backgroundColor: '#f5f5f5' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Navigate to="/" />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/import" element={<DataImport />} />
                <Route path="/export" element={<Export />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;
