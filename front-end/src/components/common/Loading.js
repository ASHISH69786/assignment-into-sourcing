import React from 'react';
import { Spin, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

  if (fullScreen) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Space direction="vertical" align="center">
          <Spin indicator={antIcon} size="large" />
          <p>{message}</p>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
      <Space direction="vertical" align="center">
        <Spin indicator={antIcon} size="large" />
        <p>{message}</p>
      </Space>
    </div>
  );
};

export default Loading;
