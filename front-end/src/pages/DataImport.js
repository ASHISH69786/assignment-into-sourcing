import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Upload,
  Space,
  message,
  Progress,
  List,
  Tag,
  Modal,
  Table,
} from 'antd';
import {
  UploadOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import ApiService from '../services/ApiService';
import ImportHistoryTable from '../components/Tables/ImportHistoryTable';
import '../styles/Dashboard.css';

const DataImport = () => {
  const [uploads, setUploads] = useState([]);
  const [importHistory, setImportHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importDetailsModalVisible, setImportDetailsModalVisible] = useState(false);
  const [selectedImportDetails, setSelectedImportDetails] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  useEffect(() => {
    fetchImportHistory();
  }, []);

  const fetchImportHistory = async () => {
    setLoading(true);
    try {
      const history = await ApiService.getImportHistory();
      setImportHistory(history);
    } catch (error) {
      console.error('Failed to fetch import history:', error);
      message.error('Failed to load import history');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const response = await ApiService.uploadPDF(file);
      message.success(
        `PDF imported successfully! (${response.successfulRecords} records)`
      );
      setUploads([
        ...uploads,
        {
          name: file.name,
          status: 'success',
          timestamp: dayjs().format('DD/MM/YYYY HH:mm'),
          records: response.successfulRecords,
        },
      ]);
      fetchImportHistory();
    } catch (error) {
      message.error(`Failed to upload ${file.name}: ${error.message}`);
      setUploads([
        ...uploads,
        {
          name: file.name,
          status: 'error',
          timestamp: dayjs().format('DD/MM/YYYY HH:mm'),
          error: error.message,
        },
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleBatchUpload = async (files) => {
    setUploading(true);
    try {
      const response = await ApiService.uploadBatchPDFs(files);
      message.success(
        `Batch import completed! (${response.successfulRecords} records from ${files.length} files)`
      );
      setUploads([
        ...uploads,
        {
          name: `Batch (${files.length} files)`,
          status: 'success',
          timestamp: dayjs().format('DD/MM/YYYY HH:mm'),
          records: response.successfulRecords,
        },
      ]);
      fetchImportHistory();
    } catch (error) {
      message.error(`Batch import failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleViewImportDetails = async (importId) => {
    try {
      const details = await ApiService.getImportDetails(importId);
      setSelectedImportDetails(details);
      setImportDetailsModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch import details');
    }
  };

  const uploadProps = {
    accept: '.pdf',
    multiple: false,
    beforeUpload: (file) => {
      const isPDF = file.type === 'application/pdf';
      if (!isPDF) {
        message.error('Only PDF files are allowed');
      }
      return isPDF;
    },
    customRequest: async ({ file }) => {
      await handleUpload(file);
    },
  };

  const statusColors = {
    PENDING: 'processing',
    COMPLETED: 'success',
    FAILED: 'error',
    PARTIAL: 'warning',
  };

  const errorColumns = [
    {
      title: 'Record Index',
      dataIndex: 'recordIndex',
      key: 'recordIndex',
    },
    {
      title: 'Error Message',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
    },
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
    },
  ];

  return (
    <div className="data-import-page">
      <div className="dashboard-header">
        <h1>Data Import</h1>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchImportHistory}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      {/* Upload Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Upload PDF Files">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <h3>Single File Upload</h3>
                <Upload {...uploadProps} maxCount={1}>
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    disabled={uploading}
                  >
                    Click to Upload PDF
                  </Button>
                </Upload>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                <h3>Batch Upload</h3>
                <Upload
                  accept=".pdf"
                  multiple
                  beforeUpload={(file) => {
                    const isPDF = file.type === 'application/pdf';
                    if (!isPDF) {
                      message.error('Only PDF files are allowed');
                    }
                    return isPDF || Upload.LIST_IGNORE;
                  }}
                  customRequest={async ({ file, onSuccess }) => {
                    // Collect files for batch upload
                    // This is simplified - in production, implement proper multi-file handling
                    onSuccess();
                  }}
                >
                  <Button
                    icon={<UploadOutlined />}
                    loading={uploading}
                    disabled={uploading}
                  >
                    Click to Upload Multiple PDFs
                  </Button>
                </Upload>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Recent Uploads */}
      {uploads.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24}>
            <Card title="Recent Uploads">
              <List
                itemLayout="horizontal"
                dataSource={uploads}
                renderItem={(upload) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<FilePdfOutlined style={{ fontSize: 20 }} />}
                      title={upload.name}
                      description={`Uploaded at ${upload.timestamp}`}
                    />
                    <div>
                      {upload.status === 'success' ? (
                        <Space>
                          <CheckCircleOutlined style={{ color: '#52c41a' }} />
                          <span>{upload.records} records imported</span>
                        </Space>
                      ) : (
                        <Space>
                          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                          <span>{upload.error}</span>
                        </Space>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Import History */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24}>
          <Card title="Import History">
            <ImportHistoryTable
              imports={importHistory}
              loading={loading}
              onViewDetails={handleViewImportDetails}
              pagination={pagination}
            />
          </Card>
        </Col>
      </Row>

      {/* Import Details Modal */}
      <Modal
        title="Import Details"
        open={importDetailsModalVisible}
        onCancel={() => setImportDetailsModalVisible(false)}
        width={900}
        footer={null}
      >
        {selectedImportDetails && (
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div>
                  <strong>Import ID:</strong>
                  <p>{selectedImportDetails.importId}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Status:</strong>
                  <p>
                    <Tag color={statusColors[selectedImportDetails.status]}>
                      {selectedImportDetails.status}
                    </Tag>
                  </p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Source File:</strong>
                  <p>{selectedImportDetails.sourceFile}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Imported At:</strong>
                  <p>
                    {dayjs(selectedImportDetails.importedAt).format(
                      'DD/MM/YYYY HH:mm'
                    )}
                  </p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Total Records:</strong>
                  <p>{selectedImportDetails.totalRecords}</p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Successful Records:</strong>
                  <p style={{ color: '#52c41a' }}>
                    {selectedImportDetails.successfulRecords}
                  </p>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <strong>Failed Records:</strong>
                  <p style={{ color: '#ff4d4f' }}>
                    {selectedImportDetails.failedRecords}
                  </p>
                </div>
              </Col>
            </Row>

            {selectedImportDetails.errors && (
              <div>
                <h3>Errors</h3>
                <Table
                  columns={errorColumns}
                  dataSource={selectedImportDetails.errors}
                  size="small"
                  pagination={false}
                />
              </div>
            )}
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default DataImport;
