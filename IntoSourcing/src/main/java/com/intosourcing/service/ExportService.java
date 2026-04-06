package com.intosourcing.service;

import com.intosourcing.model.entity.PurchaseOrder;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExportService {

    public byte[] exportToExcel(List<PurchaseOrder> orders) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Purchase Orders");

        // Create header row
        Row headerRow = sheet.createRow(0);
        String[] headers = {
            "Order Number", "Supplier", "Buyer", "Order Date", "Ex-Factory Date",
            "Expected Delivery", "Actual Delivery", "Total Value", "Currency", "Status", "Notes"
        };

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setFont(workbook.createFont());
        headerStyle.getFont().setBold(true);

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Add data rows
        int rowNum = 1;
        for (PurchaseOrder order : orders) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(order.getOrderNumber());
            row.createCell(1).setCellValue(order.getSupplier().getName());
            row.createCell(2).setCellValue(order.getBuyer().getName());
            row.createCell(3).setCellValue(order.getOrderDate().toString());
            row.createCell(4).setCellValue(order.getConfirmedExFactoryDate().toString());
            row.createCell(5).setCellValue(order.getExpectedDeliveryDate().toString());
            row.createCell(6).setCellValue(order.getActualDeliveryDate() != null ? order.getActualDeliveryDate().toString() : "");
            row.createCell(7).setCellValue(order.getTotalOrderValue().doubleValue());
            row.createCell(8).setCellValue(order.getCurrency());
            row.createCell(9).setCellValue(order.getStatus().name());
            row.createCell(10).setCellValue(order.getNotes() != null ? order.getNotes() : "");
        }

        // Auto-size columns
        for (int i = 0; i < headers.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        workbook.write(outputStream);
        workbook.close();

        return outputStream.toByteArray();
    }

    public String exportToCSV(List<PurchaseOrder> orders) {
        StringBuilder csv = new StringBuilder();

        // Add header
        csv.append("Order Number,Supplier,Buyer,Order Date,Ex-Factory Date,Expected Delivery,Actual Delivery,Total Value,Currency,Status,Notes\n");

        // Add data
        for (PurchaseOrder order : orders) {
            csv.append(order.getOrderNumber()).append(",");
            csv.append(escapeCSV(order.getSupplier().getName())).append(",");
            csv.append(escapeCSV(order.getBuyer().getName())).append(",");
            csv.append(order.getOrderDate()).append(",");
            csv.append(order.getConfirmedExFactoryDate()).append(",");
            csv.append(order.getExpectedDeliveryDate()).append(",");
            csv.append(order.getActualDeliveryDate() != null ? order.getActualDeliveryDate().toString() : "").append(",");
            csv.append(order.getTotalOrderValue()).append(",");
            csv.append(order.getCurrency()).append(",");
            csv.append(order.getStatus().name()).append(",");
            csv.append(escapeCSV(order.getNotes() != null ? order.getNotes() : "")).append("\n");
        }

        return csv.toString();
    }

    private String escapeCSV(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}

