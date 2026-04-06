package com.intosourcing.repository;

import com.intosourcing.model.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {
    Optional<PurchaseOrder> findByOrderNumber(String orderNumber);

    List<PurchaseOrder> findBySupplierId(Long supplierId);

    List<PurchaseOrder> findByBuyerId(Long buyerId);

    List<PurchaseOrder> findByOrderDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT po FROM PurchaseOrder po WHERE po.supplier.id = :supplierId " +
           "AND po.orderDate BETWEEN :startDate AND :endDate")
    List<PurchaseOrder> findBySupplierAndDateRange(
        @Param("supplierId") Long supplierId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT po FROM PurchaseOrder po WHERE po.status = :status")
    List<PurchaseOrder> findByStatus(@Param("status") PurchaseOrder.OrderStatus status);
}

