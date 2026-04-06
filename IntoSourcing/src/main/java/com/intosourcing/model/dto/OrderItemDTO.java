package com.intosourcing.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDTO {
    private Long id;
    private Long purchaseOrderId;
    private Long productId;
    private String styleNumber;
    private String productName;
    private Integer orderQuantity;
    private BigDecimal unitPrice;
    private String currency;
    private BigDecimal totalPrice;
    private Integer receivedQuantity;
    private String size;
    private String color;
    private String notes;
}

