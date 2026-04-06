# Purchase Order Management System - React Frontend

A modern, responsive web dashboard for managing purchase orders, tracking deliveries, and analyzing supplier performance.

## 📋 Features

- **Dashboard**: Real-time overview of all purchase orders with key metrics
  - Total orders count
  - Total order value
  - Total quantity
  - On-time delivery percentage
  
- **Advanced Analytics**:
  - Orders by supplier (bar chart)
  - Total order value by supplier (bar chart)
  - Order status distribution (pie chart)
  - Delivery performance metrics
  
- **Purchase Orders Management**:
  - View all purchase orders in a searchable, sortable table
  - Filter by date range, supplier, status
  - Update order status
  - View detailed order information
  - Export orders to Excel
  
- **Data Import**:
  - Single PDF file upload
  - Batch PDF upload
  - Track import history
  - View import details and error logs
  - Real-time import status
  
- **Responsive Design**:
  - Works seamlessly on desktop, tablet, and mobile
  - Dark-themed sidebar navigation
  - Clean and intuitive user interface

## 🛠️ Technology Stack

- **Framework**: React 18.2.0
- **UI Library**: Ant Design 5.11.0
- **Charts**: Recharts 2.10.0
- **HTTP Client**: Axios 1.6.0
- **Routing**: React Router 6.20.0
- **Date Handling**: Day.js 1.11.10
- **Build Tool**: Create React App

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Clone or extract the project**
   ```bash
   cd /path/to/front-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file and set your backend API URL:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   
   The application will open at `http://localhost:3000`

## 🚀 Usage

### Dashboard
- View real-time metrics and analytics
- See recent orders and their status
- Click on orders to view detailed information
- Refresh data with the refresh button

### Purchase Orders
- Browse all purchase orders in table format
- Use filters to narrow down results
  - Date range filter
  - Supplier filter
  - Status filter
- Update order status
- Export all orders to Excel format

### Data Import
- Upload single PDF files for import
- Batch upload multiple PDFs
- Track import history
- View import errors and details

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── pages/
│   │   ├── Dashboard.js          # Main dashboard page
│   │   ├── Orders.js               # Orders management page
│   │   └── DataImport.js           # PDF import page
│   ├── components/
│   │   ├── Charts/
│   │   │   ├── OrdersBySupplierChart.js
│   │   │   ├── ValueBySupplierChart.js
│   │   │   ├── StatusDistributionChart.js
│   │   │   └── DeliveryPerformanceChart.js
│   │   ├── Tables/
│   │   │   ├── OrdersTable.js
│   │   │   └── ImportHistoryTable.js
│   │   ├── Filters/
│   │   │   ├── DateRangeFilter.js
│   │   │   └── SupplierFilter.js
│   │   └── common/
│   │       ├── Navbar.js           # Top navigation bar
│   │       ├── Sidebar.js          # Left sidebar menu
│   │       └── Loading.js          # Loading spinner
│   ├── services/
│   │   └── ApiService.js           # API calls & handlers
│   ├── styles/
│   │   ├── Dashboard.css
│   │   └── Navbar.css
│   ├── App.js                      # Main app component
│   ├── App.css
│   ├── index.js                    # Entry point
│   └── index.css
├── .env.example                    # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Integration

The frontend connects to the backend API with the following key endpoints:

### Purchase Orders
- `GET /purchase-orders` - Get all orders
- `GET /purchase-orders/{id}` - Get order by ID
- `POST /purchase-orders/{id}/status` - Update order status
- `POST /purchase-orders/{id}/convert-currency` - Convert order currency

### Import/Upload
- `POST /import/pdf` - Upload single PDF
- `POST /import/batch` - Upload multiple PDFs
- `GET /import/history` - Get import history
- `GET /import/{id}` - Get import details

### Export
- `GET /export/excel` - Download as Excel
- `GET /export/csv` - Download as CSV

For detailed API documentation, see `../docs/api_docs.md`

## 🎨 Customization

### Theming
Modify Ant Design theme in `src/App.js`:
```javascript
import { ConfigProvider } from 'antd';

<ConfigProvider theme={{ token: { colorPrimary: '#1890ff' } }}>
  {/* Your app */}
</ConfigProvider>
```

### Chart Colors
Customize chart colors in individual chart components:
- `src/components/Charts/OrdersBySupplierChart.js`
- `src/components/Charts/StatusDistributionChart.js`
- etc.

## 📊 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm build

# Run tests
npm test

# Eject configuration (one-way operation)
npm eject
```

## 🐛 Troubleshooting

### Backend connection issues
- Ensure backend is running on `http://localhost:8080`
- Check `.env` file for correct API URL
- Check browser console for CORS errors

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Port already in use
```bash
# Use a different port
PORT=3001 npm start
```

## 📝 Notes

- Ensure the backend server is running before starting the frontend
- The application requires a modern browser (Chrome, Firefox, Safari, Edge)
- All date/time operations use UTC timezone
- Currency conversion rates are fetched from the backend

## 🔐 Security Considerations

- Store sensitive information in environment variables
- Never commit `.env` file to version control
- Implement proper authentication tokens in production
- Use HTTPS in production
- Validate all user inputs

## 📄 License

This project is part of the Purchase Order Management System assignment.

## 👨‍💻 Support

For issues or questions about the frontend:
1. Check the troubleshooting section above
2. Review the API documentation in `../docs/api_docs.md`
3. Check browser console for error messages
4. Verify backend API is running and accessible

---

**Last Updated**: April 2024
**Version**: 1.0.0
