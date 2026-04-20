import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Space,
  Button,
  Modal,
  Spin,
  message,
} from 'antd';
import {
  ShoppingCartOutlined,
  DollarOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ApiService from '../services/ApiService';
import OrdersBySupplierChart from '../components/Charts/OrdersBySupplierChart';
import ValueBySupplierChart from '../components/Charts/ValueBySupplierChart';
import StatusDistributionChart from '../components/Charts/StatusDistributionChart';
import DeliveryPerformanceChart from '../components/Charts/DeliveryPerformanceChart';
import OrdersTable from '../components/Tables/OrdersTable';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [supplierData, setSupplierData] = useState([]);
  const [valueData, setValueData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all orders
      const allOrders = await ApiService.getAllOrders();
      // Ensure allOrders is an array
      const validOrders = Array.isArray(allOrders) ? allOrders : [];
      setOrders(validOrders.slice(0, 10)); // Show last 10 orders

      // Calculate metrics
      calculateMetrics(validOrders);

      // Process chart data
      processChartData(validOrders);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      message.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (ordersList) => {
    // Ensure ordersList is an array
    const validOrders = Array.isArray(ordersList) ? ordersList : [];
    const totalOrders = validOrders.length;
    const totalValue = validOrders.reduce((sum, order) => sum + (order.totalOrderValue || 0), 0);
    const totalQuantity = validOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);

    const onTimeCount = validOrders.filter((order) => {
      if (!order.actualDeliveryDate || !order.expectedDeliveryDate) return false;
      return new Date(order.actualDeliveryDate) <= new Date(order.expectedDeliveryDate);
    }).length;
    const onTimePercentage = totalOrders > 0 ? ((onTimeCount / totalOrders) * 100).toFixed(2) : 0;

    setMetrics({
      totalOrders,
      totalValue,
      totalQuantity,
      onTimePercentage,
    });
  };

  const processChartData = (ordersList) => {
    // Ensure ordersList is an array
    const validOrders = Array.isArray(ordersList) ? ordersList : [];

    // Orders by supplier
    const supplierMap = {};
    validOrders.forEach((order) => {
      if (order && order.supplierName) {
        supplierMap[order.supplierName] = (supplierMap[order.supplierName] || 0) + 1;
      }
    });
    const supplierChartData = Object.entries(supplierMap)
      .map(([name, orders]) => ({ name, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 10);
    setSupplierData(supplierChartData);

    // Value by supplier
    const valueMap = {};
    validOrders.forEach((order) => {
      if (order && order.supplierName) {
        valueMap[order.supplierName] = (valueMap[order.supplierName] || 0) + (order.totalOrderValue || 0);
      }
    });
    const valueChartData = Object.entries(valueMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    setValueData(valueChartData);

    // Status distribution
    const statusMap = {};
    validOrders.forEach((order) => {
      if (order && order.status) {
        statusMap[order.status] = (statusMap[order.status] || 0) + 1;
      }
    });
    const statusChartData = Object.entries(statusMap).map(([name, value]) => ({
      name,
      value,
    }));
    setStatusData(statusChartData);

    // Delivery performance
    let onTime = 0;
    let late = 0;
    let pending = 0;
    validOrders.forEach((order) => {
      if (order) {
        if (!order.actualDeliveryDate) {
          pending += 1;
        } else if (new Date(order.actualDeliveryDate) <= new Date(order.expectedDeliveryDate)) {
          onTime += 1;
        } else {
          late += 1;
        }
      }
    });
    setDeliveryData([
      { name: 'Performance', 'On Time': onTime, Late: late, Pending: pending },
    ]);
  };

  const handleViewDetails = (orderId) => {
    // Ensure orders is an array before finding
    const validOrders = Array.isArray(orders) ? orders : [];
    const order = validOrders.find((o) => o && o.id === orderId);
    setSelectedOrder(order);
    setDetailsModalVisible(true);
  };

  const statusColors = {
    PENDING: 'orange',
    CONFIRMED: 'blue',
    IN_TRANSIT: 'cyan',
    DELIVERED: 'green',
    CANCELLED: 'red',
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={fetchDashboardData}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Metrics Cards */}
      <Row gutter={[16, 16]} className="metrics-row">
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Orders"
              value={metrics?.totalOrders || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Order Value"
              value={metrics?.totalValue || 0}
              prefix={<DollarOutlined />}
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Quantity"
              value={metrics?.totalQuantity || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card loading={loading}>
            <Statistic
              title="On-Time Delivery"
              value={metrics?.onTimePercentage || 0}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} md={12}>
          <OrdersBySupplierChart data={supplierData} loading={loading} />
        </Col>
        <Col xs={24} md={12}>
          <ValueBySupplierChart data={valueData} loading={loading} />
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} md={12}>
          <StatusDistributionChart data={statusData} loading={loading} />
        </Col>
        <Col xs={24} md={12}>
          <DeliveryPerformanceChart data={deliveryData} loading={loading} />
        </Col>
      </Row>

      {/* Recent Orders */}
      <Row gutter={[16, 16]} className="recent-orders-row">
        <Col xs={24}>
          <Card title="Recent Orders" loading={loading}>
            <OrdersTable
              orders={orders}
              loading={loading}
              onViewDetails={handleViewDetails}
            />
          </Card>
        </Col>
      </Row>

      {/* Order Details Modal */}
      <Modal
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        visible={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={null}
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
                    {selectedOrder.currency} {selectedOrder.totalOrderValue?.toLocaleString()}
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
                  <p>{dayjs(selectedOrder.confirmedExFactoryDate).format('DD/MM/YYYY')}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Expected Delivery Date:</strong>
                  <p>{dayjs(selectedOrder.expectedDeliveryDate).format('DD/MM/YYYY')}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Actual Delivery Date:</strong>
                  <p>{selectedOrder.actualDeliveryDate ? dayjs(selectedOrder.actualDeliveryDate).format('DD/MM/YYYY') : 'Not yet delivered'}</p>
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
    </div>
  );
};

export default Dashboard;

//   const processChartData = (ordersList) => {
//     // Orders by supplier
//     const supplierMap = {};
//     ordersList.forEach((order) => {
//       if (order.supplierName) {
//         supplierMap[order.supplierName] = (supplierMap[order.supplierName] || 0) + 1;
//       }
//     });
//     const supplierChartData = Object.entries(supplierMap)
//       .map(([name, orders]) => ({ name, orders }))
//       .sort((a, b) => b.orders - a.orders)
//       .slice(0, 10);
//     setSupplierData(supplierChartData);

//     // Value by supplier
//     const valueMap = {};
//     ordersList.forEach((order) => {
//       if (order.supplierName) {
//         valueMap[order.supplierName] = (valueMap[order.supplierName] || 0) + (order.totalOrderValue || 0);
//       }
//     });
//     const valueChartData = Object.entries(valueMap)
//       .map(([name, value]) => ({ name, value }))
//       .sort((a, b) => b.value - a.value)
//       .slice(0, 10);
//     setValueData(valueChartData);

//     // Status distribution
//     const statusMap = {};
//     ordersList.forEach((order) => {
//       if (order.status) {
//         statusMap[order.status] = (statusMap[order.status] || 0) + 1;
//       }
//     });
//     const statusChartData = Object.entries(statusMap).map(([name, value]) => ({
//       name,
//       value,
//     }));
//     setStatusData(statusChartData);

//     // Delivery performance
//     let onTime = 0;
//     let late = 0;
//     let pending = 0;
//     ordersList.forEach((order) => {
//       if (order) {
//         if (!order.actualDeliveryDate) {
//           pending += 1;
//         } else if (new Date(order.actualDeliveryDate) <= new Date(order.expectedDeliveryDate)) {
//           onTime += 1;
//         } else {
//           late += 1;
//         }
//       }
//     });
//     setDeliveryData([
//       { name: 'Performance', 'On Time': onTime, Late: late, Pending: pending },
//     ]);
//   };

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <h1>Dashboard</h1>
//         <Button
//           type="primary"
//           icon={<ReloadOutlined />}
//           onClick={fetchDashboardData}
//           loading={loading}
//         >
//           Refresh
//         </Button>
//       </div>

//       {/* Metrics Cards */}
//       <Row gutter={[16, 16]} className="metrics-row">
//         <Col xs={24} sm={12} md={6}>
//           <Card loading={loading}>
//             <Statistic
//               title="Total Orders"
//               value={metrics?.totalOrders || 0}
//               prefix={<ShoppingCartOutlined />}
//               valueStyle={{ color: '#1890ff' }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card loading={loading}>
//             <Statistic
//               title="Total Order Value"
//               value={metrics?.totalValue || 0}
//               prefix={<DollarOutlined />}
//               precision={2}
//               valueStyle={{ color: '#52c41a' }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card loading={loading}>
//             <Statistic
//               title="Total Quantity"
//               value={metrics?.totalQuantity || 0}
//               prefix={<ShoppingOutlined />}
//               valueStyle={{ color: '#faad14' }}
//             />
//           </Card>
//         </Col>
//         <Col xs={24} sm={12} md={6}>
//           <Card loading={loading}>
//             <Statistic
//               title="On-Time Delivery"
//               value={metrics?.onTimePercentage || 0}
//               suffix="%"
//               prefix={<CheckCircleOutlined />}
//               valueStyle={{ color: '#13c2c2' }}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Charts Row 1 */}
//       <Row gutter={[16, 16]} className="charts-row">
//         <Col xs={24} md={12}>
//           <OrdersBySupplierChart data={supplierData} loading={loading} />
//         </Col>
//         <Col xs={24} md={12}>
//           <ValueBySupplierChart data={valueData} loading={loading} />
//         </Col>
//       </Row>

//       {/* Charts Row 2 */}
//       <Row gutter={[16, 16]} className="charts-row">
//         <Col xs={24} md={12}>
//           <StatusDistributionChart data={statusData} loading={loading} />
//         </Col>
//         <Col xs={24} md={12}>
//           <DeliveryPerformanceChart data={deliveryData} loading={loading} />
//         </Col>
//       </Row>

//       {/* Recent Orders */}
//       <Row gutter={[16, 16]} className="recent-orders-row">
//         <Col xs={24}>
//           <Card title="Recent Orders" loading={loading}>
//             <OrdersTable
//               orders={orders}
//               loading={loading}
//               onViewDetails={handleViewDetails}
//             />
//           </Card>
//         </Col>
//       </Row>

//       {/* Order Details Modal */}
//       <Modal
//         title={`Order Details - ${selectedOrder?.orderNumber}`}
//         visible={detailsModalVisible}
//         onCancel={() => setDetailsModalVisible(false)}
//         footer={null}
//         width={800}
//       >
//         {selectedOrder && (
//           <Space direction="vertical" style={{ width: '100%' }} size="large">
//             <Row gutter={[16, 16]}>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Order Number:</strong>
//                   <p>{selectedOrder.orderNumber}</p>
//                 </div>
//               </Col>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Status:</strong>
//                   <p>
//                     <span
//                       style={{
//                         padding: '4px 12px',
//                         borderRadius: '4px',
//                         backgroundColor: statusColors[selectedOrder.status],
//                         color: '#fff',
//                       }}
//                     >
//                       {selectedOrder.status}
//                     </span>
//                   </p>
//                 </div>
//               </Col>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Supplier:</strong>
//                   <p>{selectedOrder.supplierName}</p>
//                 </div>
//               </Col>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Buyer:</strong>
//                   <p>{selectedOrder.buyerName}</p>
//                 </div>
//               </Col>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Order Value:</strong>
//                   <p>
//                     {selectedOrder.currency} {selectedOrder.totalOrderValue?.toLocaleString()}
//                   </p>
//                 </div>
//               </Col>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Currency:</strong>
//                   <p>{selectedOrder.currency}</p>
//                 </div>
//               </Col>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Order Date:</strong>
//                   <p>{dayjs(selectedOrder.orderDate).format('DD/MM/YYYY')}</p>
//                 </div>
//               </Col>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Confirmed Ex-Factory Date:</strong>
//                   <p>{dayjs(selectedOrder.confirmedExFactoryDate).format('DD/MM/YYYY')}</p>
//                 </div>
//               </Col>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Expected Delivery Date:</strong>
//                   <p>{dayjs(selectedOrder.expectedDeliveryDate).format('DD/MM/YYYY')}</p>
//                 </div>
//               </Col>
//               <Col xs={24} md={12}>
//                 <div>
//                   <strong>Actual Delivery Date:</strong>
//                   <p>{selectedOrder.actualDeliveryDate ? dayjs(selectedOrder.actualDeliveryDate).format('DD/MM/YYYY') : 'Not yet delivered'}</p>
//                 </div>
//               </Col>
//               {selectedOrder.notes && (
//                 <Col xs={24}>
//                   <div>
//                     <strong>Notes:</strong>
//                     <p>{selectedOrder.notes}</p>
//                   </div>
//                 </Col>
//               )}
//             </Row>
//           </Space>
//         )}
//       </Modal>
//     </div>
//   );

// export default Dashboard;
