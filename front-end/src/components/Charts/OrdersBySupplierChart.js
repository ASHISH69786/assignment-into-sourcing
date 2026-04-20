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
import { Card, Spin } from 'antd';

const OrdersBySupplierChart = ({ data, loading = false }) => {
  // Ensure data is an array before checking length
  const validData = Array.isArray(data) ? data : [];
  return (
    <Card title="Orders by Supplier" loading={loading} style={{ height: '100%' }}>
      {!loading && validData && validData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={validData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#1890ff" />
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

export default OrdersBySupplierChart;
