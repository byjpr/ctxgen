```yaml
users:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: email
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
  - name: password_hash
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: first_name
    type: String
    postgresType: varchar(100)
    nullable: true
  - name: last_name
    type: String
    postgresType: varchar(100)
    nullable: true
  - name: phone
    type: String
    postgresType: varchar(20)
    nullable: true
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: last_login
    type: Date
    postgresType: timestamp
    nullable: true
  - name: is_admin
    type: Boolean
    postgresType: boolean
    nullable: false
    default: false
  - name: status
    type: String
    postgresType: varchar(20)
    nullable: false
    default: 'active'

addresses:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: users
      column: uid
  - name: address_type
    type: String
    postgresType: varchar(20)
    nullable: false
  - name: first_name
    type: String
    postgresType: varchar(100)
    nullable: true
  - name: last_name
    type: String
    postgresType: varchar(100)
    nullable: true
  - name: company
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: address_line1
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: address_line2
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: city
    type: String
    postgresType: varchar(100)
    nullable: false
  - name: state
    type: String
    postgresType: varchar(100)
    nullable: true
  - name: postal_code
    type: String
    postgresType: varchar(20)
    nullable: true
  - name: country
    type: String
    postgresType: varchar(100)
    nullable: false
  - name: phone
    type: String
    postgresType: varchar(20)
    nullable: true
  - name: is_default
    type: Boolean
    postgresType: boolean
    nullable: false
    default: false

categories:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: parent_uid
    type: String
    postgresType: varchar(255)
    nullable: true
    foreignKey:
      table: categories
      column: uid
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: slug
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
  - name: description
    type: String
    postgresType: text
    nullable: true
  - name: meta_title
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: meta_description
    type: String
    postgresType: text
    nullable: true
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

tags:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: name
    type: String
    postgresType: varchar(100)
    unique: true
    nullable: false
  - name: slug
    type: String
    postgresType: varchar(100)
    unique: true
    nullable: false

orders:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: true
    foreignKey:
      table: users
      column: uid
  - name: status
    type: String
    postgresType: varchar(50)
    nullable: false
  - name: total_amount
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: subtotal
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: tax_amount
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: shipping_amount
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: discount_amount
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
    default: 0
  - name: shipping_address_uid
    type: String
    postgresType: varchar(255)
    nullable: true
    foreignKey:
      table: addresses
      column: uid
  - name: billing_address_uid
    type: String
    postgresType: varchar(255)
    nullable: true
    foreignKey:
      table: addresses
      column: uid
  - name: payment_method
    type: String
    postgresType: varchar(50)
    nullable: true
  - name: shipping_method
    type: String
    postgresType: varchar(100)
    nullable: true
  - name: tracking_number
    type: String
    postgresType: varchar(100)
    nullable: true
  - name: notes
    type: String
    postgresType: text
    nullable: true
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

order_items:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: order_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: orders
      column: uid
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: variant_uid
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: quantity
    type: Number
    postgresType: integer
    nullable: false
  - name: unit_price
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: total_price
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: sku
    type: String
    postgresType: varchar(100)
    nullable: true
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: weight
    type: Number
    postgresType: decimal(10, 2)
    nullable: true
  - name: options
    type: Object
    postgresType: jsonb
    nullable: true

payments:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: order_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: orders
      column: uid
  - name: amount
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: payment_method
    type: String
    postgresType: varchar(50)
    nullable: false
  - name: transaction_id
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: status
    type: String
    postgresType: varchar(50)
    nullable: false
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

refunds:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: order_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: orders
      column: uid
  - name: amount
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: reason
    type: String
    postgresType: text
    nullable: true
  - name: status
    type: String
    postgresType: varchar(50)
    nullable: false
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

warehouses:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: address_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: addresses
      column: uid
  - name: is_active
    type: Boolean
    postgresType: boolean
    nullable: false
    default: true

inventory:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: variant_uid
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: warehouse_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: warehouses
      column: uid
  - name: quantity
    type: Number
    postgresType: integer
    nullable: false
  - name: last_updated
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

wishlists:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: users
      column: uid
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: is_public
    type: Boolean
    postgresType: boolean
    nullable: false
    default: false
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

wishlist_items:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: wishlist_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: wishlists
      column: uid
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: variant_uid
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: added_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

coupons:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: code
    type: String
    postgresType: varchar(50)
    unique: true
    nullable: false
  - name: type
    type: String
    postgresType: varchar(20)
    nullable: false
  - name: value
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: min_purchase_amount
    type: Number
    postgresType: decimal(10, 2)
    nullable: true
  - name: usage_limit
    type: Number
    postgresType: integer
    nullable: true
  - name: used_count
    type: Number
    postgresType: integer
    nullable: false
    default: 0
  - name: start_date
    type: Date
    postgresType: timestamp
    nullable: true
  - name: end_date
    type: Date
    postgresType: timestamp
    nullable: true
  - name: is_active
    type: Boolean
    postgresType: boolean
    nullable: false
    default: true

reviews:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: users
      column: uid
  - name: rating
    type: Number
    postgresType: integer
    nullable: false
  - name: title
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: content
    type: String
    postgresType: text
    nullable: true
  - name: status
    type: String
    postgresType: varchar(20)
    nullable: false
    default: 'pending'
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

plugins:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: version
    type: String
    postgresType: varchar(50)
    nullable: false
  - name: status
    type: String
    postgresType: varchar(20)
    nullable: false
    default: 'inactive'
  - name: settings
    type: Object
    postgresType: jsonb
    nullable: true
  - name: installed_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

webhooks:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: users
      column: uid
  - name: event_type
    type: String
    postgresType: varchar(100)
    nullable: false
  - name: target_url
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: is_active
    type: Boolean
    postgresType: boolean
    nullable: false
    default: true
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

products:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: slug
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
  - name: sku
    type: String
    postgresType: varchar(100)
    unique: true
    nullable: true
  - name: description
    type: String
    postgresType: text
    nullable: true
  - name: short_description
    type: String
    postgresType: text
    nullable: true
  - name: price
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: compare_at_price
    type: Number
    postgresType: decimal(10, 2)
    nullable: true
  - name: cost_price
    type: Number
    postgresType: decimal(10, 2)
    nullable: true
  - name: status
    type: String
    postgresType: varchar(50)
    nullable: false
  - name: vendor
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: categories
    type: Array
    postgresType: jsonb
    nullable: true
  - name: tags
    type: Array
    postgresType: jsonb
    nullable: true
  - name: attributes
    type: Object
    postgresType: jsonb
    nullable: true
  - name: variants
    type: Array
    postgresType: jsonb
    nullable: true
  - name: images
    type: Array
    postgresType: jsonb
    nullable: true
  - name: seo
    type: Object
    postgresType: jsonb
    nullable: true
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

content_pages:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: title
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: slug
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
  - name: content
    type: String
    postgresType: text
    nullable: true
  - name: meta_title
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: meta_description
    type: String
    postgresType: text
    nullable: true
  - name: status
    type: String
    postgresType: varchar(50)
    nullable: false
  - name: author_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: users
      column: uid
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: published_at
    type: Date
    postgresType: timestamp
    nullable: true

shipping_zones:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: countries
    type: Array
    postgresType: jsonb
    nullable: true
  - name: states
    type: Array
    postgresType: jsonb
    nullable: true
  - name: zip_codes
    type: Array
    postgresType: jsonb
    nullable: true

shipping_methods:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: shipping_zone_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: shipping_zones
      column: uid
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: price
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: free_shipping_threshold
    type: Number
    postgresType: decimal(10, 2)
    nullable: true
  - name: is_active
    type: Boolean
    postgresType: boolean
    nullable: false
    default: true

tax_rates:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: country
    type: String
    postgresType: varchar(100)
    nullable: false
  - name: state
    type: String
    postgresType: varchar(100)
    nullable: true
  - name: zip
    type: String
    postgresType: varchar(20)
    nullable: true
  - name: rate
    type: Number
    postgresType: decimal(5, 2)
    nullable: false
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: is_active
    type: Boolean
    postgresType: boolean
    nullable: false
    default: true

cart:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: true
    foreignKey:
      table: users
      column: uid
  - name: session_id
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

cart_items:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: cart_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: cart
      column: uid
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: variant_uid
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: quantity
    type: Number
    postgresType: integer
    nullable: false
  - name: price
    type: Number
    postgresType: decimal(10, 2)
    nullable: false

customer_groups:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: description
    type: String
    postgresType: text
    nullable: true

user_customer_groups:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: users
      column: uid
  - name: customer_group_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: customer_groups
      column: uid

product_customer_group_prices:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: customer_group_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: customer_groups
      column: uid
  - name: price
    type: Number
    postgresType: decimal(10, 2)
    nullable: false

abandoned_carts:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: true
    foreignKey:
      table: users
      column: uid
  - name: session_id
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: cart_data
    type: Object
    postgresType: jsonb
    nullable: false
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: recovered_at
    type: Date
    postgresType: timestamp
    nullable: true

return_requests:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: order_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: orders
      column: uid
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: users
      column: uid
  - name: status
    type: String
    postgresType: varchar(50)
    nullable: false
  - name: reason
    type: String
    postgresType: text
    nullable: false
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

return_items:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: return_request_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: return_requests
      column: uid
  - name: order_item_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: order_items
      column: uid
  - name: quantity
    type: Number
    postgresType: integer
    nullable: false
  - name: reason
    type: String
    postgresType: text
    nullable: true

product_reviews:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: users
      column: uid
  - name: rating
    type: Number
    postgresType: integer
    nullable: false
  - name: title
    type: String
    postgresType: varchar(255)
    nullable: true
  - name: content
    type: String
    postgresType: text
    nullable: true
  - name: status
    type: String
    postgresType: varchar(20)
    nullable: false
    default: 'pending'
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

product_questions:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: user_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: users
      column: uid
  - name: question
    type: String
    postgresType: text
    nullable: false
  - name: answer
    type: String
    postgresType: text
    nullable: true
  - name: status
    type: String
    postgresType: varchar(20)
    nullable: false
    default: 'pending'
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

product_bundles:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: name
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: description
    type: String
    postgresType: text
    nullable: true
  - name: price
    type: Number
    postgresType: decimal(10, 2)
    nullable: false
  - name: status
    type: String
    postgresType: varchar(20)
    nullable: false
    default: 'active'
  - name: created_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP
  - name: updated_at
    type: Date
    postgresType: timestamp
    nullable: false
    default: CURRENT_TIMESTAMP

product_bundle_items:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: bundle_uid
    type: String
    postgresType: varchar(255)
    nullable: false
    foreignKey:
      table: product_bundles
      column: uid
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: quantity
    type: Number
    postgresType: integer
    nullable: false

product_related:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: related_product_uid
    type: String
    postgresType: varchar(255)
    nullable: false
  - name: relationship_type
    type: String
    postgresType: varchar(50)
    nullable: false

store_settings:
  - name: uid
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
    primaryKey: true
  - name: key
    type: String
    postgresType: varchar(255)
    unique: true
    nullable: false
  - name: value
    type: Object
    postgresType: jsonb