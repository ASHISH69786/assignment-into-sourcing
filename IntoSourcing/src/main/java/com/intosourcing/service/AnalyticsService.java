package com.intosourcing.service;

import com.intosourcing.model.entity.PurchaseOrder;
import com.intosourcing.repository.PurchaseOrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AnalyticsService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final CurrencyConversionService currencyConversionService;

    public AnalyticsService(PurchaseOrderRepository purchaseOrderRepository,
                           CurrencyConversionService currencyConversionService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.currencyConversionService = currencyConversionService;
    }

    public Map<String, Object> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        try {
            List<PurchaseOrder> allOrders = purchaseOrderRepository.findAll();

            // Total metrics
            metrics.put("totalOrders", allOrders.size());
            metrics.put("totalValue", calculateTotalValue(allOrders));
            metrics.put("totalQuantity", calculateTotalQuantity(allOrders));

            // Order count by supplier
            metrics.put("ordersBySupplier", getOrderCountBySupplier(allOrders));

            // Value by supplier
            metrics.put("valueBySupplier", getValueBySupplier(allOrders));

            // Order status breakdown
            metrics.put("statusBreakdown", getStatusBreakdown(allOrders));

            // Delivery timeline analysis
            metrics.put("deliveryAnalysis", getDeliveryAnalysis(allOrders));

            // Recent orders
            metrics.put("recentOrders", getRecentOrders(allOrders, 10));

            log.info("Dashboard metrics calculated successfully");
        } catch (Exception e) {
            log.error("Error calculating dashboard metrics", e);
        }

        return metrics;
    }

    public Map<String, Object> getSupplierAnalytics(Long supplierId) {
        Map<String, Object> analytics = new HashMap<>();

        List<PurchaseOrder> supplierOrders = purchaseOrderRepository.findBySupplierId(supplierId);

        analytics.put("totalOrders", supplierOrders.size());
        analytics.put("totalValue", calculateTotalValue(supplierOrders));
        analytics.put("totalQuantity", calculateTotalQuantity(supplierOrders));
        analytics.put("averageOrderValue", calculateAverageValue(supplierOrders));
        analytics.put("ordersByStatus", getStatusBreakdown(supplierOrders));
        analytics.put("deliveryPerformance", calculateDeliveryPerformance(supplierOrders));

        return analytics;
    }

    public Map<String, Object> getDateRangeAnalytics(LocalDate startDate, LocalDate endDate) {
        Map<String, Object> analytics = new HashMap<>();

        List<PurchaseOrder> rangeOrders = purchaseOrderRepository.findByOrderDateBetween(startDate, endDate);

        analytics.put("orderCount", rangeOrders.size());
        analytics.put("totalValue", calculateTotalValue(rangeOrders));
        analytics.put("ordersBySupplier", getOrderCountBySupplier(rangeOrders));
        analytics.put("valueBySupplier", getValueBySupplier(rangeOrders));
        analytics.put("ordersByBuyer", getOrderCountByBuyer(rangeOrders));

        return analytics;
    }

    private BigDecimal calculateTotalValue(List<PurchaseOrder> orders) {
        return orders.stream()
                .map(PurchaseOrder::getTotalOrderValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private int calculateTotalQuantity(List<PurchaseOrder> orders) {
        return orders.stream()
                .flatMap(po -> po.getOrderItems().stream())
                .mapToInt(oi -> oi.getOrderQuantity() != null ? oi.getOrderQuantity() : 0)
                .sum();
    }

    private BigDecimal calculateAverageValue(List<PurchaseOrder> orders) {
        if (orders.isEmpty()) return BigDecimal.ZERO;
        return calculateTotalValue(orders).divide(new BigDecimal(orders.size()), 2, java.math.RoundingMode.HALF_UP);
    }

    private Map<String, Integer> getOrderCountBySupplier(List<PurchaseOrder> orders) {
        return orders.stream()
                .collect(Collectors.groupingBy(
                        po -> po.getSupplier().getName(),
                        Collectors.summingInt(po -> 1)
                ))
                .entrySet()
                .stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }

    private Map<String, BigDecimal> getValueBySupplier(List<PurchaseOrder> orders) {
        return orders.stream()
                .collect(Collectors.groupingBy(
                        po -> po.getSupplier().getName(),
                        Collectors.reducing(BigDecimal.ZERO, PurchaseOrder::getTotalOrderValue, BigDecimal::add)
                ))
                .entrySet()
                .stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, LinkedHashMap::new));
    }

    private Map<String, Integer> getOrderCountByBuyer(List<PurchaseOrder> orders) {
        return orders.stream()
                .collect(Collectors.groupingBy(
                        po -> po.getBuyer().getName(),
                        Collectors.summingInt(po -> 1)
                ));
    }

    private Map<String, Integer> getStatusBreakdown(List<PurchaseOrder> orders) {
        return orders.stream()
                .collect(Collectors.groupingBy(
                        po -> po.getStatus().name(),
                        Collectors.summingInt(po -> 1)
                ));
    }

    private Map<String, Object> getDeliveryAnalysis(List<PurchaseOrder> orders) {
        Map<String, Object> analysis = new HashMap<>();

        long onTime = orders.stream()
                .filter(po -> po.getActualDeliveryDate() != null &&
                        !po.getActualDeliveryDate().isAfter(po.getExpectedDeliveryDate()))
                .count();

        long late = orders.stream()
                .filter(po -> po.getActualDeliveryDate() != null &&
                        po.getActualDeliveryDate().isAfter(po.getExpectedDeliveryDate()))
                .count();

        long pending = orders.stream()
                .filter(po -> po.getActualDeliveryDate() == null)
                .count();

        analysis.put("onTime", onTime);
        analysis.put("late", late);
        analysis.put("pending", pending);
        analysis.put("onTimePercentage", orders.isEmpty() ? 0 : (onTime * 100 / orders.size()));

        return analysis;
    }

    private Map<String, Object> calculateDeliveryPerformance(List<PurchaseOrder> orders) {
        Map<String, Object> performance = new HashMap<>();

        long onTime = orders.stream()
                .filter(po -> po.getActualDeliveryDate() != null &&
                        !po.getActualDeliveryDate().isAfter(po.getExpectedDeliveryDate()))
                .count();

        performance.put("totalOrders", orders.size());
        performance.put("onTimeDeliveries", onTime);
        performance.put("onTimePercentage", orders.isEmpty() ? 0 : (onTime * 100 / orders.size()));

        return performance;
    }

    private List<Map<String, Object>> getRecentOrders(List<PurchaseOrder> orders, int limit) {
        return orders.stream()
                .sorted(Comparator.comparing(PurchaseOrder::getCreatedAt).reversed())
                .limit(limit)
                .map(po -> {
                    Map<String, Object> order = new HashMap<>();
                    order.put("id", po.getId());
                    order.put("orderNumber", po.getOrderNumber());
                    order.put("supplierName", po.getSupplier().getName());
                    order.put("totalValue", po.getTotalOrderValue());
                    order.put("status", po.getStatus().name());
                    order.put("createdAt", po.getCreatedAt());
                    return order;
                })
                .collect(Collectors.toList());
    }
}

