package com.intosourcing.repository;

import com.intosourcing.model.entity.OrderItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends MongoRepository<OrderItem, String> {
    List<OrderItem> findByPurchaseOrder(String purchaseOrderId);
}

