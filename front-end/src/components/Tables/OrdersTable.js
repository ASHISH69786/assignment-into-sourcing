import React from 'react';
import { Table, Tag, Button, Space, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const OrdersTable = ({ orders = [], loading = false, onViewDetails, onEdit, pagination, onChange }) => {
  const statusColors = {
    PENDING: 'orange',
    CONFIRMED: 'blue',
    IN_TRANSIT: 'cyan',
    DELIVERED: 'green',
    CANCELLED: 'red',
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      sorter: (a, b) => a.orderNumber?.localeCompare(b.orderNumber),
      width: 120,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
      filters: [...new Set(orders.map((order) => order.supplierName))].map((supplier) => ({
        text: supplier,
        value: supplier,
      })),
      onFilter: (value, record) => record.supplierName === value,
    },
    {
      title: 'Buyer',
      dataIndex: 'buyerName',
      key: 'buyerName',
    },
    {
      title: 'Order Value',
      dataIndex: 'totalOrderValue',
      key: 'totalOrderValue',
      render: (value, record) => `${record.currency} ${value?.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
      sorter: (a, b) => a.totalOrderValue - b.totalOrderValue,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
      filters: [
        { text: 'PENDING', value: 'PENDING' },
        { text: 'CONFIRMED', value: 'CONFIRMED' },
        { text: 'IN_TRANSIT', value: 'IN_TRANSIT' },
        { text: 'DELIVERED', value: 'DELIVERED' },
        { text: 'CANCELLED', value: 'CANCELLED' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: 'Ex-Factory Date',
      dataIndex: 'confirmedExFactoryDate',
      key: 'confirmedExFactoryDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Actual Delivery',
      dataIndex: 'actualDeliveryDate',
      key: 'actualDeliveryDate',
      render: (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '-'),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onViewDetails?.(record.id)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit?.(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      loading={loading}
      rowKey="id"
      pagination={pagination || { pageSize: 10, showSizeChanger: true }}
      onChange={onChange}
      scroll={{ x: 1200 }}
    />
  );
};

export default OrdersTable;
