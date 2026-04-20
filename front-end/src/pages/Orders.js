import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Space,
  Modal,
  Form,
  Select,
  message,
  Input,
} from 'antd';
import {
  DownloadOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ApiService from '../services/ApiService';
import OrdersTable from '../components/Tables/OrdersTable';
import DateRangeFilter from '../components/Filters/DateRangeFilter';
import '../styles/Dashboard.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [statusForm] = Form.useForm();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllOrders();
      // Ensure data is an array
      const validOrders = Array.isArray(data) ? data : [];
      setOrders(validOrders);
      setFilteredOrders(validOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      message.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterValues) => {
    setFilters(filterValues);
    // Ensure orders is an array before filtering
    const validOrders = Array.isArray(orders) ? orders : [];
    let filtered = [...validOrders];

    if (filterValues.startDate && filterValues.endDate) {
      filtered = filtered.filter((order) => {
        if (!order || !order.orderDate) return false;
        const orderDate = new Date(order.orderDate);
        const startDate = new Date(filterValues.startDate);
        const endDate = new Date(filterValues.endDate);
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    if (filterValues.supplier) {
      filtered = filtered.filter((order) => order && order.supplierName === filterValues.supplier);
    }

    if (filterValues.status) {
      filtered = filtered.filter((order) => order && order.status === filterValues.status);
    }

    setFilteredOrders(filtered);
  };

  const handleClearFilters = () => {
    setFilters({});
    // Ensure orders is an array
    const validOrders = Array.isArray(orders) ? orders : [];
    setFilteredOrders(validOrders);
  };

  const handleViewDetails = (orderId) => {
    // Ensure orders is an array before finding
    const validOrders = Array.isArray(orders) ? orders : [];
    const order = validOrders.find((o) => o && o.id === orderId);
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const handleOpenStatusModal = (orderId) => {
    setSelectedOrderId(orderId);
    statusModalVisible === false && setStatusModalVisible(true);
  };

  const handleStatusUpdate = async (values) => {
    try {
      await ApiService.updateOrderStatus(selectedOrderId, values.status);
      message.success('Order status updated successfully');
      setStatusModalVisible(false);
      fetchOrders();
    } catch (error) {
      message.error('Failed to update order status');
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const blob = await ApiService.downloadExcel();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders-${dayjs().format('YYYY-MM-DD')}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      message.success('Orders exported successfully');
    } catch (error) {
      message.error('Failed to export orders');
    }
  };

  const statusColors = {
    PENDING: 'orange',
    CONFIRMED: 'blue',
    IN_TRANSIT: 'cyan',
    DELIVERED: 'green',
    CANCELLED: 'red',
  };

  const handleTableChange = (paginationObj) => {
    setPagination(paginationObj);
  };

  return (
    <div className="orders-page">
      <div className="dashboard-header">
        <h1>Purchase Orders</h1>
        <Space>
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterModalVisible(true)}
          >
            Filters
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownloadExcel}
          >
            Export Excel
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchOrders}
            loading={loading}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card>
            <OrdersTable
              orders={filteredOrders}
              loading={loading}
              onViewDetails={handleViewDetails}
              pagination={pagination}
              onChange={handleTableChange}
            />
          </Card>
        </Col>
      </Row>

      {/* Order Details Modal */}
      <Modal
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[
          <Button
            key="status"
            type="primary"
            onClick={() => handleOpenStatusModal(selectedOrder?.id)}
          >
            Update Status
          </Button>,
          <Button key="close" onClick={() => setDetailsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <strong>Order Number:</strong>
                  <p>{selectedOrder.orderNumber}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Status:</strong>
                  <p>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '4px',
                        backgroundColor: statusColors[selectedOrder.status],
                        color: '#fff',
                      }}
                    >
                      {selectedOrder.status}
                    </span>
                  </p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Supplier:</strong>
                  <p>{selectedOrder.supplierName}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Buyer:</strong>
                  <p>{selectedOrder.buyerName}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Order Value:</strong>
                  <p>
                    {selectedOrder.currency}{' '}
                    {selectedOrder.totalOrderValue?.toLocaleString('en-US', {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Currency:</strong>
                  <p>{selectedOrder.currency}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Order Date:</strong>
                  <p>{dayjs(selectedOrder.orderDate).format('DD/MM/YYYY')}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Confirmed Ex-Factory Date:</strong>
                  <p>
                    {dayjs(selectedOrder.confirmedExFactoryDate).format(
                      'DD/MM/YYYY'
                    )}
                  </p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Expected Delivery Date:</strong>
                  <p>
                    {dayjs(selectedOrder.expectedDeliveryDate).format(
                      'DD/MM/YYYY'
                    )}
                  </p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Actual Delivery Date:</strong>
                  <p>
                    {selectedOrder.actualDeliveryDate
                      ? dayjs(selectedOrder.actualDeliveryDate).format(
                          'DD/MM/YYYY'
                        )
                      : 'Not yet delivered'}
                  </p>
                </div>
              </Col>
              {selectedOrder.notes && (
                <Col xs={24}>
                  <div>
                    <strong>Notes:</strong>
                    <p>{selectedOrder.notes}</p>
                  </div>
                </Col>
              )}
            </Row>
          </Space>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        title="Filter Orders"
        open={filterModalVisible}
        onCancel={() => setFilterModalVisible(false)}
        footer={null}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <DateRangeFilter
            onFilter={handleFilterChange}
            onClear={handleClearFilters}
          />
        </Space>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        title="Update Order Status"
        open={statusModalVisible}
        onCancel={() => setStatusModalVisible(false)}
        okText="Update"
        onOk={() => statusForm.submit()}
      >
        <Form form={statusForm} onFinish={handleStatusUpdate}>
          <Form.Item
            name="status"
            label="New Status"
            rules={[{ required: true, message: 'Please select a status' }]}
          >
            <Select
              options={[
                { label: 'PENDING', value: 'PENDING' },
                { label: 'CONFIRMED', value: 'CONFIRMED' },
                { label: 'IN_TRANSIT', value: 'IN_TRANSIT' },
                { label: 'DELIVERED', value: 'DELIVERED' },
                { label: 'CANCELLED', value: 'CANCELLED' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
