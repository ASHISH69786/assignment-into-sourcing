import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Spin, message, Select, DatePicker } from 'antd';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ApiService from '../services/ApiService';
import dayjs from 'dayjs';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getDashboardMetrics();
      setMetrics(response.data);
    } catch (error) {
      message.error('Failed to load dashboard metrics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  if (loading) {
    return <Spin size="large" />;
  }

  if (!metrics) {
    return <div>No data available</div>;
  }

  const ordersBySupplierData = Object.entries(metrics.ordersBySupplier || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const valueBySupplierData = Object.entries(metrics.valueBySupplier || {}).map(([name, value]) => ({
    name,
    value: parseFloat(value),
  }));

  const statusData = Object.entries(metrics.statusBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const deliveryData = [
    { name: 'On Time', value: metrics.deliveryAnalysis?.onTime || 0 },
    { name: 'Late', value: metrics.deliveryAnalysis?.late || 0 },
    { name: 'Pending', value: metrics.deliveryAnalysis?.pending || 0 },
  ];

  const recentOrdersColumns = [
    { title: 'Order Number', dataIndex: 'orderNumber', key: 'orderNumber' },
    { title: 'Supplier', dataIndex: 'supplierName', key: 'supplierName' },
    { title: 'Value', dataIndex: 'totalValue', key: 'totalValue', render: (value) => `$${parseFloat(value).toFixed(2)}` },
    { title: 'Status', dataIndex: 'status', key: 'status' },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Orders" value={metrics.totalOrders} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Value"
              value={parseFloat(metrics.totalValue || 0).toFixed(2)}
              prefix="$"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="Total Quantity" value={metrics.totalQuantity} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="On-Time Delivery"
              value={metrics.deliveryAnalysis?.onTimePercentage || 0}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Orders by Supplier" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={ordersBySupplierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Total Value by Supplier" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={valueBySupplierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <Card title="Order Status Distribution" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Delivery Performance" style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Card title="Recent Orders">
        <Table columns={recentOrdersColumns} dataSource={metrics.recentOrders} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  );
};

export default Dashboard;

