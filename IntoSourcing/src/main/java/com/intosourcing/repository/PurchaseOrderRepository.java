package com.intosourcing.repository;

import com.intosourcing.model.entity.PurchaseOrder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends MongoRepository<PurchaseOrder, String> {
    Optional<PurchaseOrder> findByOrderNumber(String orderNumber);

    List<PurchaseOrder> findBySupplier(String supplierId);

    List<PurchaseOrder> findByBuyer(String buyerId);

    List<PurchaseOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("{ 'supplier.$id': ?0, 'orderDate': { $gte: ?1, $lte: ?2 } }")
    List<PurchaseOrder> findBySupplierAndDateRange(String supplierId, LocalDate startDate, LocalDate endDate);

    @Query("{ 'status': ?0 }")
    List<PurchaseOrder> findByStatus(PurchaseOrder.OrderStatus status);

    List<PurchaseOrder> findByStatus(String status);
}

