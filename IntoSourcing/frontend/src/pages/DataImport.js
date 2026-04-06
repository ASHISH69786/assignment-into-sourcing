import React, { useState } from 'react';
import { Card, Upload, Button, message, Spin, Row, Col, Statistic, Table, Tabs } from 'antd';
import { UploadOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import ApiService from '../services/ApiService';

const DataImport = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [importHistory, setImportHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const handleUpload = async (file) => {
    setLoading(true);
    try {
      const response = await ApiService.uploadPDF(file);
      message.success(`File ${file.name} uploaded and imported successfully!`);
      setUploadedFiles([...uploadedFiles, response.data]);
      await loadImportHistory();
    } catch (error) {
      message.error(`Failed to import ${file.name}: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
    return false;
  };

  const loadImportHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await ApiService.getImportHistory();
      setImportHistory(response.data);
    } catch (error) {
      message.error('Failed to load import history');
    } finally {
      setHistoryLoading(false);
    }
  };

  React.useEffect(() => {
    loadImportHistory();
  }, []);

  const historyColumns = [
    { title: 'Import ID', dataIndex: 'id', key: 'id' },
    { title: 'Source File', dataIndex: 'sourceFile', key: 'sourceFile' },
    { title: 'Total Records', dataIndex: 'totalRecords', key: 'totalRecords' },
    {
      title: 'Successful Records',
      dataIndex: 'successfulRecords',
      key: 'successfulRecords',
      render: (text) => <span style={{ color: 'green' }}>{text}</span>,
    },
    {
      title: 'Failed Records',
      dataIndex: 'failedRecords',
      key: 'failedRecords',
      render: (text) => <span style={{ color: 'red' }}>{text}</span>,
    },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Import Date', dataIndex: 'importDate', key: 'importDate', render: (text) => new Date(text).toLocaleString() },
  ];

  return (
    <div>
      <Card title="Import Purchase Orders from PDF" style={{ marginBottom: '24px' }}>
        <Upload.Dragger
          accept=".pdf"
          multiple={false}
          disabled={loading}
          beforeUpload={handleUpload}
          onDrop={(e) => {
            console.log('Dropped files', e.dataTransfer.files);
          }}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
          </p>
          <p className="ant-upload-text">Click or drag PDF file to this area to upload</p>
          <p className="ant-upload-hint">Support for single PDF file. The file will be parsed and imported into the database.</p>
        </Upload.Dragger>

        {loading && (
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Spin size="large" tip="Processing PDF..." />
          </div>
        )}
      </Card>

      {uploadedFiles.length > 0 && (
        <Card title="Recent Uploads" style={{ marginBottom: '24px' }}>
          {uploadedFiles.map((file, index) => (
            <Row key={index} gutter={16} style={{ marginBottom: '16px', padding: '12px', background: '#f5f5f5', borderRadius: '4px' }}>
              <Col xs={24} sm={12} lg={6}>
                <Statistic title="Total Records" value={file.totalRecords} />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="Successful"
                  value={file.successfulRecords}
                  prefix={<CheckCircleOutlined style={{ color: 'green' }} />}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic
                  title="Failed"
                  value={file.failedRecords}
                  prefix={<CloseCircleOutlined style={{ color: 'red' }} />}
                />
              </Col>
              <Col xs={24} sm={12} lg={6}>
                <Statistic title="Status" value={file.status} />
              </Col>
            </Row>
          ))}
        </Card>
      )}

      <Card title="Import History">
        <Table
          columns={historyColumns}
          dataSource={importHistory}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={historyLoading}
        />
      </Card>
    </div>
  );
};

export default DataImport;

