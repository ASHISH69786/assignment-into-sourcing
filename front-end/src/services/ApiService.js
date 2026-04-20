import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});


const ApiService = {
  // ============ Purchase Orders Endpoints ============
  
  /**
   * Get all purchase orders
   */
  getAllOrders: async (params = {}) => {
    try {
      const response = await apiClient.get('/purchase-orders', { params });
      // Handle both array and object responses
      const data = response.data;
      return Array.isArray(data) ? data : (data.data || data.orders || []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  },

  /**
   * Get purchase order by ID
   */
  getOrderById: async (id) => {
    try {
      const response = await apiClient.get(`/purchase-orders/${id}`);
      // Handle both single object and wrapped responses
      const data = response.data;
      return data || {};
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  /**
   * Get purchase order by order number
   */
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await apiClient.get(`/purchase-orders/number/${orderNumber}`);
      // Handle both single object and wrapped responses
      const data = response.data;
      return data || {};
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  },

  /**
   * Get orders by supplier
   */
  getOrdersBySupplier: async (supplierId, params = {}) => {
    try {
      const response = await apiClient.get(`/purchase-orders/supplier/${supplierId}`, { params });
      // Handle both array and object responses
      const data = response.data;
      return Array.isArray(data) ? data : (data.data || data.orders || []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch supplier orders');
    }
  },

  /**
   * Get orders by buyer
   */
  getOrdersByBuyer: async (buyerId, params = {}) => {
    try {
      const response = await apiClient.get(`/purchase-orders/buyer/${buyerId}`, { params });
      // Handle both array and object responses
      const data = response.data;
      return Array.isArray(data) ? data : (data.data || data.orders || []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch buyer orders');
    }
  },

  /**
   * Get orders by date range
   */
  getOrdersByDateRange: async (startDate, endDate, params = {}) => {
    try {
      const response = await apiClient.get('/purchase-orders/date-range', {
        params: { startDate, endDate, ...params },
      });
      // Handle both array and object responses
      const data = response.data;
      return Array.isArray(data) ? data : (data.data || data.orders || []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders by date range');
    }
  },

  /**
   * Get orders by status
   */
  getOrdersByStatus: async (status, params = {}) => {
    try {
      const response = await apiClient.get(`/purchase-orders/status/${status}`, { params });
      // Handle both array and object responses
      const data = response.data;
      return Array.isArray(data) ? data : (data.data || data.orders || []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders by status');
    }
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.post(`/purchase-orders/${orderId}/status?status=${status}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  },

  /**
   * Convert order currency
   */
  convertCurrency: async (orderId, targetCurrency) => {
    try {
      const response = await apiClient.post(
        `/purchase-orders/${orderId}/convert-currency?targetCurrency=${targetCurrency}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to convert currency');
    }
  },

  // ============ Import/Upload Endpoints ============

  /**
   * Upload single PDF
   */
  uploadPDF: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post('/import/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload PDF');
    }
  },

  /**
   * Upload multiple PDFs
   */
  uploadBatchPDFs: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });
      const response = await apiClient.post('/import/batch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload PDFs');
    }
  },

  /**
   * Get import history
   */
  getImportHistory: async (params = {}) => {
    try {
      const response = await apiClient.get('/import/history', { params });
      // Handle both array and object responses
      const data = response.data;
      return Array.isArray(data) ? data : (data.data || data.imports || data.history || []);
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch import history');
    }
  },

  /**
   * Get import details by ID
   */
  getImportDetails: async (importId) => {
    try {
      const response = await apiClient.get(`/import/${importId}`);
      // Handle both object and wrapped responses
      const data = response.data;
      return data || {};
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch import details');
    }
  },

  // ============ Export Endpoints ============

  /**
   * Download all orders as Excel
   */
  downloadExcel: async () => {
    try {
      const response = await apiClient.get('/export/excel', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to download Excel');
    }
  },

  /**
   * Download all orders as CSV
   */
  downloadCSV: async () => {
    try {
      const response = await apiClient.get('/export/csv', {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to download CSV');
    }
  },

  // ============ Analytics Endpoints ============

  /**
   * Get dashboard metrics
   */
  getDashboardMetrics: async () => {
    try {
      const response = await apiClient.get('/analytics/dashboard');
      // Return the metrics object or wrapped data
      const data = response.data;
      return (data && typeof data === 'object' && !Array.isArray(data)) ? data : (data.data || data.metrics || {});
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard metrics');
    }
  },

  /**
   * Get supplier analytics
   */
  getSupplierAnalytics: async (supplierId) => {
    try {
      const response = await apiClient.get(`/analytics/supplier/${supplierId}`);
      // Return the analytics object or wrapped data
      const data = response.data;
      return (data && typeof data === 'object' && !Array.isArray(data)) ? data : (data.data || data.analytics || {});
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch supplier analytics');
    }
  },

  /**
   * Get date range analytics
   */
  getDateRangeAnalytics: async (startDate, endDate) => {
    try {
      const response = await apiClient.get('/analytics/date-range', {
        params: { startDate, endDate },
      });
      // Return the analytics object or wrapped data
      const data = response.data;
      return (data && typeof data === 'object' && !Array.isArray(data)) ? data : (data.data || data.analytics || {});
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch date range analytics');
    }
  },

  // ============ Authentication Endpoints ============

  /**
   * Login
   */
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('authToken');
  },
};

export default ApiService;
