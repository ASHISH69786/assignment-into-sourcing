import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const ApiService = {
  // Purchase Orders
  getAllOrders: () => axios.get(`${API_BASE_URL}/purchase-orders`),
  getOrderById: (id) => axios.get(`${API_BASE_URL}/purchase-orders/${id}`),
  getOrdersBySupplier: (supplierId) => axios.get(`${API_BASE_URL}/purchase-orders/supplier/${supplierId}`),
  getOrdersByDateRange: (startDate, endDate) =>
    axios.get(`${API_BASE_URL}/purchase-orders/date-range`, { params: { startDate, endDate } }),
  updateOrderStatus: (id, status) => axios.post(`${API_BASE_URL}/purchase-orders/${id}/status`, {}, { params: { status } }),
  convertCurrency: (id, currency) => axios.post(`${API_BASE_URL}/purchase-orders/${id}/convert-currency`, {}, { params: { targetCurrency: currency } }),

  // Analytics
  getDashboardMetrics: () => axios.get(`${API_BASE_URL}/analytics/dashboard`),
  getSupplierAnalytics: (supplierId) => axios.get(`${API_BASE_URL}/analytics/supplier/${supplierId}`),
  getDateRangeAnalytics: (startDate, endDate) =>
    axios.get(`${API_BASE_URL}/analytics/date-range`, { params: { startDate, endDate } }),

  // Import
  uploadPDF: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axios.post(`${API_BASE_URL}/import/pdf`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadBatchPDFs: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return axios.post(`${API_BASE_URL}/import/batch`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getImportHistory: () => axios.get(`${API_BASE_URL}/import/history`),
  getImportDetails: (importId) => axios.get(`${API_BASE_URL}/import/${importId}`),
};

export default ApiService;

