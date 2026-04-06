package com.intosourcing.controller;

import com.intosourcing.repository.PurchaseOrderRepository;
import com.intosourcing.service.ExportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@Slf4j
@RestController
@RequestMapping("/export")
@CrossOrigin(origins = "*")
public class ExportController {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ExportService exportService;

    public ExportController(PurchaseOrderRepository purchaseOrderRepository, ExportService exportService) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.exportService = exportService;
    }

    @GetMapping("/excel")
    public ResponseEntity<byte[]> exportToExcel() {
        try {
            byte[] excelData = exportService.exportToExcel(purchaseOrderRepository.findAll());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"purchase_orders.xlsx\"")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelData);
        } catch (IOException e) {
            log.error("Error exporting to Excel", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/csv")
    public ResponseEntity<String> exportToCSV() {
        try {
            String csvData = exportService.exportToCSV(purchaseOrderRepository.findAll());
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"purchase_orders.csv\"")
                    .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                    .body(csvData);
        } catch (Exception e) {
            log.error("Error exporting to CSV", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}

