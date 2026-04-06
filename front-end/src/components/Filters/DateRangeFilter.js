import React from 'react';
import { Form, DatePicker, Button, Row, Col, Space } from 'antd';
import dayjs from 'dayjs';

const DateRangeFilter = ({ onFilter, onClear }) => {
  const [form] = Form.useForm();

  const handleFilter = (values) => {
    const { dateRange } = values;
    if (dateRange && dateRange.length === 2) {
      const startDate = dateRange[0].format('YYYY-MM-DD');
      const endDate = dateRange[1].format('YYYY-MM-DD');
      onFilter({ startDate, endDate });
    }
  };

  const handleClear = () => {
    form.resetFields();
    onClear();
  };

  return (
    <Form form={form} layout="vertical" onValuesChange={handleFilter}>
      <Row gutter={16}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <Form.Item name="dateRange" label="Date Range">
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              defaultValue={[dayjs().subtract(30, 'days'), dayjs()]}
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
  );
};

export default DateRangeFilter;
