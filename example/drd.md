```markdown
# Database Requirements Document (DRD) for Totem E-commerce Platform

## 1. Introduction

This Database Requirements Document (DRD) outlines the comprehensive database schema and requirements for the Totem e-commerce platform. The document is based on a thorough analysis of the Product Requirements Document (PRD) and Features Requirements Document (FRD), considering all user personas and their interactions with the system.

## 2. Database Overview

The Totem e-commerce platform requires a robust and scalable database design to support its diverse set of features and user interactions. We will use a combination of relational and NoSQL databases to optimize performance and flexibility.

### 2.1 Primary Database (Relational)

For core e-commerce functionality and data with strong relational requirements, we will use a relational database (e.g., PostgreSQL).

### 2.2 Secondary Database (NoSQL)

For features requiring high performance and flexibility, such as product catalogs and user sessions, we will use a NoSQL database (e.g., MongoDB).

## 3. Database Schemas

### 3.1 Users and Authentication

#### users
- id: integer (primary key)
- email: string
- password_hash: string
- first_name: string
- last_name: string
- phone_number: string
- created_at: timestamp
- updated_at: timestamp

Justification: This table stores essential user information and authentication details. The use of a password hash ensures security best practices.

#### user_roles
- id: integer (primary key)
- user_id: integer (foreign key referencing users.id)
- role: string (e.g., 'admin', 'store_manager', 'staff', 'customer')

Justification: Separating roles into a distinct table allows for flexible role assignments and easy role management.

#### user_addresses
- id: integer (primary key)
- user_id: integer (foreign key referencing users.id)
- address_type: string (e.g., 'billing', 'shipping')
- address_line1: string
- address_line2: string
- city: string
- state: string
- postal_code: string
- country: string
- is_default: boolean

Justification: Storing addresses separately allows users to have multiple addresses for different purposes.

### 3.2 Products and Inventory

#### products
- id: integer (primary key)
- name: string
- description: text
- sku: string
- price: decimal
- cost: decimal
- weight: decimal
- dimensions: json
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp

Justification: This table contains core product information. The use of a JSON field for dimensions allows flexibility in storing various dimension types.

#### product_categories
- id: integer (primary key)
- name: string
- parent_id: integer (foreign key referencing product_categories.id)
- slug: string
- description: text

Justification: A self-referencing table allows for a hierarchical category structure.

#### product_category_mappings
- id: integer (primary key)
- product_id: integer (foreign key referencing products.id)
- category_id: integer (foreign key referencing product_categories.id)

Justification: This mapping table allows products to belong to multiple categories.

#### product_attributes
- id: integer (primary key)
- name: string
- type: string (e.g., 'text', 'number', 'boolean', 'date')

Justification: Storing attribute definitions separately allows for flexible attribute management.

#### product_attribute_values
- id: integer (primary key)
- product_id: integer (foreign key referencing products.id)
- attribute_id: integer (foreign key referencing product_attributes.id)
- value: text

Justification: This table stores the actual attribute values for each product, allowing for dynamic attributes.

#### product_variants
- id: integer (primary key)
- product_id: integer (foreign key referencing products.id)
- sku: string
- price: decimal
- inventory_quantity: integer

Justification: Variants allow for products with multiple options (e.g., sizes, colors) to be managed effectively.

#### product_variant_attribute_values
- id: integer (primary key)
- variant_id: integer (foreign key referencing product_variants.id)
- attribute_id: integer (foreign key referencing product_attributes.id)
- value: text

Justification: This table stores attribute values specific to each product variant.

#### inventory
- id: integer (primary key)
- product_id: integer (foreign key referencing products.id)
- variant_id: integer (foreign key referencing product_variants.id)
- warehouse_id: integer (foreign key referencing warehouses.id)
- quantity: integer
- updated_at: timestamp

Justification: Tracking inventory at both product and variant levels, across multiple warehouses, allows for precise inventory management.

#### warehouses
- id: integer (primary key)
- name: string
- address: text
- is_active: boolean

Justification: Storing warehouse information separately allows for multi-warehouse inventory management.

### 3.3 Orders and Transactions

#### orders
- id: integer (primary key)
- user_id: integer (foreign key referencing users.id)
- status: string
- total_amount: decimal
- tax_amount: decimal
- shipping_amount: decimal
- discount_amount: decimal
- currency: string
- shipping_address_id: integer (foreign key referencing user_addresses.id)
- billing_address_id: integer (foreign key referencing user_addresses.id)
- created_at: timestamp
- updated_at: timestamp

Justification: This table stores essential order information, including financial details and status.

#### order_items
- id: integer (primary key)
- order_id: integer (foreign key referencing orders.id)
- product_id: integer (foreign key referencing products.id)
- variant_id: integer (foreign key referencing product_variants.id)
- quantity: integer
- price: decimal
- total: decimal

Justification: Storing order items separately allows for detailed order composition and easy order item management.

#### order_status_history
- id: integer (primary key)
- order_id: integer (foreign key referencing orders.id)
- status: string
- comment: text
- created_at: timestamp

Justification: Tracking order status changes provides a complete history of an order's lifecycle.

#### payments
- id: integer (primary key)
- order_id: integer (foreign key referencing orders.id)
- amount: decimal
- payment_method: string
- transaction_id: string
- status: string
- created_at: timestamp

Justification: Separating payment information allows for multiple payments per order and detailed payment tracking.

#### refunds
- id: integer (primary key)
- order_id: integer (foreign key referencing orders.id)
- amount: decimal
- reason: text
- status: string
- created_at: timestamp

Justification: A separate refunds table allows for tracking partial or full refunds associated with orders.

### 3.4 Customer Interactions

#### wishlists
- id: integer (primary key)
- user_id: integer (foreign key referencing users.id)
- name: string
- is_public: boolean
- created_at: timestamp
- updated_at: timestamp

Justification: Allowing multiple named wishlists per user provides flexibility for customers.

#### wishlist_items
- id: integer (primary key)
- wishlist_id: integer (foreign key referencing wishlists.id)
- product_id: integer (foreign key referencing products.id)
- variant_id: integer (foreign key referencing product_variants.id)
- added_at: timestamp

Justification: Storing wishlist items separately allows for easy management and querying of wishlist contents.

#### product_reviews
- id: integer (primary key)
- product_id: integer (foreign key referencing products.id)
- user_id: integer (foreign key referencing users.id)
- rating: integer
- title: string
- content: text
- status: string (e.g., 'pending', 'approved', 'rejected')
- created_at: timestamp

Justification: A separate reviews table allows for detailed review information and moderation status tracking.

#### abandoned_carts
- id: integer (primary key)
- user_id: integer (foreign key referencing users.id)
- created_at: timestamp
- updated_at: timestamp
- recovered_at: timestamp

Justification: Tracking abandoned carts separately enables targeted recovery efforts and analytics.

#### abandoned_cart_items
- id: integer (primary key)
- cart_id: integer (foreign key referencing abandoned_carts.id)
- product_id: integer (foreign key referencing products.id)
- variant_id: integer (foreign key referencing product_variants.id)
- quantity: integer
- added_at: timestamp

Justification: Storing cart items separately allows for detailed analysis of abandoned products.

### 3.5 Marketing and Promotions

#### coupons
- id: integer (primary key)
- code: string
- type: string (e.g., 'percentage', 'fixed_amount')
- value: decimal
- minimum_purchase: decimal
- usage_limit: integer
- start_date: timestamp
- end_date: timestamp
- is_active: boolean

Justification: A flexible coupon system allows for various promotion types and usage restrictions.

#### coupon_usage
- id: integer (primary key)
- coupon_id: integer (foreign key referencing coupons.id)
- order_id: integer (foreign key referencing orders.id)
- user_id: integer (foreign key referencing users.id)
- used_at: timestamp

Justification: Tracking coupon usage separately allows for detailed analytics and enforcement of usage limits.

#### customer_segments
- id: integer (primary key)
- name: string
- description: text
- criteria: json

Justification: Storing segment definitions with JSON criteria allows for flexible and dynamic customer segmentation.

#### customer_segment_memberships
- id: integer (primary key)
- segment_id: integer (foreign key referencing customer_segments.id)
- user_id: integer (foreign key referencing users.id)

Justification: A separate membership table allows customers to belong to multiple segments and enables efficient querying.

### 3.6 Platform Configuration and Extensions

#### store_settings
- id: integer (primary key)
- key: string
- value: text
- updated_at: timestamp

Justification: A key-value store for platform settings allows for flexible configuration options.

#### plugins
- id: integer (primary key)
- name: string
- version: string
- is_active: boolean
- settings: json

Justification: Storing plugin information and settings enables the platform's extensibility feature.

#### webhooks
- id: integer (primary key)
- user_id: integer (foreign key referencing users.id)
- event_type: string
- target_url: string
- is_active: boolean
- created_at: timestamp
- updated_at: timestamp

Justification: A webhooks table allows for flexible integration with external systems.

## 4. Indexing Strategies

To optimize query performance, the following indexes should be created:

1. users: email (unique)
2. products: sku (unique)
3. orders: user_id, status
4. inventory: product_id, variant_id, warehouse_id
5. coupons: code (unique)
6. product_reviews: product_id, user_id

Justification: These indexes target frequently queried fields and enforce uniqueness where required.

## 5. Data Retention and Archiving

Implement a data retention policy to archive old data:

1. Move completed orders older than 2 years to an archive table
2. Archive product reviews older than 5 years
3. Remove abandoned carts older than 6 months

Justification: Archiving old data helps maintain database performance while retaining historical information for analysis.

## 6. Scalability Considerations

1. Implement database sharding for the products and inventory tables based on product categories
2. Use read replicas for reporting and analytics queries
3. Implement caching layers (e.g., Redis) for frequently accessed data such as product information and user sessions

Justification: These strategies will help the database scale to handle large product catalogs and high concurrent user loads.

## 7. Data Migration and Versioning

1. Implement a database migration system to manage schema changes
2. Use semantic versioning for database schema versions
3. Maintain backwards compatibility for at least one major version

Justification: A structured approach to schema changes ensures smooth updates and reduces the risk of data inconsistencies.

## Conclusion

This Database Requirements Document provides a comprehensive schema design for the Totem e-commerce platform, addressing the needs of all user personas and supporting the required features. The design prioritizes scalability, performance, and flexibility to accommodate future growth and feature additions.
```