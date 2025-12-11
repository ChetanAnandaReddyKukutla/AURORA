# Adobe Data Layer Implementation Documentation

## Overview

This document describes the canonical Adobe Data Layer (`adobeDataLayer`) schema and implementation for the Aurora Apparel e-commerce demo. The data layer follows industry best practices and is designed to capture key e-commerce events for analytics tracking.

## Table of Contents

1. [Canonical Schema](#canonical-schema)
2. [Event Types](#event-types)
3. [Server-Side Pushes](#server-side-pushes)
4. [Client-Side Pushes](#client-side-pushes)
5. [Helper Utilities](#helper-utilities)
6. [Integration Guidelines](#integration-guidelines)
7. [Examples](#examples)

---

## Canonical Schema

All data layer pushes follow a consistent structure with the following top-level fields:

```javascript
{
  event: string,           // Event type (required)
  eventInfo: object,       // Event metadata (optional)
  custData: object,        // Customer information (when available)
  page: object,            // Page context (required for pageView events)
  product: array,          // Product array (for product-related events)
  productList: array,      // Product list array (for impression events)
  cart: object,            // Cart state (for cart-related events)
  order: object,           // Order details (for purchase events)
  timestamp: string        // ISO 8601 timestamp (recommended)
}
```

### Field Descriptions

#### `event` (string)
The type of event being tracked. Valid values:
- `pageView` - Page load/view
- `productImpression` - Product list viewed
- `productDetail` - Product detail viewed
- `productClick` - Product clicked
- `scAdd` - Item added to cart
- `scRemove` - Item removed from cart
- `scOpen` / `scView` - Cart opened/viewed
- `scCheckout` - Checkout initiated
- `purchase` - Order completed

#### `eventInfo` (object)
Metadata about the event:
```javascript
{
  eventName: string  // Mirror of event field
}
```

#### `custData` (object)
Customer information (when available):
```javascript
{
  custId: string,           // Customer ID (empty for guest)
  emailID_plain: string,    // Customer email (plain text)
  loginMethod: string,      // Login method (empty for guest)
  loginStatus: string,      // "guest" or "authenticated"
  mobileNo_plain: string    // Phone number (plain text)
}
```

#### `page` (object)
Page context information:
```javascript
{
  language: string,   // e.g., "en-US"
  pageName: string,   // Human-readable page name
  pageType: string,   // One of: home, plp, pdp, cart, checkout, thankyou
  url: string         // Full page URL
}
```

#### `product` (array)
**Always an array**, even for single products. Product object structure:
```javascript
{
  productId: string,        // Unique product identifier
  productName: string,      // Product display name
  productCategory: string,  // Product category
  brand: string,            // Brand name
  price: number,            // Product price
  position: number,         // Position in list (optional)
  quantity: number          // Quantity (for cart/purchase events)
}
```

#### `productList` (array)
Array of products for impression events (same structure as product objects above).

#### `cart` (object)
Current cart state:
```javascript
{
  items: [                  // Array of cart items
    {
      productId: string,
      productName: string,
      price: number,
      qty: number
    }
  ],
  total: number             // Cart total value
}
```

#### `order` (object)
Order details for purchase events:
```javascript
{
  id: string,               // Order ID (unique, generated server-side)
  revenue: number,          // Total order value
  products: [               // Array of purchased products
    {
      productId: string,
      productName: string,
      price: number,
      qty: number
    }
  ],
  customerName: string      // Customer name (optional)
}
```

#### `timestamp` (string)
ISO 8601 formatted timestamp (e.g., `"2025-12-10T14:30:00.000Z"`).

---

## Event Types

### 1. pageView
Triggered on every page load (server-side).

**Used on:** All pages  
**Push location:** Server-side (injected in HTML)

**Example:**
```javascript
{
  event: 'pageView',
  eventInfo: { eventName: 'pageView' },
  page: {
    language: 'en-US',
    pageName: 'Home',
    pageType: 'home',
    url: 'https://example.com/'
  },
  custData: {
    custId: '',
    emailID_plain: '',
    loginMethod: '',
    loginStatus: 'guest',
    mobileNo_plain: ''
  },
  timestamp: '2025-12-10T14:30:00.000Z'
}
```

### 2. productImpression
Triggered when products are displayed (PLP).

**Used on:** Product Listing Page  
**Push location:** Server-side (injected in HTML)

**Example:**
```javascript
{
  event: 'productImpression',
  eventInfo: { eventName: 'productImpression' },
  page: {
    language: 'en-US',
    pageName: 'Product Listing',
    pageType: 'plp',
    url: 'https://example.com/plp'
  },
  productList: [
    {
      productId: 'AUR-001',
      productName: 'Classic Cotton T-Shirt',
      productCategory: 'Tops',
      brand: 'Aurora Apparel',
      price: 29.99,
      position: 1
    },
    // ... more products
  ],
  custData: { /* ... */ },
  timestamp: '2025-12-10T14:30:00.000Z'
}
```

### 3. productDetail
Triggered when a product detail page is viewed.

**Used on:** Product Detail Page  
**Push location:** Server-side (injected in HTML)

**Example:**
```javascript
{
  event: 'productDetail',
  eventInfo: { eventName: 'productDetail' },
  page: {
    language: 'en-US',
    pageName: 'Product Detail - Classic Cotton T-Shirt',
    pageType: 'pdp',
    url: 'https://example.com/pdp/AUR-001'
  },
  product: [
    {
      productId: 'AUR-001',
      productName: 'Classic Cotton T-Shirt',
      productCategory: 'Tops',
      brand: 'Aurora Apparel',
      price: 29.99,
      quantity: 1
    }
  ],
  custData: { /* ... */ },
  timestamp: '2025-12-10T14:30:00.000Z'
}
```

### 4. productClick
Triggered when a user clicks on a product (PLP → PDP).

**Used on:** Product Listing Page  
**Push location:** Client-side (via client.js)

**Example:**
```javascript
{
  event: 'productClick',
  eventInfo: { eventName: 'productClick' },
  product: [
    {
      productId: 'AUR-001',
      productName: 'Classic Cotton T-Shirt',
      productCategory: 'Tops',
      brand: 'Aurora Apparel',
      price: 29.99,
      position: 1
    }
  ],
  timestamp: '2025-12-10T14:30:05.000Z'
}
```

### 5. scAdd
Triggered when a product is added to cart.

**Used on:** Product Detail Page  
**Push location:** Client-side (via client.js after successful API call)

**Example:**
```javascript
{
  event: 'scAdd',
  eventInfo: { eventName: 'scAdd' },
  product: [
    {
      productId: 'AUR-001',
      productName: 'Classic Cotton T-Shirt',
      productCategory: 'Tops',
      brand: 'Aurora Apparel',
      price: 29.99,
      quantity: 2
    }
  ],
  cart: {
    items: [
      {
        productId: 'AUR-001',
        productName: 'Classic Cotton T-Shirt',
        price: 29.99,
        qty: 2
      }
    ],
    total: 59.98
  },
  timestamp: '2025-12-10T14:31:00.000Z'
}
```

### 6. scRemove
Triggered when a product is removed from cart.

**Used on:** Cart Page  
**Push location:** Client-side (via client.js after successful API call)

**Example:**
```javascript
{
  event: 'scRemove',
  eventInfo: { eventName: 'scRemove' },
  product: [
    {
      productId: 'AUR-001'
    }
  ],
  cart: {
    items: [],
    total: 0
  },
  timestamp: '2025-12-10T14:32:00.000Z'
}
```

### 7. scOpen / scView
Triggered when the cart is opened or viewed.

**Used on:** Cart link click or Cart page view  
**Push location:** Client-side (scOpen) or Server-side (scView)

**Example (scView - server-side):**
```javascript
{
  event: 'scView',
  eventInfo: { eventName: 'scView' },
  page: {
    language: 'en-US',
    pageName: 'Shopping Cart',
    pageType: 'cart',
    url: 'https://example.com/cart'
  },
  cart: {
    items: [
      {
        productId: 'AUR-001',
        productName: 'Classic Cotton T-Shirt',
        price: 29.99,
        qty: 2
      }
    ],
    total: 59.98
  },
  custData: { /* ... */ },
  timestamp: '2025-12-10T14:33:00.000Z'
}
```

**Example (scOpen - client-side):**
```javascript
{
  event: 'scOpen',
  eventInfo: { eventName: 'scOpen' },
  timestamp: '2025-12-10T14:33:00.000Z'
}
```

### 8. scCheckout
Triggered when checkout is initiated.

**Used on:** Checkout Page  
**Push location:** Server-side (injected in HTML)

**Example:**
```javascript
{
  event: 'scCheckout',
  eventInfo: { eventName: 'scCheckout' },
  page: {
    language: 'en-US',
    pageName: 'Checkout',
    pageType: 'checkout',
    url: 'https://example.com/checkout'
  },
  cart: {
    items: [
      {
        productId: 'AUR-001',
        productName: 'Classic Cotton T-Shirt',
        price: 29.99,
        qty: 2
      }
    ],
    total: 59.98
  },
  custData: { /* ... */ },
  timestamp: '2025-12-10T14:34:00.000Z'
}
```

### 9. purchase
Triggered when an order is successfully completed.

**Used on:** Thank You / Order Confirmation Page  
**Push location:** Server-side (injected in HTML, only once per order)

**Example:**
```javascript
{
  event: 'purchase',
  eventInfo: { eventName: 'purchase' },
  page: {
    language: 'en-US',
    pageName: 'Order Confirmation',
    pageType: 'thankyou',
    url: 'https://example.com/thankyou'
  },
  order: {
    id: 'ORD-1733844000000-ABC123XYZ',
    revenue: 59.98,
    products: [
      {
        productId: 'AUR-001',
        productName: 'Classic Cotton T-Shirt',
        price: 29.99,
        qty: 2
      }
    ],
    customerName: 'John Doe'
  },
  custData: {
    custId: '',
    emailID_plain: 'john@example.com',
    loginMethod: '',
    loginStatus: 'guest',
    mobileNo_plain: ''
  },
  timestamp: '2025-12-10T14:35:00.000Z'
}
```

---

## Server-Side Pushes

Server-side pushes are injected into the HTML during page rendering. They are placed in the `<head>` section **before** the Adobe Launch embed script.

### Implementation Pattern

```javascript
<script>
  // Initialize adobeDataLayer
  window.adobeDataLayer = window.adobeDataLayer || [];
  
  // Server-side push with page/product data
  window.adobeDataLayer.push({
    event: 'pageView',
    // ... event data
  });
  
  // NOTE: Adobe Launch embed script should be placed here
  // Example: <script src="//assets.adobedtm.com/launch-XXXXX.min.js" async></script>
</script>
```

### When to Use Server-Side Pushes

- **Page load events:** `pageView`, `productImpression`, `productDetail`, `scView`, `scCheckout`, `purchase`
- **Initial page state:** When the data is available at render time
- **SEO-critical events:** Events that should fire even if JavaScript is disabled/delayed

---

## Client-Side Pushes

Client-side pushes are triggered by user interactions and are implemented in `public/client.js`.

### Implementation Pattern

```javascript
// Example: Add to cart
fetch('/api/cart/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: productId, qty: quantity })
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    // Push scAdd event
    window.adobeDataLayer.push({
      event: 'scAdd',
      eventInfo: { eventName: 'scAdd' },
      product: [{ /* product data */ }],
      cart: { /* cart data */ },
      timestamp: new Date().toISOString()
    });
  }
});
```

### When to Use Client-Side Pushes

- **User interactions:** `productClick`, `scAdd`, `scRemove`, `scOpen`
- **AJAX responses:** When data is fetched asynchronously
- **Dynamic updates:** When page state changes without a full page reload

---

## Helper Utilities

The `public/adl-utils.js` file provides helper functions for debugging and accessing the data layer.

### Available Functions

#### `adl.getLastPush()`
Returns the last object pushed to the data layer.

```javascript
const lastPush = adl.getLastPush();
console.log(lastPush);
```

#### `adl.get(path)`
Retrieves a nested property from the last push using dot notation.

```javascript
const pageName = adl.get('page.pageName');
const orderId = adl.get('order.id');
```

#### `adl.getAllPushes()`
Returns all data layer pushes as an array.

```javascript
const allPushes = adl.getAllPushes();
console.log('Total pushes:', allPushes.length);
```

#### `adl.getByEvent(eventName)`
Returns all pushes matching a specific event type.

```javascript
const productClicks = adl.getByEvent('productClick');
console.log('Product click events:', productClicks.length);
```

#### `adl.debug(detailed)`
Logs the current data layer state to the console.

```javascript
adl.debug();        // Summary
adl.debug(true);    // Detailed output
```

#### `adl.getCart()`
Returns the most recent cart object from the data layer.

```javascript
const cart = adl.getCart();
console.log('Cart total:', cart.total);
```

#### `adl.getOrder()`
Returns the most recent order object from the data layer.

```javascript
const order = adl.getOrder();
console.log('Order ID:', order.id);
```

---

## Integration Guidelines

### Adobe Launch / Adobe Analytics Integration

1. **Embed Placement:**
   - Place the Adobe Launch embed script in the `<head>` section
   - Position it **after** the server-side data layer push
   - Use `async` attribute to avoid blocking page render

   ```html
   <script>
     window.adobeDataLayer = window.adobeDataLayer || [];
     window.adobeDataLayer.push({ /* server push */ });
   </script>
   
   <!-- Adobe Launch embed goes here -->
   <script src="//assets.adobedtm.com/launch-XXXXX.min.js" async></script>
   ```

2. **Data Layer Listener:**
   - Configure Launch rules to listen to `adobeDataLayer` push events
   - Use the Adobe Client Data Layer extension if available
   - Create rules for each event type (`pageView`, `purchase`, etc.)

3. **Data Mapping:**
   - Map data layer fields to Adobe Analytics eVars, props, and events
   - Use the canonical schema field names consistently
   - Document the mapping in your Analytics implementation guide

### Testing & Validation

1. **Browser Console Testing:**
   ```javascript
   // Check last push
   adl.getLastPush()
   
   // Check specific field
   adl.get('page.pageType')
   
   // Debug summary
   adl.debug()
   ```

2. **Launch Debugger:**
   - Install Adobe Experience Platform Debugger browser extension
   - Verify data layer events are captured by Launch rules
   - Check Analytics beacon requests

3. **QA Checklist:**
   - [ ] Server-side pushes fire on page load (check page source)
   - [ ] Client-side pushes fire on user interactions (check console)
   - [ ] Product arrays are never empty objects (always arrays)
   - [ ] Order IDs are unique and not regenerated on page reload
   - [ ] Timestamps are in ISO 8601 format
   - [ ] Cart totals match displayed values

### Best Practices

1. **Consistency:** Always use the canonical schema field names
2. **Arrays:** `product` field must always be an array, even for single items
3. **Deduplication:** Implement order deduplication to prevent duplicate purchase events
4. **Timing:** Server pushes before Launch embed, client pushes after API responses
5. **Testing:** Use `adl-utils.js` functions extensively during development
6. **Documentation:** Keep this document updated as the implementation evolves

### Common Pitfalls to Avoid

❌ **Don't:** Push product as an object
```javascript
product: { productId: 'AUR-001', ... }  // WRONG
```

✅ **Do:** Push product as an array
```javascript
product: [{ productId: 'AUR-001', ... }]  // CORRECT
```

❌ **Don't:** Generate new order IDs on page reload
```javascript
// WRONG: This creates duplicate orders
app.get('/thankyou', (req, res) => {
  const orderId = generateOrderId();  // New ID on every request!
});
```

✅ **Do:** Store order in session, render once
```javascript
// CORRECT: Order ID persists across reloads
app.post('/checkout', (req, res) => {
  session.lastOrder = { id: generateOrderId(), ... };
  res.redirect('/thankyou');
});
```

❌ **Don't:** Place Launch embed before server push
```html
<!-- WRONG ORDER -->
<script src="//assets.adobedtm.com/launch-XXXXX.min.js"></script>
<script>
  window.adobeDataLayer.push({ event: 'pageView' });
</script>
```

✅ **Do:** Place Launch embed after server push
```html
<!-- CORRECT ORDER -->
<script>
  window.adobeDataLayer.push({ event: 'pageView' });
</script>
<script src="//assets.adobedtm.com/launch-XXXXX.min.js" async></script>
```

---

## Examples

### Complete Flow: Browse → Add to Cart → Purchase

1. **User lands on homepage:**
   ```javascript
   // Server push
   { event: 'pageView', page: { pageType: 'home' }, ... }
   ```

2. **User navigates to PLP:**
   ```javascript
   // Server push
   { event: 'productImpression', productList: [...], ... }
   ```

3. **User clicks product:**
   ```javascript
   // Client push
   { event: 'productClick', product: [{ productId: 'AUR-001', ... }], ... }
   ```

4. **User views PDP:**
   ```javascript
   // Server push
   { event: 'productDetail', product: [{ productId: 'AUR-001', ... }], ... }
   ```

5. **User adds to cart:**
   ```javascript
   // Client push (after API response)
   { event: 'scAdd', product: [...], cart: { total: 29.99 }, ... }
   ```

6. **User views cart:**
   ```javascript
   // Server push
   { event: 'scView', cart: { items: [...], total: 29.99 }, ... }
   ```

7. **User proceeds to checkout:**
   ```javascript
   // Server push
   { event: 'scCheckout', cart: { items: [...], total: 29.99 }, ... }
   ```

8. **User completes order:**
   ```javascript
   // Server push
   { event: 'purchase', order: { id: 'ORD-123', revenue: 29.99, ... }, ... }
   ```

---

## Support & Maintenance

### Modifying the Schema

If you need to add custom fields to the schema:

1. Document the new fields in this file
2. Update server templates and client.js accordingly
3. Test thoroughly with `adl.debug()` and `adl.getLastPush()`
4. Update Launch rules and Analytics mapping

### Troubleshooting

**Problem:** Data layer is empty  
**Solution:** Check that `window.adobeDataLayer = window.adobeDataLayer || [];` is initialized

**Problem:** Server pushes not appearing  
**Solution:** View page source (not inspector) to verify the push is in the HTML

**Problem:** Client pushes not firing  
**Solution:** Check browser console for JavaScript errors and verify API responses

**Problem:** Duplicate purchase events  
**Solution:** Verify order is stored in session and not regenerated on page reload

---

## Version History

- **v1.0.0** (2025-12-10): Initial implementation for Aurora Apparel demo

---

**End of Documentation**
