Totem is a general ecommerce platform designed to be used by SMBs and startup companies looking to trade online.

Database models we know we need include: products, product attributes, inventory, warehouses (and the inventory in those warehouses), orders, customers.

The application should be extendable by third parties with robust hooks allow third parties to modify and extend platform behavior (e.g., custom pricing logic, additional data validation, third-party integrations), and webhooks to allow businesses to subscribe to events.

When looking up products from the db where there is an unknown user location we should display the fastest delivery time based on warehouses serving the region we know the person is in (IP address based lookup for region). Only when we know information from a user should we display more accurate information.