package com.intosourcing.service.extraction;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class PDFExtractionService {

    /**
     * Extract text from PDF bytes (no disk access required)
     * Processes PDF entirely in memory for read-only environments
     */
    public String extractTextFromPDF(byte[] pdfBytes) throws IOException {
        try {
            PDDocument document = Loader.loadPDF(pdfBytes);
            PDFTextStripper textStripper = new PDFTextStripper();
            String text = textStripper.getText(document);
            document.close();
            return text;
        } catch (IOException e) {
            log.error("Error extracting text from PDF bytes", e);
            throw e;
        }
    }

    /**
     * Extract purchase order data from PDF bytes
     */
    public Map<String, String> extractPurchaseOrderData(byte[] pdfBytes) {
        Map<String, String> orderData = new HashMap<>();
        try {
            String text = extractTextFromPDF(pdfBytes);

            // Extract key fields using regex patterns
            orderData.put("orderNumber", extractField(text, "(?i)(?:order|po)\\s*(?:number|no\\.?|#)?[:\\s]*([A-Z0-9\\-]{5,20})"));
            orderData.put("supplierName", extractField(text, "(?i)(?:supplier|vendor)[:\\s]*([^\\n]{5,100})"));
            orderData.put("brandName", extractField(text, "(?i)brand[:\\s]*([^\\n]{2,100})"));
            orderData.put("buyerName", extractField(text, "(?i)buyer[:\\s]*([^\\n]{5,100})"));
            orderData.put("category", extractField(text, "(?i)(?:category|type)[:\\s]*([^\\n]{2,100})"));
            orderData.put("styleNumber", extractField(text, "(?i)(?:style|item|sku)\\s*(?:number|no\\.?|#)?[:\\s]*([A-Z0-9\\-]{3,20})"));
            orderData.put("orderQuantity", extractField(text, "(?i)(?:quantity|qty|order qty)[:\\s]*([0-9,]+)"));
            orderData.put("price", extractField(text, "(?i)(?:price|unit price|cost)[:\\s]*(?:\\$)?([0-9,\\.]+)"));
            orderData.put("orderDate", extractDate(text, "(?i)(?:order date|po date)[:\\s]*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"));
            orderData.put("exFactoryDate", extractDate(text, "(?i)(?:ex.?factory|confirmed).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"));
            orderData.put("deliveryDate", extractDate(text, "(?i)(?:delivery|required|due).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"));

            // Clean up the data
            orderData.replaceAll((k, v) -> v != null ? v.trim() : "");

            log.info("Successfully extracted purchase order data from PDF");
        } catch (IOException e) {
            log.error("Failed to extract data from PDF", e);
            orderData.put("error", "Failed to extract: " + e.getMessage());
        }

        return orderData;
    }

    private String extractField(String text, String pattern) {
        Pattern regex = Pattern.compile(pattern);
        Matcher matcher = regex.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return null;
    }

    private String extractDate(String text, String pattern) {
        String field = extractField(text, pattern);
        if (field != null) {
            // Normalize date format to yyyy-MM-dd
            return normalizeDateFormat(field);
        }
        return null;
    }

    private String normalizeDateFormat(String dateString) {
        // Handle various date formats: MM/DD/YYYY, MM-DD-YYYY, DD/MM/YYYY, etc.
        String[] parts = dateString.split("[-/]");
        if (parts.length == 3) {
            try {
                int num1 = Integer.parseInt(parts[0]);
                int num2 = Integer.parseInt(parts[1]);
                int year = Integer.parseInt(parts[2]);

                // If year is 2-digit, convert to 4-digit
                if (year < 100) {
                    year += (year < 50) ? 2000 : 1900;
                }

                // Guess format: if first number > 12, it's likely DD/MM/YYYY
                int month, day;
                if (num1 > 12) {
                    day = num1;
                    month = num2;
                } else if (num2 > 12) {
                    month = num1;
                    day = num2;
                } else {
                    // Default to MM/DD/YYYY
                    month = num1;
                    day = num2;
                }

                return String.format("%04d-%02d-%02d", year, month, day);
            } catch (NumberFormatException e) {
                log.warn("Could not parse date: {}", dateString);
                return null;
            }
        }
        return null;
    }

    /**
     * Extract multiple purchase orders from PDF bytes
     */
    public List<Map<String, String>> extractMultipleOrdersFromPDF(byte[] pdfBytes) throws IOException {
        List<Map<String, String>> orders = new ArrayList<>();
        String text = extractTextFromPDF(pdfBytes);

        // Split text by common order separators or page breaks
        String[] sections = text.split("(?i)(?:------|====|page break|new order)");

        for (String section : sections) {
            if (section.trim().length() > 50) {
                // Extract orders from text section
                Map<String, String> orderData = extractOrderFromText(section);
                if (orderData.containsKey("orderNumber") && orderData.get("orderNumber") != null) {
                    orders.add(orderData);
                }
            }
        }

        return orders;
    }

    private Map<String, String> extractOrderFromText(String text) {
        Map<String, String> orderData = new HashMap<>();
        orderData.put("orderNumber", extractField(text, "(?i)(?:order|po)\\s*(?:number|no\\.?|#)?[:\\s]*([A-Z0-9\\-]{5,20})"));
        orderData.put("supplierName", extractField(text, "(?i)(?:supplier|vendor)[:\\s]*([^\\n]{5,100})"));
        orderData.put("brandName", extractField(text, "(?i)brand[:\\s]*([^\\n]{2,100})"));
        orderData.put("buyerName", extractField(text, "(?i)buyer[:\\s]*([^\\n]{5,100})"));
        orderData.put("category", extractField(text, "(?i)(?:category|type)[:\\s]*([^\\n]{2,100})"));
        orderData.put("styleNumber", extractField(text, "(?i)(?:style|item|sku)\\s*(?:number|no\\.?|#)?[:\\s]*([A-Z0-9\\-]{3,20})"));
        orderData.put("orderQuantity", extractField(text, "(?i)(?:quantity|qty|order qty)[:\\s]*([0-9,]+)"));
        orderData.put("price", extractField(text, "(?i)(?:price|unit price|cost)[:\\s]*(?:\\$)?([0-9,\\.]+)"));
        orderData.put("orderDate", extractDate(text, "(?i)(?:order date|po date)[:\\s]*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"));
        orderData.put("exFactoryDate", extractDate(text, "(?i)(?:ex.?factory|confirmed).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"));
        orderData.put("deliveryDate", extractDate(text, "(?i)(?:delivery|required|due).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"));

        orderData.replaceAll((k, v) -> v != null ? v.trim() : "");
        return orderData;
    }
}

