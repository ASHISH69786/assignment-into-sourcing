# Purchase Order System - API Contract

## Base URL
```
http://localhost:8080/api
```

---

## Table of Contents
1. [Purchase Orders API](#purchase-orders-api)
2. [Analytics API](#analytics-api)
3. [Data Import API](#data-import-api)
4. [Export API](#export-api)

---

## Purchase Orders API

**Base Path:** `/api/purchase-orders`

### 1. Get All Purchase Orders
- **Endpoint:** `GET /purchase-orders`
- **Description:** Retrieve all purchase orders
- **Request Parameters:** None
- **Response:** 
  - **Status:** 200 OK
  - **Content-Type:** application/json
  - **Body:**
    ```json
    [
      {
        "id": "string",
        "orderNumber": "string",
        "supplierId": "string",
        "supplierName": "string",
        "buyerId": "string",
        "buyerName": "string",
        "orderDate": "2024-01-15",
        "confirmedExFactoryDate": "2024-01-20",
        "expectedDeliveryDate": "2024-02-15",
        "actualDeliveryDate": "2024-02-14",
        "totalOrderValue": 10000.00,
        "currency": "USD",
        "status": "PENDING",
        "notes": "string",
        "sourceFile": "string",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    ]
    ```

### 2. Get Purchase Order by ID
- **Endpoint:** `GET /purchase-orders/{id}`
- **Description:** Retrieve a specific purchase order by ID
- **Path Parameters:**
  - `id` (string, required): Purchase order MongoDB ID
- **Response:** 
  - **Status:** 200 OK or 404 Not Found
  - **Body:** Single PurchaseOrderDTO object (same structure as above)

### 3. Get Purchase Order by Order Number
- **Endpoint:** `GET /purchase-orders/number/{orderNumber}`
- **Description:** Retrieve purchase order by order number
- **Path Parameters:**
  - `orderNumber` (string, required): Purchase order number
- **Response:** 
  - **Status:** 200 OK or 404 Not Found
  - **Body:** Single PurchaseOrderDTO object

### 4. Get Purchase Orders by Supplier
- **Endpoint:** `GET /purchase-orders/supplier/{supplierId}`
- **Description:** Get all purchase orders from a specific supplier
- **Path Parameters:**
  - `supplierId` (string, required): Supplier ID
- **Response:** 
  - **Status:** 200 OK
  - **Body:** Array of PurchaseOrderDTO objects

### 5. Get Purchase Orders by Buyer
- **Endpoint:** `GET /purchase-orders/buyer/{buyerId}`
- **Description:** Get all purchase orders for a specific buyer
- **Path Parameters:**
  - `buyerId` (string, required): Buyer ID
- **Response:** 
  - **Status:** 200 OK
  - **Body:** Array of PurchaseOrderDTO objects

### 6. Get Purchase Orders by Date Range
- **Endpoint:** `GET /purchase-orders/date-range`
- **Description:** Retrieve purchase orders within a date range
- **Query Parameters:**
  - `startDate` (date, required, format: YYYY-MM-DD): Start date for filtering
  - `endDate` (date, required, format: YYYY-MM-DD): End date for filtering
- **Response:** 
  - **Status:** 200 OK
  - **Body:** Array of PurchaseOrderDTO objects

**Example Request:**
```
GET /purchase-orders/date-range?startDate=2024-01-01&endDate=2024-12-31
```

### 7. Get Purchase Orders by Status
- **Endpoint:** `GET /purchase-orders/status/{status}`
- **Description:** Retrieve purchase orders with a specific status
- **Path Parameters:**
  - `status` (string, required): Order status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- **Response:** 
  - **Status:** 200 OK or 400 Bad Request
  - **Body:** Array of PurchaseOrderDTO objects

### 8. Update Order Status
- **Endpoint:** `POST /purchase-orders/{id}/status`
- **Description:** Update the status of a purchase order
- **Path Parameters:**
  - `id` (string, required): Purchase order ID
- **Query Parameters:**
  - `status` (string, required): New status (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- **Response:** 
  - **Status:** 200 OK or 404 Not Found or 400 Bad Request
  - **Body:** Updated PurchaseOrderDTO object

**Example Request:**
```
POST /purchase-orders/507f1f77bcf86cd799439011/status?status=DELIVERED
```

### 9. Convert Order Currency
- **Endpoint:** `POST /purchase-orders/{id}/convert-currency`
- **Description:** Convert purchase order value to a different currency
- **Path Parameters:**
  - `id` (string, required): Purchase order ID
- **Query Parameters:**
  - `targetCurrency` (string, required): Target currency code (e.g., USD, EUR, GBP, INR)
- **Response:** 
  - **Status:** 200 OK or 404 Not Found
  - **Content-Type:** application/json
  - **Body:**
    ```json
    {
      "orderNumber": "PO-2024-001",
      "originalValue": 10000.00,
      "originalCurrency": "USD",
      "convertedValue": 8500.00,
      "convertedCurrency": "EUR",
      "exchangeRate": 0.8500
    }
    ```

**Example Request:**
```
POST /purchase-orders/507f1f77bcf86cd799439011/convert-currency?targetCurrency=EUR
```

---

## Analytics API

**Base Path:** `/api/analytics`

### 1. Get Dashboard Metrics
- **Endpoint:** `GET /analytics/dashboard`
- **Description:** Retrieve overall dashboard metrics and KPIs
- **Request Parameters:** None
- **Response:** 
  - **Status:** 200 OK or 500 Internal Server Error
  - **Content-Type:** application/json
  - **Body:**
    ```json
    {
      "totalOrders": 150,
      "totalOrderValue": 1500000.00,
      "averageOrderValue": 10000.00,
      "totalSuppliers": 25,
      "totalBuyers": 10,
      "statusBreakdown": {
        "PENDING": 20,
        "CONFIRMED": 50,
        "SHIPPED": 40,
        "DELIVERED": 35,
        "CANCELLED": 5
      },
      "ordersByStatus": {...},
      "ordersBySupplier": {...},
      "ordersByBuyer": {...},
      "onTimeDeliveryRate": 92.5
    }
    ```

### 2. Get Supplier Analytics
- **Endpoint:** `GET /analytics/supplier/{supplierId}`
- **Description:** Retrieve analytics for a specific supplier
- **Path Parameters:**
  - `supplierId` (string, required): Supplier ID
- **Response:** 
  - **Status:** 200 OK or 500 Internal Server Error
  - **Body:**
    ```json
    {
      "supplierId": "string",
      "supplierName": "string",
      "totalOrders": 25,
      "totalOrderValue": 250000.00,
      "averageOrderValue": 10000.00,
      "onTimeDeliveryCount": 23,
      "lateDeliveryCount": 2,
      "statusBreakdown": {...},
      "averageDeliveryDelay": 2.5
    }
    ```

### 3. Get Date Range Analytics
- **Endpoint:** `GET /analytics/date-range`
- **Description:** Retrieve analytics for orders within a date range
- **Query Parameters:**
  - `startDate` (date, required, format: YYYY-MM-DD): Start date
  - `endDate` (date, required, format: YYYY-MM-DD): End date
- **Response:** 
  - **Status:** 200 OK or 500 Internal Server Error
  - **Body:**
    ```json
    {
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "totalOrders": 100,
      "totalOrderValue": 1000000.00,
      "averageOrderValue": 10000.00,
      "totalSuppliers": 20,
      "totalBuyers": 8,
      "statusBreakdown": {...},
      "ordersByStatus": {...}
    }
    ```

**Example Request:**
```
GET /analytics/date-range?startDate=2024-01-01&endDate=2024-12-31
```

---

## Data Import API

**Base Path:** `/api/import`

### 1. Import Single PDF
- **Endpoint:** `POST /import/pdf`
- **Description:** Import purchase order data from a PDF file
- **Content-Type:** multipart/form-data
- **Request Parameters:**
  - `file` (file, required): PDF file to upload (max 50MB)
- **Response:** 
  - **Status:** 200 OK or 500 Internal Server Error
  - **Body:**
    ```json
    {
      "success": true,
      "message": "PDF imported successfully",
      "importId": "507f1f77bcf86cd799439011",
      "totalRecords": 150,
      "successfulRecords": 145,
      "failedRecords": 5,
      "status": "COMPLETED",
      "errors": [
        {
          "rowNumber": 10,
          "errorMessage": "Invalid supplier ID"
        }
      ]
    }
    ```

**Example cURL Request:**
```bash
curl -X POST "http://localhost:8080/api/import/pdf" \
  -F "file=@path/to/file.pdf"
```

### 2. Import Batch PDFs
- **Endpoint:** `POST /import/batch`
- **Description:** Import data from multiple PDF files
- **Content-Type:** multipart/form-data
- **Request Parameters:**
  - `files` (files, required): Multiple PDF files to upload
- **Response:** 
  - **Status:** 200 OK or 500 Internal Server Error
  - **Body:**
    ```json
    {
      "success": true,
      "totalFiles": 3,
      "processedFiles": 3,
      "successfulImports": 3,
      "details": {
        "file1.pdf": {
          "importId": "507f1f77bcf86cd799439011",
          "totalRecords": 50,
          "successfulRecords": 48,
          "failedRecords": 2,
          "status": "COMPLETED"
        },
        "file2.pdf": {
          "importId": "507f1f77bcf86cd799439012",
          "totalRecords": 75,
          "successfulRecords": 75,
          "failedRecords": 0,
          "status": "COMPLETED"
        }
      }
    }
    ```

**Example cURL Request:**
```bash
curl -X POST "http://localhost:8080/api/import/batch" \
  -F "files=@file1.pdf" \
  -F "files=@file2.pdf" \
  -F "files=@file3.pdf"
```

### 3. Get Import History
- **Endpoint:** `GET /import/history`
- **Description:** Retrieve history of all imports
- **Request Parameters:** None
- **Response:** 
  - **Status:** 200 OK
  - **Body:**
    ```json
    [
      {
        "id": "507f1f77bcf86cd799439011",
        "fileName": "purchase_orders_jan.pdf",
        "status": "COMPLETED",
        "totalRecords": 150,
        "successfulRecords": 145,
        "failedRecords": 5,
        "importedAt": "2024-01-15T10:30:00Z"
      }
    ]
    ```

### 4. Get Import Details
- **Endpoint:** `GET /import/{importId}`
- **Description:** Retrieve details of a specific import
- **Path Parameters:**
  - `importId` (string, required): Import record ID
- **Response:** 
  - **Status:** 200 OK or 404 Not Found
  - **Body:**
    ```json
    {
      "id": "507f1f77bcf86cd799439011",
      "fileName": "purchase_orders_jan.pdf",
      "status": "COMPLETED",
      "totalRecords": 150,
      "successfulRecords": 145,
      "failedRecords": 5,
      "importedAt": "2024-01-15T10:30:00Z",
      "errorLog": [
        {
          "rowNumber": 10,
          "errorMessage": "Invalid supplier ID"
        }
      ]
    }
    ```

---

## Export API

**Base Path:** `/api/export`

### 1. Export to Excel
- **Endpoint:** `GET /export/excel`
- **Description:** Export all purchase orders to Excel file
- **Request Parameters:** None
- **Response:** 
  - **Status:** 200 OK or 500 Internal Server Error
  - **Content-Type:** application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
  - **Headers:** 
    ```
    Content-Disposition: attachment; filename="purchase_orders.xlsx"
    ```
  - **Body:** Binary Excel file data

**Example cURL Request:**
```bash
curl -X GET "http://localhost:8080/api/export/excel" \
  -o purchase_orders.xlsx
```

### 2. Export to CSV
- **Endpoint:** `GET /export/csv`
- **Description:** Export all purchase orders to CSV file
- **Request Parameters:** None
- **Response:** 
  - **Status:** 200 OK or 500 Internal Server Error
  - **Content-Type:** text/csv; charset=UTF-8
  - **Headers:** 
    ```
    Content-Disposition: attachment; filename="purchase_orders.csv"
    ```
  - **Body:** CSV text data

**Example cURL Request:**
```bash
curl -X GET "http://localhost:8080/api/export/csv" \
  -o purchase_orders.csv
```

---

## Common Response Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid parameters |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error occurred |

---

## CORS Configuration

All endpoints have CORS enabled for all origins (`*`). This means requests from any domain are allowed.

---

## Authentication

Currently, the API has **NO authentication or security** configured. All endpoints are publicly accessible.

---

## Notes

- All dates are in ISO 8601 format: `YYYY-MM-DD`
- Timestamps are in UTC with timezone information: `YYYY-MM-DDTHH:mm:ssZ`
- All monetary values are BigDecimal (numbers)
- Order statuses: `PENDING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`
- Supported currencies: USD, EUR, GBP, INR, etc. (via Currency Conversion API)
- File upload limit: 50MB per file
- Base context path: `/api` (configured in application.properties)

---

## Integration Notes

- MongoDB is used for data persistence
- Exchange rate API is used for currency conversion
- PDF extraction uses Apache PDFBox and Tika for text extraction
- Excel export uses Apache POI

