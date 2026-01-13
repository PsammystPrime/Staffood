-- Settings Table Migration
-- Created: January 2026

USE staffoods;

CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    delivery_fee DECIMAL(10, 2) DEFAULT 100.00,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT single_row CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings if not exists
INSERT IGNORE INTO settings (id, delivery_fee) VALUES (1, 100.00);
