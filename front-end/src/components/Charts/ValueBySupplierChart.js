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

const ValueBySupplierChart = ({ data, loading = false }) => {
  // Ensure data is an array before checking length
  const validData = Array.isArray(data) ? data : [];
  return (
    <Card title="Total Order Value by Supplier" loading={loading} style={{ height: '100%' }}>
      {!loading && validData && validData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={validData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
            />
            <Legend />
            <Bar dataKey="value" fill="#52c41a" />
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

export default ValueBySupplierChart;
