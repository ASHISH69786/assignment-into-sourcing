import React from 'react';
import { Card, Empty } from 'antd';

const Export = () => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1>Export Data</h1>
      </div>
      <Card>
        <Empty description="Export page (Coming soon)" />
      </Card>
    </div>
  );
};

export default Export;
