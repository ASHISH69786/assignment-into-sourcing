# Quick Reference: PDF Import Format

## What Does Your PDF Import API Expect?

### Field Mapping Guide

```
USER'S PDF CONTENT          → EXTRACTED FIELD NAME      → DATABASE FIELD
------------------------      --------------------         ----------------
Order Number: PO-2024-001   → orderNumber                → PurchaseOrder.orderNumber
Supplier: ABC Corp          → supplierName               → PurchaseOrder.supplierId (matched to Supplier)
Brand: Nike                 → brandName                  → Product.brandName
Buyer: Retail Ltd.          → buyerName                  → PurchaseOrder.buyerId (matched to Buyer)
Category: Shoes             → category                   → Product.category
Style Number: SKU-123       → styleNumber                → Product.styleNumber
Order Quantity: 5,000       → orderQuantity              → OrderItem.quantity
Price: $12.50              → price                       → OrderItem.unitPrice
Order Date: 04/20/2026     → orderDate                   → PurchaseOrder.orderDate
Ex-Factory: 04/25/2026     → exFactoryDate               → PurchaseOrder.confirmedExFactoryDate
Delivery: 05/25/2026       → deliveryDate                → PurchaseOrder.expectedDeliveryDate
```

## Minimum PDF Content for Successful Import

The PDF must have AT LEAST these fields to be successfully imported:

```
Order Number: [REQUIRED - 5-20 alphanumeric chars]
Supplier: [REQUIRED - 5-100 chars]
Buyer: [REQUIRED - 5-100 chars]
Style Number: [REQUIRED - 3-20 alphanumeric chars]
Order Quantity: [REQUIRED - numbers]
Price: [REQUIRED - numbers with optional $ and decimals]
Order Date: [REQUIRED - date format]
```

## Optional Fields

```
Brand: [2-100 characters]
Category: [2-100 characters]
Ex-Factory Date: [date format]
Delivery Date: [date format]
```

## Date Format Examples (All Supported)

- `04/20/2026` (MM/DD/YYYY)
- `20/04/2026` (DD/MM/YYYY)
- `04-20-2026` (MM-DD-YYYY)
- `20-04-2026` (DD-MM-YYYY)
- `2026/04/20` (YYYY/MM/DD)

## Price Format Examples (All Supported)

- `$12.50` (with dollar sign)
- `12.50` (decimal)
- `12,50` (comma as decimal)
- `12` (integer)
- `$1,200.50` (with thousands separator)

## Quantity Format Examples (All Supported)

- `5000` (plain number)
- `5,000` (with comma)
- `5.000` (with period)

## Step-by-Step: Create & Test PDF

### 1. Install Requirements
```bash
pip3 install fpdf2
```

### 2. Generate Sample PDF
```bash
cd /Users/ashishkumarsharma/Desktop/Assignment/assignment-into-sourcing/IntoSourcing
python3 generate_sample_pdf.py
# Creates: sample_purchase_order.pdf
```

### 3. Test the Import
```bash
curl -X POST "http://localhost:8080/api/import/pdf" \
  -F "file=@sample_purchase_order.pdf"
```

### 4. Check Response
```json
{
  "success": true,
  "message": "PDF imported successfully",
  "importId": "...",
  "totalRecords": 1,
  "successfulRecords": 1,
  "failedRecords": 0,
  "status": "COMPLETED"
}
```

## Common Mistakes to Avoid

❌ **Wrong**: `Order_Number: PO-2024-001` (underscore instead of space)  
✅ **Right**: `Order Number: PO-2024-001` or `Order #: PO-2024-001`

❌ **Wrong**: `Date: 2026/04/20` (must have separators in date)  
✅ **Right**: `Order Date: 04/20/2026`

❌ **Wrong**: `Supplier` (field only, no value)  
✅ **Right**: `Supplier: ABC Corporation`

❌ **Wrong**: All fields on one line: `Order: PO-1 | Supplier: ABC | Qty: 100`  
✅ **Right**: Each field on separate line

❌ **Wrong**: `Quantity: ~5000` or `Quantity: 5k`  
✅ **Right**: `Order Quantity: 5000` or `Quantity: 5,000`

## Extraction Regex Patterns

For developers/troubleshooting:

```
ORDER_NUMBER     = "(?i)(?:order|po)\s*(?:number|no\.?|#)?[:\s]*([A-Z0-9\-]{5,20})"
SUPPLIER         = "(?i)(?:supplier|vendor)[:\s]*([^\n]{5,100})"
BRAND            = "(?i)brand[:\s]*([^\n]{2,100})"
BUYER            = "(?i)buyer[:\s]*([^\n]{5,100})"
CATEGORY         = "(?i)(?:category|type)[:\s]*([^\n]{2,100})"
STYLE_NUMBER     = "(?i)(?:style|item|sku)\s*(?:number|no\.?|#)?[:\s]*([A-Z0-9\-]{3,20})"
QUANTITY         = "(?i)(?:quantity|qty|order qty)[:\s]*([0-9,]+)"
PRICE            = "(?i)(?:price|unit price|cost)[:\s]*(?:\$)?([0-9,\.]+)"
ORDER_DATE       = "(?i)(?:order date|po date)[:\s]*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"
EX_FACTORY_DATE  = "(?i)(?:ex.?factory|confirmed).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"
DELIVERY_DATE    = "(?i)(?:delivery|required|due).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"
```

## Files for Reference

- `PDF_IMPORT_GUIDE.md` - Comprehensive documentation
- `SAMPLE_PDF_CONTENT.txt` - Text version of sample PDF
- `generate_sample_pdf.py` - Python script to generate PDF
- `QUICK_REFERENCE.md` - This file

