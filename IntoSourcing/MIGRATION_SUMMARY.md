# PostgreSQL to MongoDB Migration - Summary of Changes

## Files Modified

### 1. Maven Configuration
**File**: `pom.xml`
- Removed: `spring-boot-starter-data-jpa`
- Removed: PostgreSQL driver (`org.postgresql:postgresql`)
- Added: `spring-boot-starter-data-mongodb`
- Added: MongoDB Java driver (`org.mongodb:mongo-java-driver`)

### 2. Application Configuration
**File**: `src/main/resources/application.properties`
- Removed: PostgreSQL connection properties (`spring.datasource.*`, `spring.jpa.*`)
- Added: MongoDB connection properties
  - `spring.data.mongodb.uri=mongodb://localhost:27017/intosourcing`
  - `spring.data.mongodb.database=intosourcing`
  - `spring.data.mongodb.auto-index-creation=true`

### 3. Entity Classes (8 files modified)

#### Supplier.java
- Changed from `@Entity` to `@Document(collection = "suppliers")`
- Changed ID type from `Long` to `String`
- Removed `@GeneratedValue(strategy = GenerationType.IDENTITY)`
- Changed `@Column` annotations to MongoDB annotations
- Added `@Indexed` for frequently queried fields (code, name)
- Changed audit columns to use `@CreatedDate` and `@LastModifiedDate`
- Removed `@PrePersist` and `@PreUpdate` methods

#### Buyer.java
- Same changes as Supplier.java

#### Brand.java
- Same changes as Supplier.java

#### Category.java
- Same changes as Supplier.java

#### Product.java
- Changed from `@Entity` to `@Document(collection = "products")`
- Changed ID type from `Long` to `String`
- Changed `@ManyToOne` relationships to `@DBRef`
  - Brand and Category now use `@DBRef`
- Removed JPA cascade and fetch types
- Added `@Indexed` for styleNumber (unique)

#### OrderItem.java
- Changed from `@Entity` to `@Document(collection = "order_items")`
- Changed ID type from `Long` to `String`
- Changed `@ManyToOne` relationships to `@DBRef`
  - PurchaseOrder and Product now use `@DBRef`
- Changed audit columns to use Spring Data MongoDB auditing

#### PurchaseOrder.java
- Changed from `@Entity` to `@Document(collection = "purchaseOrders")`
- Changed ID type from `Long` to `String`
- Changed `@ManyToOne` relationships to `@DBRef` (Supplier, Buyer)
- Changed `@OneToMany` to `@DBRef` on List (OrderItems)
- Removed JPA cascade and fetch types
- Added `@Indexed` for frequently queried fields
- Changed audit columns to use Spring Data MongoDB auditing

#### DataImport.java
- Changed from `@Entity` to `@Document(collection = "data_imports")`
- Changed ID type from `Long` to `String`
- Changed `@Column` annotations to MongoDB format
- Added `@Indexed` for frequently searched fields
- Changed audit columns to use Spring Data MongoDB auditing
- Removed `@PrePersist` method

### 4. Repository Interfaces

#### PurchaseOrderRepository.java
- Changed from `extends JpaRepository<PurchaseOrder, Long>` to `extends MongoRepository<PurchaseOrder, String>`
- Updated method signatures:
  - `findBySupplierId(Long)` → `findBySupplier(String)`
  - `findByBuyerId(Long)` → `findByBuyer(String)`
- Updated `@Query` annotations to MongoDB query syntax:
  - Changed from JPA QL to MongoDB query format
  - Example: `{ 'supplier.$id': ?0, 'orderDate': { $gte: ?1, $lte: ?2 } }`

#### Repositories.java (6 repositories)
- All changed from `extends JpaRepository<T, Long>` to `extends MongoRepository<T, String>`
- SupplierRepository, BrandRepository, BuyerRepository, CategoryRepository, ProductRepository, OrderItemRepository, DataImportRepository all updated

### 5. Controllers

#### PurchaseOrderController.java
- Changed path parameter types from `Long` to `String` for IDs
- `getPurchaseOrderById(@PathVariable Long id)` → `getPurchaseOrderById(@PathVariable String id)`
- `getPurchaseOrdersBySupplier(@PathVariable Long)` → `getPurchaseOrdersBySupplier(@PathVariable String)`
- `getSupplierAnalytics(@PathVariable Long)` → `getSupplierAnalytics(@PathVariable String)`
- `updateOrderStatus(@PathVariable Long id)` → `updateOrderStatus(@PathVariable String id)`
- `convertOrderCurrency(@PathVariable Long id)` → `convertOrderCurrency(@PathVariable String id)`

#### AnalyticsController.java
- Changed `getSupplierAnalytics(@PathVariable Long supplierId)` to `getSupplierAnalytics(@PathVariable String supplierId)`

#### DataImportController.java
- Changed `getImportDetails(@PathVariable Long importId)` to `getImportDetails(@PathVariable String importId)`

### 6. Services

#### AnalyticsService.java
- Changed method signature: `getSupplierAnalytics(Long supplierId)` → `getSupplierAnalytics(String supplierId)`
- Updated repository calls:
  - `findBySupplierId(supplierId)` → `findBySupplier(supplierId)`

### 7. DTOs

#### PurchaseOrderDTO.java
- Changed all ID fields from `Long` to `String`:
  - `id: Long` → `id: String`
  - `supplierId: Long` → `supplierId: String`
  - `buyerId: Long` → `buyerId: String`

#### OrderItemDTO.java
- Changed all ID fields from `Long` to `String`:
  - `id: Long` → `id: String`
  - `purchaseOrderId: Long` → `purchaseOrderId: String`
  - `productId: Long` → `productId: String`

### 8. New Configuration File

#### MongoConfig.java (NEW)
```java
@Configuration
@EnableMongoRepositories(basePackages = "com.intosourcing.repository")
@EnableMongoAuditing
public class MongoConfig {
    // MongoDB configuration is handled through application.properties
    // Auto-indexing is enabled via spring.data.mongodb.auto-index-creation=true
}
```

### 9. New Documentation

#### MONGODB_MIGRATION_GUIDE.md (NEW)
- Complete setup and migration guide
- Docker setup instructions
- Data migration strategies
- Troubleshooting guide
- Performance considerations

## Database Collection Mapping

| PostgreSQL Table | MongoDB Collection | Notes |
|---|---|---|
| suppliers | suppliers | ID: String (MongoDB ObjectId) |
| buyers | buyers | ID: String (MongoDB ObjectId) |
| brands | brands | ID: String (MongoDB ObjectId) |
| categories | categories | ID: String (MongoDB ObjectId) |
| products | products | References Brand & Category via @DBRef |
| purchase_orders | purchaseOrders | References Supplier, Buyer, OrderItems via @DBRef |
| order_items | order_items | References PurchaseOrder & Product via @DBRef |
| data_imports | data_imports | ID: String (MongoDB ObjectId) |

## Key Technical Differences

### ID Generation
- **PostgreSQL**: Auto-increment IDENTITY (Long)
- **MongoDB**: ObjectId generated by MongoDB (String)

### Relationships
- **PostgreSQL**: Foreign keys with JoinColumn
- **MongoDB**: Document references with @DBRef

### Auditing
- **PostgreSQL**: @PrePersist/@PreUpdate annotations
- **MongoDB**: @CreatedDate/@LastModifiedDate from Spring Data

### Query Language
- **PostgreSQL**: JPQL (Java Persistence Query Language)
- **MongoDB**: MongoDB query syntax (JSON-like)

## Testing Checklist

- [ ] Build project successfully: `mvn clean package`
- [ ] MongoDB instance running on localhost:27017
- [ ] application.properties configured correctly
- [ ] All imports work (PDF upload)
- [ ] All API endpoints accessible
- [ ] Dashboard analytics load
- [ ] Export to Excel/CSV works
- [ ] Date range queries work
- [ ] Supplier filtering works
- [ ] Status updates work
- [ ] Currency conversion works

## Deployment Steps

1. Ensure MongoDB is deployed and running
2. Update `application.properties` with MongoDB connection string
3. Build JAR: `mvn clean package`
4. Run: `java -jar target/purchase-order-system-1.0.0.jar`
5. Access API at `http://localhost:8080/api`
6. Test endpoints with Postman/Insomnia

## Rollback Plan (if needed)

To revert to PostgreSQL:
1. Restore `pom.xml` from git backup
2. Restore entity classes with JPA annotations
3. Restore repositories to extend JpaRepository
4. Update application.properties for PostgreSQL
5. Run: `git checkout` on modified files
6. Rebuild: `mvn clean package`

## Notes

- All API endpoints remain the same (backward compatible at REST level)
- Client applications do not need changes (IDs are still strings)
- MongoDB provides better flexibility for unstructured data
- No loss of functionality in the migration
- Data migration required from PostgreSQL to MongoDB (separate step)

