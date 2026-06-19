CREATE TABLE `products`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(70) NOT NULL,
    `description` TEXT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `rarity` ENUM('common', 'rare', 'legendary') NOT NULL,
    `image` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
ALTER TABLE `products` ADD UNIQUE `products_name_unique`(`name`);
ALTER TABLE `products` ADD UNIQUE `products_slug_unique`(`slug`);
ALTER TABLE `products` ADD UNIQUE `products_image_unique`(`image`);

CREATE TABLE `categories`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(70) NOT NULL,
    `description` TEXT NOT NULL
);
ALTER TABLE `categories` ADD UNIQUE `categories_name_unique`(`name`);
ALTER TABLE `categories` ADD UNIQUE `categories_slug_unique`(`slug`);

CREATE TABLE `category_product`(
    `product_id` BIGINT UNSIGNED NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(`product_id`, `category_id`)
);
ALTER TABLE `category_product` ADD INDEX `category_product_category_id_index`(`category_id`);

ALTER TABLE `category_product`
    ADD CONSTRAINT `category_product_product_id_foreign`
    FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
    ON DELETE CASCADE;
ALTER TABLE `category_product`
    ADD CONSTRAINT `category_product_category_id_foreign`
    FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`)
    ON DELETE CASCADE;
    
CREATE TABLE `orders`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(10) NOT NULL,
    `customer_name` VARCHAR(100) NOT NULL,
    `customer_address` VARCHAR(100) NOT NULL,
    `customer_city` VARCHAR(20) NOT NULL,
    `customer_postal_code` CHAR(5) NOT NULL,
    `notes` TEXT NOT NULL,
    `telephone_number` VARCHAR(15) NOT NULL,
    `mail` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
);
ALTER TABLE `orders` ADD UNIQUE `orders_order_number_unique`(`order_number`);

    
CREATE TABLE `order_product`(
    `order_id` BIGINT UNSIGNED NOT NULL,
    `product_id` BIGINT UNSIGNED NOT NULL,
    `quantity` SMALLINT NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY(`order_id`, `product_id`)
);
ALTER TABLE `order_product` ADD INDEX `order_product_product_id_index`(`product_id`);

ALTER TABLE `order_product`
    ADD CONSTRAINT `order_product_order_id_foreign`
    FOREIGN KEY(`order_id`) REFERENCES `orders`(`id`)
    ON DELETE CASCADE;
ALTER TABLE `order_product`
    ADD CONSTRAINT `order_product_product_id_foreign`
    FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
    ON DELETE RESTRICT;