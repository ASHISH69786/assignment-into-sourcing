import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card } from 'antd';

const DeliveryPerformanceChart = ({ data, loading = false }) => {
  const COLORS = ['#52c41a', '#ff4d4f', '#bfbfbf'];

  return (
    <Card title="Delivery Performance" loading={loading} style={{ height: '100%' }}>
      {!loading && data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" />
            <Tooltip />
            <Legend />
            {data[0] && Object.keys(data[0]).map((key, index) => {
              if (key !== 'name') {
                return <Bar key={key} dataKey={key} fill={COLORS[index] || '#1890ff'} />;
              }
              return null;
            })}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>No data available</p>
        </div>
      )}
    </Card>
  );
};

export default DeliveryPerformanceChart;
