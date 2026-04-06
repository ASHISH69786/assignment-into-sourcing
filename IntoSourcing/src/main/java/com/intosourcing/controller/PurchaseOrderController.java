package com.intosourcing.controller;

import com.intosourcing.model.dto.PurchaseOrderDTO;
import com.intosourcing.model.entity.PurchaseOrder;
import com.intosourcing.repository.PurchaseOrderRepository;
import com.intosourcing.service.AnalyticsService;
import com.intosourcing.service.CurrencyConversionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/purchase-orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final AnalyticsService analyticsService;
    private final CurrencyConversionService currencyConversionService;

    public PurchaseOrderController(PurchaseOrderRepository purchaseOrderRepository,
                                  AnalyticsService analyticsService,
                                  CurrencyConversionService currencyConversionService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.analyticsService = analyticsService;
        this.currencyConversionService = currencyConversionService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrderDTO>> getAllPurchaseOrders() {
        List<PurchaseOrder> orders = purchaseOrderRepository.findAll();
        List<PurchaseOrderDTO> dtos = orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderDTO> getPurchaseOrderById(@PathVariable Long id) {
        return purchaseOrderRepository.findById(id)
                .map(po -> ResponseEntity.ok(convertToDTO(po)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<PurchaseOrderDTO> getPurchaseOrderByNumber(@PathVariable String orderNumber) {
        return purchaseOrderRepository.findByOrderNumber(orderNumber)
                .map(po -> ResponseEntity.ok(convertToDTO(po)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<List<PurchaseOrderDTO>> getPurchaseOrdersBySupplier(@PathVariable Long supplierId) {
        List<PurchaseOrder> orders = purchaseOrderRepository.findBySupplierId(supplierId);
        List<PurchaseOrderDTO> dtos = orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<PurchaseOrderDTO>> getPurchaseOrdersByBuyer(@PathVariable Long buyerId) {
        List<PurchaseOrder> orders = purchaseOrderRepository.findByBuyerId(buyerId);
        List<PurchaseOrderDTO> dtos = orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<PurchaseOrderDTO>> getPurchaseOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PurchaseOrder> orders = purchaseOrderRepository.findByOrderDateBetween(startDate, endDate);
        List<PurchaseOrderDTO> dtos = orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<PurchaseOrderDTO>> getPurchaseOrdersByStatus(@PathVariable String status) {
        try {
            PurchaseOrder.OrderStatus orderStatus = PurchaseOrder.OrderStatus.valueOf(status.toUpperCase());
            List<PurchaseOrder> orders = purchaseOrderRepository.findByStatus(orderStatus);
            List<PurchaseOrderDTO> dtos = orders.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<PurchaseOrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            return purchaseOrderRepository.findById(id)
                    .map(po -> {
                        po.setStatus(PurchaseOrder.OrderStatus.valueOf(status.toUpperCase()));
                        PurchaseOrder updated = purchaseOrderRepository.save(po);
                        return ResponseEntity.ok(convertToDTO(updated));
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/convert-currency")
    public ResponseEntity<Map<String, Object>> convertOrderCurrency(
            @PathVariable Long id,
            @RequestParam String targetCurrency) {
        return purchaseOrderRepository.findById(id)
                .map(po -> {
                    BigDecimal convertedValue = currencyConversionService.convertCurrency(
                            po.getTotalOrderValue(),
                            po.getCurrency(),
                            targetCurrency
                    );

                    Map<String, Object> result = new HashMap<>();
                    result.put("orderNumber", po.getOrderNumber());
                    result.put("originalValue", po.getTotalOrderValue());
                    result.put("originalCurrency", po.getCurrency());
                    result.put("convertedValue", convertedValue);
                    result.put("convertedCurrency", targetCurrency);
                    result.put("exchangeRate", convertedValue.divide(po.getTotalOrderValue(), 4, java.math.RoundingMode.HALF_UP));

                    return ResponseEntity.ok(result);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private PurchaseOrderDTO convertToDTO(PurchaseOrder po) {
        PurchaseOrderDTO dto = new PurchaseOrderDTO();
        dto.setId(po.getId());
        dto.setOrderNumber(po.getOrderNumber());
        dto.setSupplierId(po.getSupplier().getId());
        dto.setSupplierName(po.getSupplier().getName());
        dto.setBuyerId(po.getBuyer().getId());
        dto.setBuyerName(po.getBuyer().getName());
        dto.setOrderDate(po.getOrderDate());
        dto.setConfirmedExFactoryDate(po.getConfirmedExFactoryDate());
        dto.setExpectedDeliveryDate(po.getExpectedDeliveryDate());
        dto.setActualDeliveryDate(po.getActualDeliveryDate());
        dto.setTotalOrderValue(po.getTotalOrderValue());
        dto.setCurrency(po.getCurrency());
        dto.setStatus(po.getStatus().name());
        dto.setNotes(po.getNotes());
        dto.setSourceFile(po.getSourceFile());
        dto.setCreatedAt(po.getCreatedAt());
        dto.setUpdatedAt(po.getUpdatedAt());
        return dto;
    }
}

