package com.intosourcing.service.transformation;

import com.intosourcing.model.entity.*;
import com.intosourcing.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

@Slf4j
@Service
public class DataTransformationService {

    private final SupplierRepository supplierRepository;
    private final BrandRepository brandRepository;
    private final BuyerRepository buyerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public DataTransformationService(
            SupplierRepository supplierRepository,
            BrandRepository brandRepository,
            BuyerRepository buyerRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            PurchaseOrderRepository purchaseOrderRepository) {
        this.supplierRepository = supplierRepository;
        this.brandRepository = brandRepository;
        this.buyerRepository = buyerRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    public PurchaseOrder transformToPurchaseOrder(Map<String, String> rawData, String sourceFile) throws ValidationException {
        PurchaseOrder po = new PurchaseOrder();

        // Order Number (required)
        String orderNumber = rawData.get("orderNumber");
        if (orderNumber == null || orderNumber.isEmpty()) {
            throw new ValidationException("Order number is required");
        }
        po.setOrderNumber(normalizeString(orderNumber));

        // Check for duplicate
        if (purchaseOrderRepository.findByOrderNumber(po.getOrderNumber()).isPresent()) {
            throw new ValidationException("Order number already exists: " + orderNumber);
        }

        // Supplier
        Supplier supplier = getOrCreateSupplier(rawData.get("supplierName"));
        po.setSupplier(supplier);

        // Buyer
        Buyer buyer = getOrCreateBuyer(rawData.get("buyerName"));
        po.setBuyer(buyer);

        // Dates
        po.setOrderDate(parseDate(rawData.get("orderDate")));
        po.setConfirmedExFactoryDate(parseDate(rawData.get("exFactoryDate")));
        po.setExpectedDeliveryDate(parseDate(rawData.get("deliveryDate")));

        // Price
        String priceStr = rawData.get("price");
        if (priceStr != null && !priceStr.isEmpty()) {
            try {
                po.setTotalOrderValue(new BigDecimal(priceStr.replaceAll("[^\\d.]", "")));
            } catch (NumberFormatException e) {
                log.warn("Could not parse price: {}", priceStr);
                po.setTotalOrderValue(BigDecimal.ZERO);
            }
        } else {
            po.setTotalOrderValue(BigDecimal.ZERO);
        }

        po.setCurrency("USD");
        po.setStatus(PurchaseOrder.OrderStatus.PENDING);
        po.setSourceFile(sourceFile);
        po.setActive(true);

        return po;
    }

    public Product transformToProduct(Map<String, String> rawData) throws ValidationException {
        Product product = new Product();

        // Style Number (required)
        String styleNumber = rawData.get("styleNumber");
        if (styleNumber == null || styleNumber.isEmpty()) {
            throw new ValidationException("Style number is required");
        }
        product.setStyleNumber(normalizeString(styleNumber));

        // Check if product already exists
        if (productRepository.findByStyleNumber(product.getStyleNumber()).isPresent()) {
            return productRepository.findByStyleNumber(product.getStyleNumber()).get();
        }

        // Brand
        Brand brand = getOrCreateBrand(rawData.get("brandName"));
        product.setBrand(brand);

        // Category
        Category category = getOrCreateCategory(rawData.get("category"));
        product.setCategory(category);

        // Product name
        String productName = rawData.get("brandName");
        if (productName != null) {
            productName += " - " + rawData.get("styleNumber");
        } else {
            productName = rawData.get("styleNumber");
        }
        product.setName(productName.substring(0, Math.min(productName.length(), 500)));

        // Price
        String priceStr = rawData.get("price");
        if (priceStr != null && !priceStr.isEmpty()) {
            try {
                product.setBasePrice(new BigDecimal(priceStr.replaceAll("[^\\d.]", "")));
            } catch (NumberFormatException e) {
                log.warn("Could not parse product price: {}", priceStr);
                product.setBasePrice(BigDecimal.ZERO);
            }
        }

        product.setCurrency("USD");
        product.setActive(true);

        return product;
    }

    public OrderItem transformToOrderItem(PurchaseOrder po, Product product, Map<String, String> rawData) {
        OrderItem item = new OrderItem();

        item.setPurchaseOrder(po);
        item.setProduct(product);

        // Quantity
        String qtyStr = rawData.get("orderQuantity");
        if (qtyStr != null && !qtyStr.isEmpty()) {
            try {
                item.setOrderQuantity(Integer.parseInt(qtyStr.replaceAll("[^\\d]", "")));
            } catch (NumberFormatException e) {
                log.warn("Could not parse quantity: {}", qtyStr);
                item.setOrderQuantity(0);
            }
        }

        // Unit Price
        String priceStr = rawData.get("price");
        if (priceStr != null && !priceStr.isEmpty()) {
            try {
                item.setUnitPrice(new BigDecimal(priceStr.replaceAll("[^\\d.]", "")));
            } catch (NumberFormatException e) {
                item.setUnitPrice(BigDecimal.ZERO);
            }
        }

        item.setCurrency("USD");
        item.setReceivedQuantity(0);
        item.setActive(true);

        // Calculate total
        if (item.getUnitPrice() != null && item.getOrderQuantity() != null) {
            item.setTotalPrice(item.getUnitPrice().multiply(new BigDecimal(item.getOrderQuantity())));
        }

        return item;
    }

    // Helper methods

    private Supplier getOrCreateSupplier(String supplierName) throws ValidationException {
        if (supplierName == null || supplierName.isEmpty()) {
            throw new ValidationException("Supplier name is required");
        }

        String normalized = normalizeString(supplierName);
        Optional<Supplier> existing = supplierRepository.findByName(normalized);

        if (existing.isPresent()) {
            return existing.get();
        }

        Supplier supplier = new Supplier();
        supplier.setCode(generateCode(normalized, 3));
        supplier.setName(normalized);
        supplier.setActive(true);

        return supplierRepository.save(supplier);
    }

    private Brand getOrCreateBrand(String brandName) throws ValidationException {
        if (brandName == null || brandName.isEmpty()) {
            throw new ValidationException("Brand name is required");
        }

        String normalized = normalizeString(brandName);
        Optional<Brand> existing = brandRepository.findByName(normalized);

        if (existing.isPresent()) {
            return existing.get();
        }

        Brand brand = new Brand();
        brand.setCode(generateCode(normalized, 3));
        brand.setName(normalized);
        brand.setActive(true);

        return brandRepository.save(brand);
    }

    private Buyer getOrCreateBuyer(String buyerName) throws ValidationException {
        if (buyerName == null || buyerName.isEmpty()) {
            throw new ValidationException("Buyer name is required");
        }

        String normalized = normalizeString(buyerName);
        Optional<Buyer> existing = buyerRepository.findByName(normalized);

        if (existing.isPresent()) {
            return existing.get();
        }

        Buyer buyer = new Buyer();
        buyer.setCode(generateCode(normalized, 2));
        buyer.setName(normalized);
        buyer.setActive(true);

        return buyerRepository.save(buyer);
    }

    private Category getOrCreateCategory(String categoryName) throws ValidationException {
        if (categoryName == null || categoryName.isEmpty()) {
            throw new ValidationException("Category is required");
        }

        String normalized = normalizeString(categoryName);
        Optional<Category> existing = categoryRepository.findByName(normalized);

        if (existing.isPresent()) {
            return existing.get();
        }

        Category category = new Category();
        category.setCode(generateCode(normalized, 3));
        category.setName(normalized);
        category.setActive(true);

        return categoryRepository.save(category);
    }

    private String normalizeString(String str) {
        return str.trim()
                .replaceAll("\\s+", " ")
                .replaceAll("[^a-zA-Z0-9\\s\\-]", "")
                .trim();
    }

    private String generateCode(String name, int length) {
        return name.substring(0, Math.min(length, name.length()))
                .toUpperCase()
                .replaceAll("[^A-Z0-9]", "");
    }

    private LocalDate parseDate(String dateStr) throws ValidationException {
        if (dateStr == null || dateStr.isEmpty()) {
            return LocalDate.now();
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        try {
            return LocalDate.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            log.warn("Could not parse date: {}", dateStr);
            return LocalDate.now();
        }
    }

    public static class ValidationException extends Exception {
        public ValidationException(String message) {
            super(message);
        }

        public ValidationException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}

