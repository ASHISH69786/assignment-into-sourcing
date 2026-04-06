import React from 'react';
import { Table, Tag, Space, Button, Tooltip } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const ImportHistoryTable = ({ imports = [], loading = false, onViewDetails, pagination, onChange }) => {
  const statusColors = {
    PENDING: 'processing',
    COMPLETED: 'success',
    FAILED: 'error',
    PARTIAL: 'warning',
  };

  const columns = [
    {
      title: 'Import ID',
      dataIndex: 'importId',
      key: 'importId',
      sorter: (a, b) => a.importId - b.importId,
    },
    {
      title: 'Source File',
      dataIndex: 'sourceFile',
      key: 'sourceFile',
    },
    {
      title: 'Total Records',
      dataIndex: 'totalRecords',
      key: 'totalRecords',
      render: (value) => value || 0,
      sorter: (a, b) => a.totalRecords - b.totalRecords,
    },
    {
      title: 'Successful',
      dataIndex: 'successfulRecords',
      key: 'successfulRecords',
      render: (value) => <Tag color="green">{value || 0}</Tag>,
      sorter: (a, b) => a.successfulRecords - b.successfulRecords,
    },
    {
      title: 'Failed',
      dataIndex: 'failedRecords',
      key: 'failedRecords',
      render: (value) => (value > 0 ? <Tag color="red">{value}</Tag> : <Tag color="green">0</Tag>),
      sorter: (a, b) => a.failedRecords - b.failedRecords,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status] || 'default'}>{status}</Tag>,
      filters: [
        { text: 'PENDING', value: 'PENDING' },
        { text: 'COMPLETED', value: 'COMPLETED' },
        { text: 'FAILED', value: 'FAILED' },
        { text: 'PARTIAL', value: 'PARTIAL' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Imported At',
      dataIndex: 'importedAt',
      key: 'importedAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => new Date(a.importedAt) - new Date(b.importedAt),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 80,
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => onViewDetails?.(record.importId)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={imports}
      loading={loading}
      rowKey="importId"
      pagination={pagination || { pageSize: 10, showSizeChanger: true }}
      onChange={onChange}
      scroll={{ x: 1200 }}
    />
  );
};

export default ImportHistoryTable;
