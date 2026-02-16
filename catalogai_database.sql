-- ============================================================
-- CatalogAI Database Schema
-- Database: sp_login_db
-- ============================================================

-- Drop existing tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS `product_sources`;
DROP TABLE IF EXISTS `export_history`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `catalog_sessions`;
DROP TABLE IF EXISTS `brand_voices`;
DROP TABLE IF EXISTS `data_sources`;
DROP TABLE IF EXISTS `users`;

-- ============================================================
-- USERS TABLE
-- Stores user authentication and profile information
-- ============================================================
CREATE TABLE `users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `role` ENUM('Admin', 'Manager', 'User') DEFAULT 'User',
  `company` VARCHAR(255) DEFAULT NULL,
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DATA SOURCES TABLE
-- Stores configuration for external data sources (Amazon, Alibaba, Google)
-- ============================================================
CREATE TABLE `data_sources` (
  `source_id` INT(11) NOT NULL AUTO_INCREMENT,
  `source_name` VARCHAR(100) NOT NULL,
  `source_type` ENUM('Amazon', 'Alibaba', 'Google', 'Custom') NOT NULL,
  `api_endpoint` VARCHAR(255) DEFAULT NULL,
  `api_key` VARCHAR(255) DEFAULT NULL,
  `trust_score` DECIMAL(5,2) DEFAULT 0.00,
  `color_code` VARCHAR(7) DEFAULT '#3B82F6',
  `is_active` TINYINT(1) DEFAULT 1,
  `total_queries` INT(11) DEFAULT 0,
  `successful_queries` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`source_id`),
  KEY `idx_source_name` (`source_name`),
  KEY `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- BRAND VOICES TABLE
-- Stores brand voice configurations for AI-generated descriptions
-- ============================================================
CREATE TABLE `brand_voices` (
  `voice_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `voice_name` VARCHAR(100) NOT NULL,
  `tone` VARCHAR(50) DEFAULT 'Professional',
  `style` VARCHAR(50) DEFAULT 'Informative',
  `keywords` TEXT DEFAULT NULL,
  `sample_text` TEXT DEFAULT NULL,
  `is_default` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`voice_id`),
  KEY `idx_user_id` (`user_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CATALOG SESSIONS TABLE
-- Stores search/catalog sessions with metadata
-- ============================================================
CREATE TABLE `catalog_sessions` (
  `session_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `session_name` VARCHAR(255) DEFAULT NULL,
  `search_query` VARCHAR(500) NOT NULL,
  `search_method` ENUM('text', 'barcode', 'image', 'file') DEFAULT 'text',
  `total_products_found` INT(11) DEFAULT 0,
  `products_exported` INT(11) DEFAULT 0,
  `current_step` TINYINT(1) DEFAULT 0,
  `status` ENUM('searching', 'reviewing', 'exporting', 'completed', 'cancelled') DEFAULT 'searching',
  `avg_confidence_score` DECIMAL(5,2) DEFAULT 0.00,
  `processing_time_seconds` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PRODUCTS TABLE
-- Stores product information from catalog sessions
-- ============================================================
CREATE TABLE `products` (
  `product_id` INT(11) NOT NULL AUTO_INCREMENT,
  `session_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `product_title` VARCHAR(500) NOT NULL,
  `product_description` TEXT DEFAULT NULL,
  `ai_description` TEXT DEFAULT NULL,
  `price` DECIMAL(10,2) DEFAULT NULL,
  `currency` VARCHAR(3) DEFAULT 'USD',
  `image_url` VARCHAR(1000) DEFAULT NULL,
  `product_url` VARCHAR(1000) DEFAULT NULL,
  `sku` VARCHAR(100) DEFAULT NULL,
  `barcode` VARCHAR(100) DEFAULT NULL,
  `category` VARCHAR(255) DEFAULT NULL,
  `brand` VARCHAR(255) DEFAULT NULL,
  `confidence_score` DECIMAL(5,2) DEFAULT 0.00,
  `is_ai_generated` TINYINT(1) DEFAULT 0,
  `is_verified` TINYINT(1) DEFAULT 0,
  `is_exported` TINYINT(1) DEFAULT 0,
  `metadata` JSON DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_sku` (`sku`),
  KEY `idx_barcode` (`barcode`),
  KEY `idx_category` (`category`),
  KEY `idx_confidence_score` (`confidence_score`),
  FULLTEXT KEY `ft_title_description` (`product_title`, `product_description`),
  FOREIGN KEY (`session_id`) REFERENCES `catalog_sessions`(`session_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PRODUCT SOURCES TABLE
-- Links products to their data sources (many-to-many relationship)
-- ============================================================
CREATE TABLE `product_sources` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `product_id` INT(11) NOT NULL,
  `source_id` INT(11) NOT NULL,
  `source_product_id` VARCHAR(255) DEFAULT NULL,
  `source_url` VARCHAR(1000) DEFAULT NULL,
  `source_price` DECIMAL(10,2) DEFAULT NULL,
  `source_rating` DECIMAL(3,2) DEFAULT NULL,
  `source_reviews_count` INT(11) DEFAULT 0,
  `source_availability` TINYINT(1) DEFAULT 1,
  `fetched_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_source_id` (`source_id`),
  UNIQUE KEY `unique_product_source` (`product_id`, `source_id`),
  FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE,
  FOREIGN KEY (`source_id`) REFERENCES `data_sources`(`source_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- EXPORT HISTORY TABLE
-- Tracks export operations and file downloads
-- ============================================================
CREATE TABLE `export_history` (
  `export_id` INT(11) NOT NULL AUTO_INCREMENT,
  `session_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `export_format` ENUM('csv', 'excel', 'json', 'pdf') NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(500) DEFAULT NULL,
  `file_size_kb` INT(11) DEFAULT 0,
  `products_count` INT(11) DEFAULT 0,
  `export_status` ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  `error_message` TEXT DEFAULT NULL,
  `download_count` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `completed_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`export_id`),
  KEY `idx_session_id` (`session_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_export_format` (`export_format`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`session_id`) REFERENCES `catalog_sessions`(`session_id`) ON DELETE CASCADE,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INSERT DEFAULT DATA
-- ============================================================

-- Insert default data sources
INSERT INTO `data_sources` (`source_name`, `source_type`, `trust_score`, `color_code`, `is_active`) VALUES
('Amazon', 'Amazon', 94.00, '#FF9900', 1),
('Alibaba', 'Alibaba', 87.00, '#FF6A00', 1),
('Google Shopping', 'Google', 91.00, '#4285F4', 1);

-- Insert demo admin user (password: admin123 - hashed with PASSWORD_DEFAULT in PHP)
-- Note: You should hash this properly in PHP using password_hash()
INSERT INTO `users` (`email`, `password`, `first_name`, `last_name`, `role`, `company`) VALUES
('admin@catalogai.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Chen', 'Admin', 'CatalogAI Inc.'),
('demo@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo', 'User', 'User', 'Demo Company');

-- ============================================================
-- USEFUL VIEWS
-- ============================================================

-- View for user analytics dashboard
CREATE OR REPLACE VIEW `user_analytics` AS
SELECT 
    u.user_id,
    u.email,
    u.first_name,
    u.last_name,
    COUNT(DISTINCT cs.session_id) AS total_sessions,
    COUNT(DISTINCT p.product_id) AS total_products,
    AVG(p.confidence_score) AS avg_confidence,
    COUNT(DISTINCT e.export_id) AS total_exports,
    MAX(cs.created_at) AS last_session_date
FROM users u
LEFT JOIN catalog_sessions cs ON u.user_id = cs.user_id
LEFT JOIN products p ON u.user_id = p.user_id
LEFT JOIN export_history e ON u.user_id = e.user_id
GROUP BY u.user_id;

-- View for recent products with source information
CREATE OR REPLACE VIEW `recent_products_with_sources` AS
SELECT 
    p.product_id,
    p.product_title,
    p.product_description,
    p.price,
    p.image_url,
    p.confidence_score,
    p.created_at,
    u.email AS user_email,
    GROUP_CONCAT(DISTINCT ds.source_name SEPARATOR ', ') AS sources,
    COUNT(DISTINCT ps.source_id) AS source_count
FROM products p
JOIN users u ON p.user_id = u.user_id
LEFT JOIN product_sources ps ON p.product_id = ps.product_id
LEFT JOIN data_sources ds ON ps.source_id = ds.source_id
GROUP BY p.product_id
ORDER BY p.created_at DESC;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

DELIMITER $$

-- Procedure to get dashboard statistics for a user
CREATE PROCEDURE `get_user_dashboard_stats`(IN p_user_id INT)
BEGIN
    SELECT 
        COUNT(DISTINCT p.product_id) AS total_products,
        COUNT(DISTINCT cs.session_id) AS total_sessions,
        AVG(p.confidence_score) AS avg_confidence,
        COUNT(DISTINCT CASE WHEN p.is_ai_generated = 1 THEN p.product_id END) AS ai_generated_products,
        AVG(cs.processing_time_seconds) AS avg_processing_time,
        COUNT(DISTINCT e.export_id) AS total_exports
    FROM users u
    LEFT JOIN products p ON u.user_id = p.user_id
    LEFT JOIN catalog_sessions cs ON u.user_id = cs.user_id
    LEFT JOIN export_history e ON u.user_id = e.user_id
    WHERE u.user_id = p_user_id;
END$$

-- Procedure to calculate AI description usage percentage
CREATE PROCEDURE `get_ai_usage_stats`(IN p_user_id INT)
BEGIN
    SELECT 
        COUNT(*) AS total_products,
        SUM(CASE WHEN is_ai_generated = 1 THEN 1 ELSE 0 END) AS ai_generated,
        ROUND((SUM(CASE WHEN is_ai_generated = 1 THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS ai_percentage
    FROM products
    WHERE user_id = p_user_id;
END$$

-- Procedure to update data source trust scores
CREATE PROCEDURE `update_source_trust_scores`()
BEGIN
    UPDATE data_sources ds
    SET trust_score = (
        SELECT AVG(p.confidence_score)
        FROM products p
        JOIN product_sources ps ON p.product_id = ps.product_id
        WHERE ps.source_id = ds.source_id
    )
    WHERE ds.source_id IN (SELECT DISTINCT source_id FROM product_sources);
END$$

DELIMITER ;

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_user_session_date ON catalog_sessions(user_id, created_at);
CREATE INDEX idx_product_session_user ON products(session_id, user_id);
CREATE INDEX idx_export_user_date ON export_history(user_id, created_at);

-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER $$

-- Trigger to update session statistics when products are added
CREATE TRIGGER `after_product_insert` 
AFTER INSERT ON `products`
FOR EACH ROW
BEGIN
    UPDATE catalog_sessions 
    SET 
        total_products_found = total_products_found + 1,
        avg_confidence_score = (
            SELECT AVG(confidence_score) 
            FROM products 
            WHERE session_id = NEW.session_id
        )
    WHERE session_id = NEW.session_id;
END$$

-- Trigger to update user's last login time
CREATE TRIGGER `update_last_login`
BEFORE UPDATE ON `users`
FOR EACH ROW
BEGIN
    IF NEW.is_active = 1 AND OLD.is_active = 0 THEN
        SET NEW.last_login = CURRENT_TIMESTAMP;
    END IF;
END$$

-- Trigger to increment data source query counts
CREATE TRIGGER `after_product_source_insert`
AFTER INSERT ON `product_sources`
FOR EACH ROW
BEGIN
    UPDATE data_sources
    SET 
        total_queries = total_queries + 1,
        successful_queries = successful_queries + 1
    WHERE source_id = NEW.source_id;
END$$

DELIMITER ;

-- ============================================================
-- GRANTS (Optional - for specific database user)
-- ============================================================

-- Create a specific user for the application (optional)
-- CREATE USER 'catalogai_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON sp_login_db.* TO 'catalogai_user'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
