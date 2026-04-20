package com.intosourcing.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;

@Document(collection = "purchaseOrders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {
    @Id
    private String id;

    @Indexed(unique = true)
    private String orderNumber;

    @DBRef
    private Supplier supplier;

    @DBRef
    private Buyer buyer;

    private LocalDate orderDate;

    private LocalDate confirmedExFactoryDate;

    private LocalDate expectedDeliveryDate;

    private LocalDate actualDeliveryDate;

    private BigDecimal totalOrderValue;

    private String currency = "USD";

    private OrderStatus status = OrderStatus.PENDING;

    private String notes;

    private String sourceFile;

    @DBRef
    private List<OrderItem> orderItems;

    private Boolean active = true;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;


    public enum OrderStatus {
        PENDING, CONFIRMED, IN_TRANSIT, DELIVERED, CANCELLED
    }
}



