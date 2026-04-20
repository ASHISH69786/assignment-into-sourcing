package com.intosourcing.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Document(collection = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    private String id;

    @DBRef
    private PurchaseOrder purchaseOrder;

    @DBRef
    private Product product;

    private Integer orderQuantity;

    private BigDecimal unitPrice;

    private String currency = "USD";

    private BigDecimal totalPrice;

    private Integer receivedQuantity = 0;

    private String size;

    private String color;

    private String notes;
    private boolean active;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

