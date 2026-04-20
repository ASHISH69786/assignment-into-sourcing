import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from 'antd';

const StatusDistributionChart = ({ data, loading = false }) => {
  const COLORS = {
    PENDING: '#faad14',
    CONFIRMED: '#1890ff',
    IN_TRANSIT: '#13c2c2',
    DELIVERED: '#52c41a',
    CANCELLED: '#ff4d4f',
  };

  // Ensure data is an array before mapping
  const validData = Array.isArray(data) ? data : [];
  const chartData = validData.map((item) => ({
    ...item,
    fill: COLORS[item.name] || '#1890ff',
  }));

  return (
    <Card title="Order Status Distribution" loading={loading} style={{ height: '100%' }}>
      {!loading && validData && validData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} orders`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>No data available</p>
        </div>
      )}
    </Card>
  );
};

export default StatusDistributionChart;
