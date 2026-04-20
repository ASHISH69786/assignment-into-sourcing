package com.intosourcing.controller;

import com.intosourcing.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        try {
            Map<String, Object> metrics = analyticsService.getDashboardMetrics();
            return ResponseEntity.ok(metrics);
        } catch (Exception e) {
            log.error("Error fetching dashboard metrics", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/supplier/{supplierId}")
    public ResponseEntity<Map<String, Object>> getSupplierAnalytics(@PathVariable String supplierId) {
        try {
            Map<String, Object> analytics = analyticsService.getSupplierAnalytics(supplierId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            log.error("Error fetching supplier analytics", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<Map<String, Object>> getDateRangeAnalytics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Map<String, Object> analytics = analyticsService.getDateRangeAnalytics(startDate, endDate);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            log.error("Error fetching date range analytics", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}

