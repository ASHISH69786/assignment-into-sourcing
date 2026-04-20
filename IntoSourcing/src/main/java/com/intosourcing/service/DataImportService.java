package com.intosourcing.service;

import com.intosourcing.model.entity.*;
import com.intosourcing.repository.*;
import com.intosourcing.service.extraction.PDFExtractionService;
import com.intosourcing.service.transformation.DataTransformationService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
public class DataImportService {

    private final PDFExtractionService pdfExtractionService;
    private final DataTransformationService transformationService;
    private final DataImportRepository dataImportRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public DataImportService(
            PDFExtractionService pdfExtractionService,
            DataTransformationService transformationService,
            DataImportRepository dataImportRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            OrderItemRepository orderItemRepository,
            ProductRepository productRepository) {
        this.pdfExtractionService = pdfExtractionService;
        this.transformationService = transformationService;
        this.dataImportRepository = dataImportRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    /**
     * Import PDF data from byte array (no disk write required)
     * This method processes PDFs entirely in memory, making it suitable for
     * read-only deployments (Docker, Kubernetes, Serverless, etc.)
     */
    @Transactional
    public DataImport importPDFFile(String fileName, byte[] pdfBytes) {
        DataImport importRecord = new DataImport();
        importRecord.setSourceFile(fileName);
        importRecord.setStatus(DataImport.ImportStatus.IN_PROGRESS);
        importRecord.setTotalRecords(0);
        importRecord.setSuccessfulRecords(0);
        importRecord.setFailedRecords(0);

        StringBuilder errorLog = new StringBuilder();

        try {
            // Extract data from PDF bytes (processed in memory)
            log.info("Starting import from: {}", fileName);
            List<Map<String, String>> extractedOrders = pdfExtractionService.extractMultipleOrdersFromPDF(pdfBytes);

            if (extractedOrders.isEmpty()) {
                Map<String, String> singleOrder = pdfExtractionService.extractPurchaseOrderData(pdfBytes);
                if (singleOrder.containsKey("orderNumber") && singleOrder.get("orderNumber") != null) {
                    extractedOrders.add(singleOrder);
                }
            }

            importRecord.setTotalRecords(extractedOrders.size());

            // Process each extracted order
            for (Map<String, String> rawData : extractedOrders) {
                try {
                    importOrder(rawData, fileName);
                    importRecord.setSuccessfulRecords(importRecord.getSuccessfulRecords() + 1);
                } catch (DataTransformationService.ValidationException e) {
                    importRecord.setFailedRecords(importRecord.getFailedRecords() + 1);
                    String error = "Failed to import order: " + e.getMessage() + "\n";
                    errorLog.append(error);
                    log.warn(error);
                }
            }

            importRecord.setStatus(DataImport.ImportStatus.COMPLETED);
            importRecord.setCompletionDate(LocalDateTime.now());

        } catch (Exception e) {
            log.error("Error importing PDF: {}", fileName, e);
            importRecord.setStatus(DataImport.ImportStatus.FAILED);
            importRecord.setCompletionDate(LocalDateTime.now());
            errorLog.append("Import failed: ").append(e.getMessage());
        }

        if (errorLog.length() > 0) {
            importRecord.setErrorLog(errorLog.toString());
        }

        return dataImportRepository.save(importRecord);
    }

    @Transactional
    private void importOrder(Map<String, String> rawData, String sourceFile) throws DataTransformationService.ValidationException {
        // Transform and validate data
        PurchaseOrder purchaseOrder = transformationService.transformToPurchaseOrder(rawData, sourceFile);

        // Save purchase order
        purchaseOrder = purchaseOrderRepository.save(purchaseOrder);
        log.info("Saved purchase order: {}", purchaseOrder.getOrderNumber());

        // Transform and save product
        Product product = transformationService.transformToProduct(rawData);
        product = productRepository.save(product);
        log.info("Saved product: {}", product.getStyleNumber());

        // Transform and save order item
        OrderItem orderItem = transformationService.transformToOrderItem(purchaseOrder, product, rawData);
        orderItemRepository.save(orderItem);
        log.info("Saved order item for PO: {}", purchaseOrder.getOrderNumber());
    }

    public List<DataImport> getImportHistory() {
        return dataImportRepository.findAll();
    }

    public DataImport getImportDetails(String importId) {
        return dataImportRepository.findById(importId).orElse(null);
    }
}

