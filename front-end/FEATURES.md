# Frontend Features Documentation

## Overview

This document provides detailed information about all features available in the Purchase Order Management System frontend.

---

## 📊 Dashboard

### Purpose
The dashboard provides a comprehensive overview of all purchase order data with real-time metrics and visualizations.

### Key Components

#### 1. Metrics Cards (Top Section)
Display four key performance indicators:

- **Total Orders**: Count of all purchase orders in the system
- **Total Order Value**: Sum of all order values (shows in base currency)
- **Total Quantity**: Total quantity across all orders
- **On-Time Delivery %**: Percentage of orders delivered on or before expected delivery date

#### 2. Orders by Supplier Chart (Bar Chart)
- Displays the number of orders for each supplier
- Automatically sorts by highest count
- Hovering shows exact values
- Displays top 10 suppliers

#### 3. Total Value by Supplier Chart (Bar Chart)
- Shows total order value for each supplier
- Formats currency properly
- Helps identify top spenders by supplier
- Displays top 10 suppliers by value

#### 4. Order Status Distribution (Pie Chart)
- Visualizes breakdown of orders by status:
  - **PENDING** (Orange): Not yet processed
  - **CONFIRMED** (Blue): Confirmed by supplier
  - **IN_TRANSIT** (Cyan): Orders in transit
  - **DELIVERED** (Green): Successfully delivered
  - **CANCELLED** (Red): Cancelled orders

#### 5. Delivery Performance Chart
- Shows on-time vs late vs pending deliveries
- Color coded:
  - **On Time** (Green): Delivered before expected date
  - **Late** (Red): Delivered after expected date
  - **Pending** (Gray): Not yet delivered

#### 6. Recent Orders Table
- Shows last 10 orders
- Columns:
  - Order Number
  - Supplier Name
  - Order Value
  - Status (color-coded)
  - Order Date
  - Expected Delivery Date
  - Actions (View/Edit)

### Features
- Auto-refresh data on page load
- Manual refresh button
- Click on order to view full details
- Responsive design (works on all screen sizes)

---

## 📋 Purchase Orders Page

### Purpose
Manage and track all purchase orders with advanced filtering and search capabilities.

### Main Features

#### 1. Orders Table
Comprehensive table view with columns:
- Order Number (sortable)
- Supplier Name (filterable)
- Buyer Name
- Order Value (sortable)
- Status (filterable by status)
- Order Date (sortable)
- Ex-Factory Date
- Expected Delivery Date
- Actual Delivery Date
- Actions (View/Edit)

#### 2. Filtering Capabilities

**Date Range Filter**
- Select start and end dates
- Filters orders within the selected range
- Uses DD/MM/YYYY format
- Can be combined with other filters

**Status Filter**
- Filter by order status:
  - PENDING
  - CONFIRMED
  - IN_TRANSIT
  - DELIVERED
  - CANCELLED

**Supplier Filter**
- Select specific supplier
- Shows only orders from selected supplier

#### 3. Order Details Modal
Click "View" on any order to see:
- Complete order information
- Order number and status
- Supplier and buyer details
- Order value and currency
- All date information
- Notes (if any)
- Option to update status

#### 4. Status Update
- Click "Update Status" in order details
- Select new status from dropdown
- Changes are reflected immediately
- Status options: PENDING, CONFIRMED, IN_TRANSIT, DELIVERED, CANCELLED

#### 5. Export Functionality
- Export all filtered orders to Excel
- Creates file: `orders-YYYY-MM-DD.xlsx`
- Includes all order information
- Automatically downloads to Downloads folder

### User Actions
- Browse all orders
- Filter by multiple criteria
- Sort by any column
- View detailed information
- Update order status
- Export to Excel

---

## 📤 Data Import Page

### Purpose
Import purchase order data from PDF files into the system.

### Main Features

#### 1. Single File Upload
- Upload one PDF file at a time
- Accepts only .pdf files
- Shows upload progress
- Displays success/error message
- Shows number of records imported

#### 2. Batch Upload
- Upload multiple PDF files at once
- Processes all files together
- Shows consolidated result
- Indicates total records processed

#### 3. Recent Uploads Section
Lists all recent uploads with:
- File name
- Upload timestamp
- Number of records imported
- Success/Error status
- Error details (if any)

#### 4. Import History Table
Comprehensive history of all imports:

**Columns:**
- Import ID
- Source File (PDF filename)
- Total Records
- Successful Records (count)
- Failed Records (count and color-coded)
- Status (PENDING, COMPLETED, FAILED, PARTIAL)
- Imported At (date and time)

**Features:**
- Sortable by any column
- View details button for each import
- Pagination (10 items per page)

#### 5. Import Details Modal
View complete details of each import:
- Import ID
- Status (color-tagged)
- Source file name
- Import timestamp
- Total/Successful/Failed record counts
- Error log table (if any errors)

### Error Handling
- Lists each error with:
  - Record index
  - Field name
  - Error message
- Helps identify which records failed and why

### Workflow
1. Prepare PDF files (must contain order data)
2. Click "Upload PDF" or "Upload Multiple PDFs"
3. Select file(s) from your computer
4. Wait for processing
5. View results in Recent Uploads
6. Check Import History for all past imports

---

## 🗂️ Additional Pages

### Settings Page
- **Status**: Coming soon
- **Future Features**:
  - User preferences
  - Display settings
  - Data retention policies
  - Integration settings

### Export Page
- **Status**: Coming soon
- **Planned Features**:
  - Export to various formats (CSV, JSON, XML)
  - Scheduled exports
  - Email delivery
  - Filter before export

---

## 🔄 Common Features Across All Pages

### Navigation
- **Sidebar Menu**: Navigate between pages
- **Responsive**: Collapses on mobile devices
- **Active State**: Shows current page

### Header Bar
- **Title**: Shows PO Management System
- **User Menu**: Account settings and logout

### Data Refresh
- **Refresh Button**: Available on all pages
- **Auto-loading**: Data loads automatically on page open
- **Cache**: Client-side caching for better performance

### Responsive Design
- **Desktop**: Full feature set
- **Tablet**: Optimized layout
- **Mobile**: Vertical stacking, touch-friendly

---

## 🎨 Visual Design

### Color Scheme
- **Primary**: Blue (#1890ff)
- **Success**: Green (#52c41a)
- **Warning**: Orange (#faad14)
- **Danger**: Red (#ff4d4f)
- **Info**: Cyan (#13c2c2)

### Status Colors
- **PENDING**: Orange
- **CONFIRMED**: Blue
- **IN_TRANSIT**: Cyan
- **DELIVERED**: Green
- **CANCELLED**: Red

### Typography
- **Headers**: 28px bold for page titles
- **Subheaders**: 18px bold for sections
- **Body**: 14px regular text
- **Small**: 12px for metadata

---

## ⌨️ Keyboard Shortcuts (Future Enhancement)

Planned shortcuts:
- `Ctrl + /`: Search
- `Ctrl + L`: Logout
- `Ctrl + E`: Export
- `Ctrl + R`: Refresh

---

## 🔐 Security Features

### API Security
- JWT token-based authentication (ready to implement)
- CORS protection
- Secure API communication

### Data Protection
- No sensitive data in local storage
- Automatic logout on token expiration
- Input validation on all forms

---

## 📱 Responsive Breakpoints

```css
Mobile: < 576px
Tablet: 576px - 992px
Desktop: > 992px
Large Desktop: > 1200px
```

---

## 🚀 Performance Features

### Optimization Techniques
1. **Code Splitting**: Pages load on demand
2. **Lazy Loading**: Charts load only when visible
3. **Pagination**: Large datasets split into pages
4. **Caching**: API responses cached locally
5. **Image Optimization**: Lightweight icons via Ant Design

### Load Times
- Dashboard: ~2-3 seconds (with data)
- Orders: ~2-3 seconds
- Import: ~1-2 seconds

---

## 🔗 API Integration

### Connected Endpoints

**Dashboard:**
- GET /purchase-orders (list all)
- GET /analytics/dashboard (metrics)

**Orders:**
- GET /purchase-orders (list, filter)
- GET /purchase-orders/{id} (details)
- POST /purchase-orders/{id}/status (update)
- GET /export/excel (download)

**Import:**
- POST /import/pdf (single upload)
- POST /import/batch (batch upload)
- GET /import/history (history)
- GET /import/{id} (details)

For complete API documentation, see: `../docs/api_docs.md`

---

## 📊 Data Formats

### Date Format
- Display: DD/MM/YYYY
- DateTime Display: DD/MM/YYYY HH:mm
- API: YYYY-MM-DD

### Currency Format
- Display: CURRENCY_CODE VALUE (e.g., USD 50,000.00)
- Decimal Places: 2
- Thousands Separator: Comma

### Number Format
- Percentages: With % suffix
- Orders/Quantities: No decimal places
- Values: 2 decimal places

---

## 🆘 Error Handling

### User-Friendly Error Messages
- Network errors show clear messages
- API errors mapped to user-friendly text
- Validation errors highlight problematic fields
- Failed imports show detailed error logs

### Error Recovery
- Automatic retry on network failures
- Clear retry buttons
- Data persistence (forms don't lose input)

---

## 📈 Future Enhancements

### Planned Features
1. **Real-time Updates**: WebSocket for live data
2. **Advanced Analytics**: More chart types and custom dashboards
3. **Notifications**: Email and push notifications
4. **Mobile App**: React Native mobile application
5. **API Authentication**: Full JWT authentication UI
6. **Data Validation**: Rules configuration
7. **Audit Logs**: Track data changes
8. **Custom Reports**: User-defined reports

---

**Last Updated**: April 2024
**Version**: 1.0.0
