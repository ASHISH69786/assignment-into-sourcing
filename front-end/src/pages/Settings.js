import React from 'react';
import { Card, Empty } from 'antd';

const Settings = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1>Settings</h1>
      </div>
      <Card>
        <Empty description="Settings page (Coming soon)" />
      </Card>
    </div>
  );
};

export default Settings;
