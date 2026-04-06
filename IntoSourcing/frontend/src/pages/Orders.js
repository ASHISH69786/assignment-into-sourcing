import React, { useState, useEffect } from 'react';
import { Card, Table, Space, Button, Modal, Spin, message, Select, DatePicker, Row, Col, Tag } from 'antd';
import { EyeOutlined, FilterOutlined } from '@ant-design/icons';
import ApiService from '../services/ApiService';
import dayjs from 'dayjs';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterSupplier, setFilterSupplier] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      let response;
      if (startDate && endDate) {
        response = await ApiService.getOrdersByDateRange(
          startDate.format('YYYY-MM-DD'),
          endDate.format('YYYY-MM-DD')
        );
      } else {
        response = await ApiService.getAllOrders();
      }
      setOrders(response.data);
    } catch (error) {
      message.error('Failed to load orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedOrder(record);
    setModalVisible(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await ApiService.updateOrderStatus(orderId, newStatus);
      message.success('Order status updated');
      loadOrders();
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  const handleCurrencyConvert = async (orderId, currency) => {
    try {
      const response = await ApiService.convertCurrency(orderId, currency);
      message.success(`Converted to ${currency}: ${response.data.convertedValue}`);
    } catch (error) {
      message.error('Failed to convert currency');
    }
  };

  const columns = [
    { title: 'Order Number', dataIndex: 'orderNumber', key: 'orderNumber', width: 120 },
    { title: 'Supplier', dataIndex: 'supplierName', key: 'supplierName' },
    { title: 'Buyer', dataIndex: 'buyerName', key: 'buyerName' },
    {
      title: 'Total Value',
      dataIndex: 'totalOrderValue',
      key: 'totalOrderValue',
      render: (value, record) => `${record.currency} ${parseFloat(value).toFixed(2)}`,
    },
    {
      title: 'Order Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Expected Delivery',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          PENDING: 'orange',
          CONFIRMED: 'blue',
          IN_TRANSIT: 'cyan',
          DELIVERED: 'green',
          CANCELLED: 'red',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card title="Filters" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <label>Start Date</label>
            <DatePicker
              value={startDate}
              onChange={setStartDate}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <label>End Date</label>
            <DatePicker
              value={endDate}
              onChange={setEndDate}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Button type="primary" onClick={loadOrders} style={{ marginTop: '24px', width: '100%' }}>
              <FilterOutlined /> Apply Filters
            </Button>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Button onClick={() => { setStartDate(null); setEndDate(null); loadOrders(); }} style={{ marginTop: '24px', width: '100%' }}>
              Reset
            </Button>
          </Col>
        </Row>
      </Card>

      <Card title="Purchase Orders" loading={loading}>
        <Table columns={columns} dataSource={orders} rowKey="id" pagination={{ pageSize: 20 }} />
      </Card>

      <Modal
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <p><strong>Order Number:</strong> {selectedOrder.orderNumber}</p>
                <p><strong>Supplier:</strong> {selectedOrder.supplierName}</p>
                <p><strong>Buyer:</strong> {selectedOrder.buyerName}</p>
                <p><strong>Total Value:</strong> {selectedOrder.currency} {parseFloat(selectedOrder.totalOrderValue).toFixed(2)}</p>
              </Col>
              <Col xs={24} sm={12}>
                <p><strong>Order Date:</strong> {dayjs(selectedOrder.orderDate).format('YYYY-MM-DD')}</p>
                <p><strong>Ex-Factory Date:</strong> {dayjs(selectedOrder.confirmedExFactoryDate).format('YYYY-MM-DD')}</p>
                <p><strong>Expected Delivery:</strong> {dayjs(selectedOrder.expectedDeliveryDate).format('YYYY-MM-DD')}</p>
                <p><strong>Status:</strong> <Tag color="blue">{selectedOrder.status}</Tag></p>
              </Col>
            </Row>
            <p><strong>Notes:</strong> {selectedOrder.notes || 'N/A'}</p>
            <p><strong>Source File:</strong> {selectedOrder.sourceFile || 'N/A'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;

