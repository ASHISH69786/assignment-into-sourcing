# Purchase Order Data Management System

A comprehensive, production-ready system for extracting purchase order data from PDF files, storing it in a relational database, and visualizing it through a web-based dashboard.

## Features

### 1. **PDF Data Extraction**
- Intelligent PDF text parsing using Apache PDFBox
- Regex-based field extraction for order details
- Support for multiple orders per PDF file
- Robust error handling and logging

### 2. **Data Transformation & Standardization**
- Automatic normalization of supplier, brand, buyer, and category information
- Date format standardization (handles multiple formats)
- Currency and price normalization
- Duplicate detection and prevention
- Comprehensive validation framework

### 3. **Database & Storage**
- PostgreSQL relational database with optimized schema
- Full ACID compliance for data integrity
- Indexed queries for high-performance lookups
- Audit trail with timestamps for all records
- Support for order status tracking

### 4. **REST API**
- Full CRUD operations for purchase orders
- Advanced filtering by supplier, buyer, date range, and status
- Real-time currency conversion endpoints
- Analytics and reporting endpoints
- Batch import capabilities

### 5. Web Dashboard (React) - Frontend Tasks Listed
- Separate frontend project to be developed
- See **FRONTEND_TASKS.md** for detailed requirements
- Real-time metrics and KPIs
- Interactive charts using Recharts
- Order management interface with filtering
- PDF upload and import functionality
- Import history tracking
- Note: Frontend repository should be created separately

### 6. **Currency Conversion**
- Live exchange rate API integration (Open Exchange Rates / Fixer.io)
- Caching mechanism (1-hour cache)
- Support for USD to GBP and other major currencies
- Fallback to 1:1 rate if API unavailable

### 7. **Analytics & Insights**
- Total order count and value
- Supplier performance metrics
- Delivery timeline analysis (on-time vs late)
- Date range analytics
- Buyer segmentation
- Real-time dashboard updates

## Architecture

```
IntoSourcing/
├── src/main/java/com/intosourcing/
│   ├── PurchaseOrderApplication.java          # Spring Boot entry point
│   ├── controller/                            # REST API controllers
│   │   ├── PurchaseOrderController.java
│   │   ├── DataImportController.java
│   │   └── AnalyticsController.java
│   ├── service/                               # Business logic
│   │   ├── DataImportService.java
│   │   ├── AnalyticsService.java
│   │   ├── CurrencyConversionService.java
│   │   ├── extraction/
│   │   │   └── PDFExtractionService.java
│   │   └── transformation/
│   │       └── DataTransformationService.java
│   ├── model/
│   │   ├── entity/                            # JPA entities
│   │   │   ├── PurchaseOrder.java
│   │   │   ├── OrderItem.java
│   │   │   ├── Product.java
│   │   │   ├── Supplier.java
│   │   │   ├── Brand.java
│   │   │   ├── Buyer.java
│   │   │   ├── Category.java
│   │   │   └── DataImport.java
│   │   └── dto/                               # Data Transfer Objects
│   │       ├── PurchaseOrderDTO.java
│   │       └── OrderItemDTO.java
│   └── repository/                            # Data access layer
│       └── Repositories.java
├── frontend/                                   # React dashboard
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Orders.js
│   │   │   └── DataImport.js
│   │   ├── services/
│   │   │   └── ApiService.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── pom.xml                                     # Maven dependencies
├── docker-compose.yml                          # Docker orchestration
└── Dockerfile                                  # Backend container
```

## Technology Stack

### Backend
- **Framework:** Spring Boot 3.2.0
- **Language:** Java 21
- **ORM:** Spring Data JPA / Hibernate
- **Database:** PostgreSQL 15
- **PDF Processing:** Apache PDFBox 3.0.1
- **Security:** Spring Security + JWT
- **API:** REST with Spring Web
- **Build:** Maven 3.9.0

### Frontend
- **Framework:** React 18.2.0
- **UI Library:** Ant Design 5.11.0
- **Charts:** Recharts 2.10.0
- **HTTP:** Axios 1.6.0
- **Routing:** React Router 6.20.0
- **Build:** react-scripts 5.0.1

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Web Server:** Embedded Tomcat (Spring Boot)
- **Reverse Proxy:** (Optional Nginx for production)

## Database Schema

### Tables
1. **suppliers** - Supplier information with contact details
2. **brands** - Brand master data
3. **buyers** - Buyer information
4. **categories** - Product categories
5. **products** - Product master with style numbers
6. **purchase_orders** - Main PO records with status tracking
7. **order_items** - Individual line items for each PO
8. **data_imports** - Import history and audit trail

### Key Relationships
- PurchaseOrder → Supplier (N:1)
- PurchaseOrder → Buyer (N:1)
- OrderItem → PurchaseOrder (N:1)
- OrderItem → Product (N:1)
- Product → Brand (N:1)
- Product → Category (N:1)

## API Endpoints

### Purchase Orders
- `GET /api/purchase-orders` - Get all orders
- `GET /api/purchase-orders/{id}` - Get order by ID
- `GET /api/purchase-orders/number/{orderNumber}` - Get by order number
- `GET /api/purchase-orders/supplier/{supplierId}` - Get by supplier
- `GET /api/purchase-orders/buyer/{buyerId}` - Get by buyer
- `GET /api/purchase-orders/date-range?startDate=&endDate=` - Filter by date
- `GET /api/purchase-orders/status/{status}` - Filter by status
- `POST /api/purchase-orders/{id}/status` - Update order status
- `POST /api/purchase-orders/{id}/convert-currency` - Convert currency

### Import
- `POST /api/import/pdf` - Upload and import single PDF
- `POST /api/import/batch` - Upload and import multiple PDFs
- `GET /api/import/history` - Get import history
- `GET /api/import/{importId}` - Get import details

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard metrics
- `GET /api/analytics/supplier/{supplierId}` - Get supplier analytics
- `GET /api/analytics/date-range?startDate=&endDate=` - Get date range analytics

## Setup Instructions

### Prerequisites
- Java 21+
- Maven 3.9.0+
- PostgreSQL 15+ (or Docker for containerized setup)
- Node.js 18+ (for frontend development)
- Docker & Docker Compose (optional, for containerized deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   cd /Users/ashishkumarsharma/Desktop/Assignment/IntoSourcing
   ```

2. **Set up PostgreSQL**
   ```bash
   # Using Docker
   docker run --name postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=intosourcing -p 5432:5432 -d postgres:15-alpine
   ```

3. **Build the backend**
   ```bash
   mvn clean package
   ```

4. **Run the backend**
   ```bash
   mvn spring-boot:run
   ```
   Backend will be available at `http://localhost:8080/api`

5. **Set up the frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend will be available at `http://localhost:3000`

### Docker Compose Deployment

1. **Build and start all services**
   ```bash
   docker-compose up --build
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api
   - PostgreSQL: localhost:5432

3. **Stop services**
   ```bash
   docker-compose down
   ```

## PDF Import Workflow

1. **Upload PDF** → User uploads PDF file via dashboard
2. **Extract Text** → PDFBox extracts all text from PDF
3. **Parse Fields** → Regex patterns extract order details
4. **Validate Data** → Comprehensive validation checks
5. **Transform** → Normalize and standardize data
6. **Create References** → Auto-create suppliers, brands, buyers, categories if needed
7. **Save to DB** → Store PO, products, and order items
8. **Log Results** → Track import history and errors

## Configuration

### Environment Variables
```
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/intosourcing
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres

# Currency API
CURRENCY_API_KEY=your_api_key_here

# JWT Secret (change in production!)
JWT_SECRET=your-secret-key-change-in-production

# File Upload
FILE_UPLOAD_DIR=uploads/
```

### Application Properties (application.properties)
- Server port: 8080
- Context path: /api
- JPA DDL auto: update
- Logging level: INFO (DEBUG for com.intosourcing)

## Security Considerations

1. **Change JWT secret in production** - Use strong, random 256+ bit key
2. **Enable HTTPS** - Use SSL/TLS in production
3. **Database credentials** - Use environment variables, never hardcode
4. **Input validation** - All inputs are validated against injection attacks
5. **CORS** - Configure allowed origins in production
6. **File uploads** - Validate file types and sizes
7. **API rate limiting** - Consider implementing in production

## Performance Optimization

1. **Database Indexing** - Indexes on frequently queried fields
2. **Query Optimization** - Custom queries for complex filters
3. **Caching** - Currency rates cached for 1 hour
4. **Batch Operations** - Support for batch PDF imports
5. **Pagination** - Table pagination for large datasets
6. **Lazy Loading** - Relationships configured for optimal loading

## Troubleshooting

### Database Connection Issues
```bash
# Test connection
psql -h localhost -U postgres -d intosourcing
```

### PDF Extraction Not Working
- Check PDF file format (must be text-extractable PDF)
- Review logs in `uploads/` directory
- Validate regex patterns in PDFExtractionService.java

### Frontend Not Loading
```bash
# Clear node modules and reinstall
cd frontend
rm -rf node_modules
npm install
npm start
```

### Port Already in Use
```bash
# Kill process on port
lsof -ti:8080 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

## Testing

### Sample PDF Files
The system includes sample PDFs in `/resources`:
- AMP0200A_PrettyLittleThing_Multi_0070034454_v1.pdf
- NAD0200A_coast_CST Petite_BCC13582_Petite Printed Floral Mesh Midaxi Dress_0003429730_v3.pdf
- NAM002_boohoo_Dresses_HZZ53685_Linen Look Puff Sleeve Shirred Maxi Dres_0003433306_v1 (1).pdf

### Import Test
1. Go to http://localhost:3000/import
2. Upload one of the sample PDFs
3. Verify data appears in Dashboard and Orders pages

## Future Enhancements

1. **Advanced NLP** - Use ML for better field extraction
2. **OCR Support** - Extract from image-based PDFs
3. **Workflow Management** - Custom approval workflows
4. **Email Notifications** - Automated alerts
5. **Mobile App** - Native mobile application
6. **Advanced Analytics** - Predictive analytics and forecasting
7. **Audit Trail** - Detailed change logs
8. **API Documentation** - Swagger/OpenAPI integration
9. **Scheduled Imports** - SFTP/Email based automated imports
10. **Multi-language** - Internationalization support

## Support & Documentation

For issues or questions:
1. Check logs in `application-error.log`
2. Review the architecture diagram above
3. Check API endpoint documentation
4. Review sample PDF structure


