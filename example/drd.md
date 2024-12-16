# Database Requirements Document (DRD) for Totem E-commerce Platform

## 1. Introduction

This document outlines the comprehensive database requirements for the Totem e-commerce platform. The database design considers all key personas, features, and use cases to ensure a robust and scalable solution for SMBs and startups.

## 2. Database Overview

Totem will utilize a hybrid database approach:
1. Relational Database (e.g., PostgreSQL) for transactional data and structured relationships
2. NoSQL Database (e.g., MongoDB) for product catalog and flexible attribute storage

Justification: This hybrid approach allows for ACID compliance in critical transactional data while providing flexibility for varied product structures and attributes.

## 3. Relational Database Schemas

### 3.1 Users

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_admin BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active'
);
```

Justification: This table stores essential user information for both customers and administrators. The `is_admin` flag differentiates between regular users and store administrators.

### 3.2 Addresses

```sql
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    address_type VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(255),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE
);
```

Justification: Separating addresses from the users table allows for multiple addresses per user and supports both shipping and billing addresses.

### 3.3 Categories

```sql
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES categories(id),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Justification: This self-referencing table allows for a hierarchical category structure, supporting multi-level categorization of products.

### 3.4 Tags

```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);
```

Justification: Tags provide a flexible way to group products across categories.

### 3.5 Orders

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    shipping_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    shipping_address_id INTEGER REFERENCES addresses(id),
    billing_address_id INTEGER REFERENCES addresses(id),
    payment_method VARCHAR(50),
    shipping_method VARCHAR(100),
    tracking_number VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Justification: This table captures all essential order information, including references to addresses and various amount breakdowns.

### 3.6 Order Items

```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id VARCHAR(255) NOT NULL,
    variant_id VARCHAR(255),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    sku VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    weight DECIMAL(10, 2),
    options JSONB
);
```

Justification: Order items are stored separately to allow for multiple items per order. The `product_id` and `variant_id` are stored as strings to accommodate the NoSQL product IDs.

### 3.7 Payments

```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Justification: This table tracks all payments associated with orders, allowing for multiple payments per order if needed.

### 3.8 Refunds

```sql
CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    reason TEXT,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Justification: Storing refunds separately allows for tracking partial refunds and maintaining a clear order history.

### 3.9 Warehouses

```sql
CREATE TABLE warehouses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address_id INTEGER REFERENCES addresses(id),
    is_active BOOLEAN DEFAULT TRUE
);
```

Justification: This table supports multi-warehouse inventory management.

### 3.10 Inventory

```sql
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    variant_id VARCHAR(255),
    warehouse_id INTEGER REFERENCES warehouses(id),
    quantity INTEGER NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Justification: This table tracks inventory levels across multiple warehouses for each product and variant.

### 3.11 Wishlists

```sql
CREATE TABLE wishlists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wishlist_items (
    id SERIAL PRIMARY KEY,
    wishlist_id INTEGER REFERENCES wishlists(id),
    product_id VARCHAR(255) NOT NULL,
    variant_id VARCHAR(255),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Justification: These tables allow users to create multiple named wishlists and add products to them.

### 3.12 Coupons

```sql
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    min_purchase_amount DECIMAL(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

Justification: This table supports various types of discount coupons with usage tracking.

### 3.13 Reviews

```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    rating INTEGER NOT NULL,
    title VARCHAR(255),
    content TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Justification: Storing reviews separately allows for easy moderation and display of product reviews.

### 3.14 Plugins

```sql
CREATE TABLE plugins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'inactive',
    settings JSONB,
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Justification: This table tracks installed plugins and their configurations, supporting the extensibility feature of Totem.

### 3.15 Webhooks

```sql
CREATE TABLE webhooks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    event_type VARCHAR(100) NOT NULL,
    target_url VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Justification: This table stores webhook configurations for real-time event notifications to external systems.

## 4. NoSQL Database Schemas

### 4.1 Products

```json
{
  "_id": "ObjectId",
  "name": "String",
  "slug": "String",
  "sku": "String",
  "description": "String",
  "short_description": "String",
  "price": "Decimal",
  "compare_at_price": "Decimal",
  "cost_price": "Decimal",
  "status": "String",
  "vendor": "String",
  "categories": ["String"],
  "tags": ["String"],
  "attributes": {
    "color": "String",
    "size": "String",
    "material": "String",
    // ... other custom attributes
  },
  "variants": [
    {
      "_id": "ObjectId",
      "sku": "String",
      "attributes": {
        "color": "String",
        "size": "String"
      },
      "price": "Decimal",
      "compare_at_price": "Decimal",
      "cost_price": "Decimal",
      "weight": "Decimal",
      "dimensions": {
        "length": "Decimal",
        "width": "Decimal",
        "height": "Decimal"
      }
    }
  ],
  "images": [
    {
      "url": "String",
      "alt": "String",
      "position": "Integer"
    }
  ],
  "seo": {
    "title": "String",
    "description": "String",
    "keywords": "String"
  },
  "created_at": "Date",
  "updated_at": "Date"
}
```

Justification: Using a NoSQL structure for products allows for flexible attribute storage and easy addition of new fields without schema modifications. This is particularly useful for supporting various product types with different attributes.

### 4.2 Content Pages

```json
{
  "_id": "ObjectId",
  "title": "String",
  "slug": "String",
  "content": "String",
  "meta_title": "String",
  "meta_description": "String",
  "status": "String",
  "author_id": "Integer",
  "created_at": "Date",
  "updated_at": "Date",
  "published_at": "Date"
}
```

Justification: Storing content pages in a NoSQL format allows for easy addition of custom fields and supports rich content structures.

## 5. Indexes

### 5.1 Relational Database Indexes

- `users`: email
- `categories`: slug, parent_id
- `orders`: user_id, status, created_at
- `order_items`: order_id, product_id
- `inventory`: product_id, variant_id, warehouse_id
- `coupons`: code
- `reviews`: product_id, user_id, status

### 5.2 NoSQL Database Indexes

- `products`: slug, sku, status, categories, tags
- `content_pages`: slug, status

Justification: These indexes are crucial for improving query performance on frequently accessed fields and supporting efficient filtering and sorting operations.

## 6. Data Relationships

1. Users to Orders: One-to-Many
2. Orders to Order Items: One-to-Many
3. Products to Order Items: One-to-Many
4. Users to Addresses: One-to-Many
5. Categories to Products: Many-to-Many (stored in NoSQL product document)
6. Tags to Products: Many-to-Many (stored in NoSQL product document)
7. Warehouses to Inventory: One-to-Many
8. Users to Wishlists: One-to-Many
9. Wishlists to Products: Many-to-Many

Justification: These relationships reflect the natural associations between entities in an e-commerce system and support efficient data retrieval and maintenance.

## 7. Data Migration and Scalability Considerations

1. Implement database sharding for the products collection in the NoSQL database to handle large catalogs.
2. Use read replicas for the relational database to distribute read operations and improve performance.
3. Implement a caching layer (e.g., Redis) for frequently accessed data like product information and user sessions.
4. Design a data archiving strategy for historical orders and inactive products to maintain performance as data grows.

Justification: These considerations ensure that the database can scale to handle growing data volumes and increasing user loads typical of successful e-commerce platforms.

## 8. Conclusion

This database design provides a robust and flexible foundation for the Totem e-commerce platform. By utilizing a hybrid approach with both relational and NoSQL databases, we can efficiently handle structured transactional data while providing the flexibility needed for diverse product catalogs and custom attributes. The design supports all key features outlined in the PRD and FRD, including multi-warehouse inventory management, order processing, user management, and extensibility through plugins and webhooks.