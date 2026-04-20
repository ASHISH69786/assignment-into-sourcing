# PDF Import API - Expected Format Guide

## Overview
Your PDF import API expects purchase order data to be extracted from PDF files using pattern matching with regular expressions. The system uses Apache PDFBox and Tika for PDF text extraction.

## Required Fields

The PDF extraction service looks for the following fields in the PDF text. All field names are case-insensitive:

### 1. **Order Number** (Required)
- **Patterns**: Looks for keywords like "Order", "PO", "order number", "no.", "#"
- **Format**: 5-20 alphanumeric characters with hyphens allowed
- **Examples**: `PO-2024-001`, `ORD123456`, `PO-001`
- **Example in PDF**: `Order Number: PO-2024-001`

### 2. **Supplier Name** (Required)
- **Patterns**: Looks for "Supplier", "Vendor"
- **Format**: 5-100 characters
- **Examples**: `ABC Textiles Manufacturing Co.`, `Global Suppliers Inc.`
- **Example in PDF**: `Supplier: ABC Textiles Manufacturing Co.`

### 3. **Brand Name** (Optional but recommended)
- **Patterns**: Looks for "Brand"
- **Format**: 2-100 characters
- **Examples**: `PrettyLittleThing`, `Nike`, `Adidas`
- **Example in PDF**: `Brand: PrettyLittleThing`

### 4. **Buyer Name** (Required)
- **Patterns**: Looks for "Buyer"
- **Format**: 5-100 characters
- **Examples**: `Fashion Direct Ltd.`, `Retail Company X`
- **Example in PDF**: `Buyer: Fashion Direct Ltd.`

### 5. **Category** (Optional)
- **Patterns**: Looks for "Category", "Type"
- **Format**: 2-100 characters
- **Examples**: `Dresses - Casual Wear`, `T-Shirts`, `Accessories`
- **Example in PDF**: `Category: Dresses - Casual Wear`

### 6. **Style Number/SKU** (Required)
- **Patterns**: Looks for "Style", "Item", "SKU" followed by "number", "no.", "#"
- **Format**: 3-20 alphanumeric characters with hyphens
- **Examples**: `HZZ53685`, `STYLE-001`, `SKU-12345`
- **Example in PDF**: `Style Number: HZZ53685`

### 7. **Order Quantity** (Required)
- **Patterns**: Looks for "Quantity", "Qty", "Order Qty"
- **Format**: Numbers with optional commas
- **Examples**: `5,000`, `1000`, `10,500`
- **Example in PDF**: `Order Quantity: 5,000`

### 8. **Price (Unit Price)** (Required)
- **Patterns**: Looks for "Price", "Unit Price", "Cost"
- **Format**: Numbers with optional dollar sign, decimals, and commas
- **Examples**: `$12.50`, `12.50`, `12,50`
- **Example in PDF**: `Price (per unit): $12.50`

### 9. **Order Date** (Required)
- **Patterns**: Looks for "Order Date", "PO Date"
- **Format**: DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY, MM-DD-YYYY
- **Examples**: `04/20/2026`, `20/04/2026`, `04-20-2026`
- **Example in PDF**: `Order Date: 04/20/2026`

### 10. **Ex-Factory Date** (Optional but recommended)
- **Patterns**: Looks for "Ex-Factory", "Ex Factory", "Confirmed" followed by date
- **Format**: DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY, MM-DD-YYYY
- **Examples**: `04/25/2026`, `25/04/2026`
- **Example in PDF**: `Ex-Factory Date: 04/25/2026`

### 11. **Delivery Date** (Optional but recommended)
- **Patterns**: Looks for "Delivery", "Required", "Due" followed by date
- **Format**: DD/MM/YYYY, MM/DD/YYYY, DD-MM-YYYY, MM-DD-YYYY
- **Examples**: `05/25/2026`, `25/05/2026`
- **Example in PDF**: `Expected Delivery Date: 05/25/2026`

## PDF Structure Example

Here's what a properly formatted PDF should look like:

```
PURCHASE ORDER

Order Number: PO-2024-001
Supplier: ABC Textiles Manufacturing Co.
Brand: PrettyLittleThing
Buyer: Fashion Direct Ltd.
Category: Dresses - Casual Wear

PRODUCT DETAILS

Style Number: HZZ53685
Order Quantity: 5,000
Price (per unit): $12.50

KEY DATES

Order Date: 04/20/2026
Ex-Factory Date: 04/25/2026
Expected Delivery Date: 05/25/2026
```

## Important Notes

1. **Format Flexibility**: The API is flexible with formatting - field labels can appear in various orders
2. **Case Insensitive**: All keyword patterns are case-insensitive (e.g., "Supplier", "supplier", "SUPPLIER" all work)
3. **Date Format**: The system tries to intelligently parse dates in multiple formats
4. **Field Separation**: Each field should be on a separate line or clearly separated in the PDF
5. **Multiple Orders**: The PDF can contain multiple orders if separated by keywords like "---", "====", "page break", or "new order"

## How to Generate a Test PDF

### Using Python with fpdf2:
```python
from fpdf import FPDF
from datetime import datetime, timedelta

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", "B", 16)
pdf.cell(0, 10, "PURCHASE ORDER", ln=True, align="C")
pdf.ln(5)

# Add each field as label: value
pdf.set_font("Arial", "B", 11)
pdf.cell(60, 8, "Order Number:", border=1)
pdf.set_font("Arial", "", 11)
pdf.cell(0, 8, "PO-2024-001", border=1, ln=True)

# ... repeat for each field

pdf.output("sample_purchase_order.pdf")
```

### Using LibreOffice or Word:
1. Create a new document with the fields as shown in the example structure
2. Export/Save as PDF
3. Upload to the import API

## Testing the Import

Once you have a PDF:

```bash
curl -X POST "http://localhost:8080/api/import/pdf" \
  -F "file=@sample_purchase_order.pdf"
```

Expected successful response:
```json
{
  "success": true,
  "message": "PDF imported successfully",
  "importId": "507f1f77bcf86cd799439011",
  "totalRecords": 1,
  "successfulRecords": 1,
  "failedRecords": 0,
  "status": "COMPLETED"
}
```

## Troubleshooting

- **Fields not being extracted**: Make sure the field names match the patterns (check regex patterns in PDFExtractionService)
- **Date parsing failures**: Use standard date formats (MM/DD/YYYY or DD/MM/YYYY)
- **Multiple orders not detected**: Separate orders with clear delimiters like "---", "====", or "NEW ORDER"

## Regex Patterns Used

The extraction service uses these regex patterns:

- **Order Number**: `(?i)(?:order|po)\s*(?:number|no\.?|#)?[:\s]*([A-Z0-9\-]{5,20})`
- **Supplier**: `(?i)(?:supplier|vendor)[:\s]*([^\n]{5,100})`
- **Brand**: `(?i)brand[:\s]*([^\n]{2,100})`
- **Buyer**: `(?i)buyer[:\s]*([^\n]{5,100})`
- **Category**: `(?i)(?:category|type)[:\s]*([^\n]{2,100})`
- **Style Number**: `(?i)(?:style|item|sku)\s*(?:number|no\.?|#)?[:\s]*([A-Z0-9\-]{3,20})`
- **Quantity**: `(?i)(?:quantity|qty|order qty)[:\s]*([0-9,]+)`
- **Price**: `(?i)(?:price|unit price|cost)[:\s]*(?:\$)?([0-9,\.]+)`
- **Order Date**: `(?i)(?:order date|po date)[:\s]*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})`
- **Ex-Factory Date**: `(?i)(?:ex.?factory|confirmed).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})`
- **Delivery Date**: `(?i)(?:delivery|required|due).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})`

