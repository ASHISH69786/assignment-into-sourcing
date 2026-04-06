-- PostgreSQL Schema for Purchase Order System
-- Run this script after database creation for initial schema setup

-- Create schema if not exists
CREATE SCHEMA IF NOT EXISTS public;

-- Suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    country VARCHAR(100),
    city VARCHAR(100),
    email VARCHAR(255),
    phone_number VARCHAR(20),
    address VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_supplier_name ON suppliers(name);
CREATE INDEX idx_supplier_code ON suppliers(code);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    country VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_brand_name ON brands(name);
CREATE INDEX idx_brand_code ON brands(code);

-- Buyers table
CREATE TABLE IF NOT EXISTS buyers (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    email VARCHAR(255),
    phone_number VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_buyer_name ON buyers(name);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_category_name ON categories(name);
CREATE INDEX idx_category_code ON categories(code);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    style_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(500) NOT NULL,
    description VARCHAR(500),
    brand_id BIGINT NOT NULL REFERENCES brands(id),
    category_id BIGINT NOT NULL REFERENCES categories(id),
    color VARCHAR(50),
    size VARCHAR(50),
    sku VARCHAR(50),
    base_price NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_style_number ON products(style_number);
CREATE INDEX idx_product_name ON products(name);

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id BIGINT NOT NULL REFERENCES suppliers(id),
    buyer_id BIGINT NOT NULL REFERENCES buyers(id),
    order_date DATE NOT NULL,
    confirmed_ex_factory_date DATE NOT NULL,
    expected_delivery_date DATE NOT NULL,
    actual_delivery_date DATE,
    total_order_value NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'PENDING',
    notes VARCHAR(500),
    source_file VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_order_number ON purchase_orders(order_number);
CREATE INDEX idx_po_supplier_id ON purchase_orders(supplier_id);
CREATE INDEX idx_po_buyer_id ON purchase_orders(buyer_id);
CREATE INDEX idx_po_order_date ON purchase_orders(order_date);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id),
    order_quantity INTEGER NOT NULL,
    unit_price NUMERIC(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    total_price NUMERIC(12, 2),
    received_quantity INTEGER DEFAULT 0,
    size VARCHAR(50),
    color VARCHAR(50),
    notes VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_items_po_id ON order_items(purchase_order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Data Imports table (for tracking import history)
CREATE TABLE IF NOT EXISTS data_imports (
    id BIGSERIAL PRIMARY KEY,
    source_file VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_records INTEGER DEFAULT 0,
    successful_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    error_log TEXT,
    import_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP,
    imported_by VARCHAR(100)
);

CREATE INDEX idx_import_source_file ON data_imports(source_file);
CREATE INDEX idx_import_import_date ON data_imports(import_date);

-- Create views for common queries

-- View: Orders with supplier and buyer details
CREATE OR REPLACE VIEW vw_orders_summary AS
SELECT
    po.id,
    po.order_number,
    s.name as supplier_name,
    b.name as buyer_name,
    po.order_date,
    po.expected_delivery_date,
    po.actual_delivery_date,
    po.total_order_value,
    po.currency,
    po.status,
    COUNT(oi.id) as line_items_count
FROM purchase_orders po
LEFT JOIN suppliers s ON po.supplier_id = s.id
LEFT JOIN buyers b ON po.buyer_id = b.id
LEFT JOIN order_items oi ON po.id = oi.purchase_order_id
GROUP BY po.id, s.name, b.name;

-- View: Delivery performance by supplier
CREATE OR REPLACE VIEW vw_delivery_performance AS
SELECT
    s.id,
    s.name as supplier_name,
    COUNT(po.id) as total_orders,
    SUM(CASE WHEN po.actual_delivery_date <= po.expected_delivery_date AND po.actual_delivery_date IS NOT NULL THEN 1 ELSE 0 END) as on_time_orders,
    ROUND(100.0 * SUM(CASE WHEN po.actual_delivery_date <= po.expected_delivery_date AND po.actual_delivery_date IS NOT NULL THEN 1 ELSE 0 END) / NULLIF(COUNT(po.id), 0), 2) as on_time_percentage
FROM suppliers s
LEFT JOIN purchase_orders po ON s.id = po.supplier_id
GROUP BY s.id, s.name;

-- View: Order value by supplier
CREATE OR REPLACE VIEW vw_value_by_supplier AS
SELECT
    s.id,
    s.name as supplier_name,
    COUNT(po.id) as order_count,
    SUM(po.total_order_value) as total_value,
    AVG(po.total_order_value) as average_value
FROM suppliers s
LEFT JOIN purchase_orders po ON s.id = po.supplier_id
GROUP BY s.id, s.name
ORDER BY total_value DESC;

-- Create stored procedures for common operations

-- Function to get orders by date range
CREATE OR REPLACE FUNCTION get_orders_by_date_range(p_start_date DATE, p_end_date DATE)
RETURNS TABLE (
    order_id BIGINT,
    order_number VARCHAR,
    supplier_name VARCHAR,
    order_value NUMERIC,
    order_status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        po.id,
        po.order_number,
        s.name,
        po.total_order_value,
        po.status
    FROM purchase_orders po
    LEFT JOIN suppliers s ON po.supplier_id = s.id
    WHERE po.order_date >= p_start_date AND po.order_date <= p_end_date
    ORDER BY po.order_date DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get supplier analytics
CREATE OR REPLACE FUNCTION get_supplier_analytics(p_supplier_id BIGINT)
RETURNS TABLE (
    total_orders BIGINT,
    total_value NUMERIC,
    average_value NUMERIC,
    on_time_percentage NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(po.id)::BIGINT,
        COALESCE(SUM(po.total_order_value), 0),
        COALESCE(AVG(po.total_order_value), 0),
        ROUND(100.0 * SUM(CASE WHEN po.actual_delivery_date <= po.expected_delivery_date AND po.actual_delivery_date IS NOT NULL THEN 1 ELSE 0 END) / NULLIF(COUNT(po.id), 0), 2)
    FROM purchase_orders po
    WHERE po.supplier_id = p_supplier_id;
END;
$$ LANGUAGE plpgsql;

COMMIT;

