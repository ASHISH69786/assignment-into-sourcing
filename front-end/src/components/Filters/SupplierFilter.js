import React, { useState, useEffect } from 'react';
import { Form, Select, Button, Row, Col, Space, Spin } from 'antd';
import ApiService from '../../services/ApiService';

const SupplierFilter = ({ onFilter, onClear }) => {
  const [form] = Form.useForm();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      // We'll need to implement this endpoint or fetch suppliers from orders
      // For now, we'll use getAllOrders and extract unique suppliers
      const orders = await ApiService.getAllOrders({ limit: 1000 });
      // Ensure orders is an array before mapping
      const validOrders = Array.isArray(orders) ? orders : [];
      const uniqueSuppliers = [...new Set(validOrders.map((order) => order.supplierName))];
      const supplierOptions = uniqueSuppliers.map((supplier) => ({
        label: supplier,
        value: supplier,
      }));
      setSuppliers(supplierOptions);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (values) => {
    if (values.supplier) {
      onFilter({ supplier: values.supplier });
    }
  };

  const handleClear = () => {
    form.resetFields();
    onClear();
  };

  return (
    <Spin spinning={loading}>
      <Form form={form} layout="vertical" onValuesChange={handleFilter}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item name="supplier" label="Supplier">
              <Select
                placeholder="Select a supplier"
                options={suppliers}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12}>
            <Form.Item label=" ">
              <Space>
                <Button onClick={handleClear}>Clear Filters</Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default SupplierFilter;
