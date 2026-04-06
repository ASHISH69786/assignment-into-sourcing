package com.intosourcing.repository;

import com.intosourcing.model.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByCode(String code);
    Optional<Supplier> findByName(String name);
}

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByCode(String code);
    Optional<Brand> findByName(String name);
}

@Repository
public interface BuyerRepository extends JpaRepository<Buyer, Long> {
    Optional<Buyer> findByCode(String code);
    Optional<Buyer> findByName(String name);
}

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByCode(String code);
    Optional<Category> findByName(String name);
}

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByStyleNumber(String styleNumber);
}

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    java.util.List<OrderItem> findByPurchaseOrderId(Long purchaseOrderId);
}

@Repository
public interface DataImportRepository extends JpaRepository<DataImport, Long> {
    java.util.Optional<DataImport> findBySourceFile(String sourceFile);
}

