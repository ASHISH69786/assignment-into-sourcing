# PDF Import API - Complete Documentation Index

## 📌 Overview

Your Purchase Order System includes a **PDF Import API** that extracts purchase order data from PDF files using regex pattern matching and text extraction. This document index guides you to all resources.

---

## 🎯 Start Here Based on Your Needs

### "I just want to generate a test PDF quickly"
→ Read: **QUICK_REFERENCE.md** (2 min read)
→ Run: `python3 generate_sample_pdf.py`
→ Test: `curl -X POST http://localhost:8080/api/import/pdf -F "file=@sample_purchase_order.pdf"`

### "I want to understand the PDF format requirements"
→ Read: **QUICK_REFERENCE.md** (field requirements section)
→ See: **SAMPLE_PDF_CONTENT.txt** (actual example)

### "I need complete technical documentation"
→ Read: **PDF_IMPORT_GUIDE.md** (comprehensive 183-line guide)
→ Reference: Regex patterns section for all extraction rules

### "I'm having issues with PDF extraction"
→ Check: **QUICK_REFERENCE.md** → "Common Mistakes to Avoid" section
→ Reference: **PDF_IMPORT_GUIDE.md** → "Troubleshooting" section
→ Review: Regex patterns to ensure your PDF matches

### "I want to create custom PDFs"
→ Use: **SAMPLE_PDF_CONTENT.txt** as template
→ Convert to PDF using: Word, Google Docs, LibreOffice, or Python script
→ Or use: **generate_sample_pdf.py** as reference to build your own

---

## 📚 Documentation Files

### 1. **QUICK_REFERENCE.md** ⚡
**Best for**: Quick lookups and cheat sheets
- ✅ Field mapping table (PDF → Database)
- ✅ Minimum required fields
- ✅ Date and number format examples
- ✅ Common mistakes to avoid
- ✅ Step-by-step testing guide
- ✅ All regex patterns

### 2. **PDF_IMPORT_GUIDE.md** 📖
**Best for**: Complete understanding and troubleshooting
- ✅ Detailed field descriptions (11 fields)
- ✅ Format requirements per field
- ✅ Pattern matching examples
- ✅ Regex patterns with explanations
- ✅ Multiple order support
- ✅ Date format flexibility
- ✅ Troubleshooting guide

### 3. **SAMPLE_PDF_CONTENT.txt** 📝
**Best for**: Template when creating PDFs manually
- ✅ Two complete sample purchase orders
- ✅ Exact format to follow
- ✅ Can be converted to PDF using office software

### 4. **generate_sample_pdf.py** 🐍
**Best for**: Automated PDF generation
- ✅ Python script to generate valid PDFs
- ✅ Includes error handling
- ✅ Customizable output path
- ✅ Works cross-platform

### 5. **API_CONTRACT.md** 📋
**Best for**: API endpoint documentation
- ✅ All available endpoints
- ✅ Request/response formats
- ✅ Error codes
- ✅ CORS configuration

---

## 🔄 PDF Import Workflow

```
Your PDF File
    ↓
[/api/import/pdf endpoint]
    ↓
PDFExtractionService extracts text using PDFBox
    ↓
Regex patterns match fields (case-insensitive)
    ↓
    ├─ Order Number (required)
    ├─ Supplier Name (required)
    ├─ Brand (optional)
    ├─ Buyer Name (required)
    ├─ Category (optional)
    ├─ Style Number (required)
    ├─ Order Quantity (required)
    ├─ Price (required)
    ├─ Order Date (required)
    ├─ Ex-Factory Date (optional)
    └─ Delivery Date (optional)
    ↓
DataTransformationService validates data
    ↓
MongoDB Storage:
    ├─ PurchaseOrder collection
    ├─ Product collection
    └─ OrderItem collection
    ↓
Import successful! ✅
```

---

## 🛠 Quick Setup

### Prerequisites
```bash
# Python 3.7+
python3 --version

# Install PDF generation library
pip3 install fpdf2
```

### Generate Sample PDF
```bash
cd /Users/ashishkumarsharma/Desktop/Assignment/assignment-into-sourcing/IntoSourcing
python3 generate_sample_pdf.py
# Output: sample_purchase_order.pdf
```

### Test the API
```bash
# Single file
curl -X POST "http://localhost:8080/api/import/pdf" \
  -F "file=@sample_purchase_order.pdf"

# Multiple files
curl -X POST "http://localhost:8080/api/import/batch" \
  -F "files=@file1.pdf" \
  -F "files=@file2.pdf"
```

### Check Import History
```bash
curl http://localhost:8080/api/import/history
```

---

## 📋 Required Fields Checklist

For successful import, your PDF must contain:

- ✅ Order Number: `PO-2024-001`
- ✅ Supplier: `ABC Textiles Manufacturing Co.`
- ✅ Buyer: `Fashion Direct Ltd.`
- ✅ Style Number: `HZZ53685`
- ✅ Order Quantity: `5,000`
- ✅ Price: `$12.50`
- ✅ Order Date: `04/20/2026`

Optional but recommended:
- ⚪ Brand: `PrettyLittleThing`
- ⚪ Category: `Dresses - Casual Wear`
- ⚪ Ex-Factory Date: `04/25/2026`
- ⚪ Delivery Date: `05/25/2026`

---

## 🔍 Regex Pattern Reference

All patterns are **case-insensitive** and highly flexible:

```
ORDER_NUMBER    = "(?i)(?:order|po)\s*(?:number|no\.?|#)?[:\s]*([A-Z0-9\-]{5,20})"
SUPPLIER        = "(?i)(?:supplier|vendor)[:\s]*([^\n]{5,100})"
BRAND           = "(?i)brand[:\s]*([^\n]{2,100})"
BUYER           = "(?i)buyer[:\s]*([^\n]{5,100})"
CATEGORY        = "(?i)(?:category|type)[:\s]*([^\n]{2,100})"
STYLE_NUMBER    = "(?i)(?:style|item|sku)\s*(?:number|no\.?|#)?[:\s]*([A-Z0-9\-]{3,20})"
QUANTITY        = "(?i)(?:quantity|qty|order qty)[:\s]*([0-9,]+)"
PRICE           = "(?i)(?:price|unit price|cost)[:\s]*(?:\$)?([0-9,\.]+)"
ORDER_DATE      = "(?i)(?:order date|po date)[:\s]*([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"
EX_FACTORY_DATE = "(?i)(?:ex.?factory|confirmed).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"
DELIVERY_DATE   = "(?i)(?:delivery|required|due).{0,20}([0-9]{1,2}[-/][0-9]{1,2}[-/][0-9]{2,4})"
```

---

## 💬 Common Questions

**Q: Can I use any PDF?**  
A: Yes, as long as it contains the required fields in a readable text format.

**Q: What about scanned PDFs or images?**  
A: The API uses text extraction, so scanned PDFs (images) won't work. Use text-based PDFs.

**Q: Can the fields be in any order?**  
A: Yes! The regex patterns don't care about order. Each field is extracted independently.

**Q: What if a date has letters like "April 20, 2026"?**  
A: The regex only looks for numeric dates (DD/MM/YYYY format). Write as `04/20/2026`.

**Q: Can I upload an empty PDF?**  
A: No, the PDF must contain the required fields for extraction to work.

**Q: What about multiple purchase orders in one PDF?**  
A: Separate them with clear delimiters like "---", "====", "PAGE BREAK", or "NEW ORDER".

---

## 🚨 Troubleshooting Guide

| Problem | Solution |
|---------|----------|
| Import fails - fields not found | Check field names match regex patterns exactly |
| Date parsing errors | Use MM/DD/YYYY or DD/MM/YYYY format |
| Price not recognized | Remove letters, use `12.50` not `12.50 USD` |
| Multiple orders import as one | Add clear separator like "---" or "NEW ORDER" |
| Nothing happens when uploading | Check file is actual PDF with extractable text |
| Import successful but no data | Verify required fields are present in PDF |

For more details, see **PDF_IMPORT_GUIDE.md** Troubleshooting section.

---

## 📞 Need Help?

1. **Understanding requirements** → Read QUICK_REFERENCE.md
2. **Complete reference** → Read PDF_IMPORT_GUIDE.md
3. **Testing API** → Use generate_sample_pdf.py script
4. **Common issues** → Check QUICK_REFERENCE.md or PDF_IMPORT_GUIDE.md troubleshooting
5. **API endpoints** → See API_CONTRACT.md

---

## 📁 File Locations

```
IntoSourcing/
├── PDF_IMPORT_GUIDE.md              ← Full technical documentation
├── QUICK_REFERENCE.md               ← Quick lookup guide
├── SAMPLE_PDF_CONTENT.txt           ← Sample content (text format)
├── generate_sample_pdf.py           ← Python script for PDF generation
├── PDF_IMPORT_INDEX.md              ← This file
├── API_CONTRACT.md                  ← API endpoint documentation
│
└── src/main/java/com/intosourcing/
    ├── service/extraction/
    │   └── PDFExtractionService.java ← Extraction logic
    ├── service/transformation/
    │   └── DataTransformationService.java ← Validation logic
    └── controller/
        └── DataImportController.java ← API endpoints
```

---

**Created**: April 20, 2026  
**Last Updated**: Today  
**Status**: ✅ Complete and Ready to Use


