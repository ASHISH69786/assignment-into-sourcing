#!/usr/bin/env python3
"""
Sample PDF Generator for Purchase Order Import API
This script generates a sample PDF that can be imported by the PDF import API.

Usage:
    python3 generate_sample_pdf.py [output_file.pdf]

Default output: sample_purchase_order.pdf
"""

import sys
from datetime import datetime, timedelta

def generate_sample_pdf(output_path="sample_purchase_order.pdf"):
    """Generate a sample purchase order PDF"""
    try:
        from fpdf import FPDF

        print(f"Generating sample PDF: {output_path}")

        # Create PDF
        pdf = FPDF()
        pdf.add_page()

        # Title
        pdf.set_font("Arial", "B", 16)
        pdf.cell(0, 10, "PURCHASE ORDER", ln=True, align="C")
        pdf.ln(5)

        # Order details
        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Order Number:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, "PO-2024-001", border=1, ln=True)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Supplier:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, "ABC Textiles Manufacturing Co.", border=1, ln=True)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Brand:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, "PrettyLittleThing", border=1, ln=True)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Buyer:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, "Fashion Direct Ltd.", border=1, ln=True)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Category:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, "Dresses - Casual Wear", border=1, ln=True)

        # Product details
        pdf.ln(5)
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 10, "PRODUCT DETAILS", ln=True)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Style Number:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, "HZZ53685", border=1, ln=True)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Order Quantity:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, "5,000", border=1, ln=True)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Price (per unit):", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, "$12.50", border=1, ln=True)

        # Dates
        pdf.ln(5)
        pdf.set_font("Arial", "B", 12)
        pdf.cell(0, 10, "KEY DATES", ln=True)

        today = datetime.now()
        ex_factory = today + timedelta(days=5)
        delivery = today + timedelta(days=35)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Order Date:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, today.strftime("%m/%d/%Y"), border=1, ln=True)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Ex-Factory Date:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, ex_factory.strftime("%m/%d/%Y"), border=1, ln=True)

        pdf.set_font("Arial", "B", 11)
        pdf.cell(60, 8, "Expected Delivery Date:", border=1)
        pdf.set_font("Arial", "", 11)
        pdf.cell(0, 8, delivery.strftime("%m/%d/%Y"), border=1, ln=True)

        # Save
        pdf.output(output_path)
        print(f"✅ PDF created successfully: {output_path}")
        print(f"\nYou can now test the import API with:")
        print(f'   curl -X POST "http://localhost:8080/api/import/pdf" \\')
        print(f'     -F "file=@{output_path}"')
        return True

    except ImportError:
        print("❌ fpdf2 is not installed")
        print("\nInstall it with:")
        print("   pip3 install fpdf2")
        return False
    except Exception as e:
        print(f"❌ Error creating PDF: {e}")
        return False

if __name__ == "__main__":
    output_file = sys.argv[1] if len(sys.argv) > 1 else "sample_purchase_order.pdf"
    success = generate_sample_pdf(output_file)
    sys.exit(0 if success else 1)

