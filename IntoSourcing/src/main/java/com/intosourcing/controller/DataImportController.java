package com.intosourcing.controller;

import com.intosourcing.service.DataImportService;
import com.intosourcing.model.entity.DataImport;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/import")
@CrossOrigin(origins = "*")
public class DataImportController {

    private final DataImportService dataImportService;

    public DataImportController(DataImportService dataImportService) {
        this.dataImportService = dataImportService;
    }

    @PostMapping("/pdf")
    public ResponseEntity<Map<String, Object>> importPDF(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Process PDF from memory (no disk write required)
            String originalFilename = file.getOriginalFilename();
            byte[] fileBytes = file.getBytes();

            // Import data directly from bytes
            DataImport importResult = dataImportService.importPDFFile(originalFilename, fileBytes);

            response.put("success", true);
            response.put("message", "PDF imported successfully");
            response.put("importId", importResult.getId());
            response.put("totalRecords", importResult.getTotalRecords());
            response.put("successfulRecords", importResult.getSuccessfulRecords());
            response.put("failedRecords", importResult.getFailedRecords());
            response.put("status", importResult.getStatus().name());

            if (importResult.getErrorLog() != null && !importResult.getErrorLog().isEmpty()) {
                response.put("errors", importResult.getErrorLog());
            }

            log.info("PDF import completed: {}", originalFilename);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error importing PDF", e);
            response.put("success", false);
            response.put("message", "Error importing PDF: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/batch")
    public ResponseEntity<Map<String, Object>> importBatchPDFs(@RequestParam("files") List<MultipartFile> files) {
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> results = new HashMap<>();

        try {
            int totalProcessed = 0;
            int totalSuccessful = 0;

            for (MultipartFile file : files) {
                try {
                    String originalFilename = file.getOriginalFilename();
                    byte[] fileBytes = file.getBytes();

                    DataImport importResult = dataImportService.importPDFFile(originalFilename, fileBytes);

                    Map<String, Object> fileResult = new HashMap<>();
                    fileResult.put("importId", importResult.getId());
                    fileResult.put("totalRecords", importResult.getTotalRecords());
                    fileResult.put("successfulRecords", importResult.getSuccessfulRecords());
                    fileResult.put("failedRecords", importResult.getFailedRecords());
                    fileResult.put("status", importResult.getStatus().name());

                    results.put(file.getOriginalFilename(), fileResult);
                    totalProcessed++;
                    if (importResult.getStatus() == DataImport.ImportStatus.COMPLETED) {
                        totalSuccessful++;
                    }
                } catch (Exception e) {
                    log.error("Error importing file: {}", file.getOriginalFilename(), e);
                    Map<String, Object> errorResult = new HashMap<>();
                    errorResult.put("error", e.getMessage());
                    results.put(file.getOriginalFilename(), errorResult);
                    totalProcessed++;
                }
            }

            response.put("success", true);
            response.put("totalFiles", files.size());
            response.put("processedFiles", totalProcessed);
            response.put("successfulImports", totalSuccessful);
            response.put("details", results);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error in batch import", e);
            response.put("success", false);
            response.put("message", "Error in batch import: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/history")
    public ResponseEntity<List<DataImport>> getImportHistory() {
        return ResponseEntity.ok(dataImportService.getImportHistory());
    }

    @GetMapping("/{importId}")
    public ResponseEntity<DataImport> getImportDetails(@PathVariable String importId) {
        DataImport importRecord = dataImportService.getImportDetails(importId);
        if (importRecord != null) {
            return ResponseEntity.ok(importRecord);
        }
        return ResponseEntity.notFound().build();
    }
}

