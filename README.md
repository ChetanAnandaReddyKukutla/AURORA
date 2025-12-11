# Aurora Apparel - E-Commerce Website

A modern, minimal e-commerce platform inspired by Zara and H&M. Built with Node.js/Express, vanilla HTML/CSS/JavaScript, and Adobe Data Layer integration for analytics tracking.

## 🚀 Features

### Core E-Commerce
- **Product Catalog** - Browse 36+ products across multiple categories (Essentials, Denim, Outerwear, Knitwear, Dresses, Bottoms)
- **Product Details** - View product colors, sizes, descriptions, and similar product recommendations
- **Shopping Cart** - Add/remove items, adjust quantities, persistent cart using localStorage
- **Checkout** - Secure shipping information collection
- **Order Confirmation** - Thank you page with personalized greeting and shipping details

### Analytics & Tracking
- **Adobe Data Layer Integration** - Tracks product clicks, cart additions/removals, checkouts, and page views
- **Event Tracking** - All major user interactions logged for analytics

### Design & UX
- **Responsive Design** - Mobile-first approach, works on all devices
- **Minimal Aesthetic** - Clean, modern design inspired by premium brands
- **Fast Performance** - Optimized CSS/JS, lazy loading, caching

### Data Persistence
- **localStorage Cart** - Cart persists across browser sessions
- **Session Management** - Cookie-based session tracking
- **Order Storage** - In-memory order history (ready for database upgrade)

## 📁 Project Structure

```
aurora-apparel/
├── src/
│   ├── html/
│   │   └── pages/
│   │       ├── index.html          # Sitemap/navigation hub
│   │       ├── homepage.html       # Main landing page
│   │       ├── plp.html            # Product Listing Page
│   │       ├── pdp.html            # Product Detail Page
│   │       ├── cart.html           # Shopping Cart
│   │       ├── checkout.html       # Checkout
│   │       └── thankyou.html       # Order Confirmation
│   ├── css/
│   │   └── styles.css              # Global stylesheet
│   └── js/
│       ├── client.js               # Client-side interactions & events
│       └── adl-utils.js            # Adobe Data Layer utilities
├── public/
│   └── images/                     # Product and category images
├── server.js                       # Express backend
├── package.json                    # Dependencies
├── STRUCTURE.md                    # Detailed project structure guide
├── RESTRUCTURING.md                # Restructuring changelog
└── README.md                       # This file
```

## 🛠️ Tech Stack

**Frontend:**
- HTML5
- CSS3 (Custom, no frameworks)
- Vanilla JavaScript (ES6+)
- Adobe Data Layer

**Backend:**
- Node.js
- Express.js
- Cookie-Parser (sessions)
- Body-Parser (JSON)
- Helmet (security)
- Compression (performance)
- CORS

**Database:** In-memory (ready for MongoDB/PostgreSQL upgrade)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Git (for version control)

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aurora-apparel.git
   cd aurora-apparel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Start the server**
   ```bash
   # Development
   npm start
   # or
   node server.js

   # Production
   NODE_ENV=production node server.js
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🚀 Deployment

### Vercel
```bash
npm install -g vercel
vercel
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### AWS/DigitalOcean/VPS
1. Push code to Git
2. SSH into server
3. Clone repository
4. Run `npm install`
5. Start with PM2: `pm2 start server.js`

## 📖 API Endpoints

### Products
- `GET /api/products` - Get all products

### Cart
- `GET /api/cart` - Get current cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update item quantity
- `POST /api/cart/remove` - Remove item from cart

### Checkout & Orders
- `POST /api/checkout` - Process order
- `GET /api/order/:id` - Get order details

## 🎨 Customization

### Change Colors & Typography
Edit `src/css/styles.css` - CSS variables at the top:
```css
:root {
  --primary: #000;
  --secondary: #666;
  /* ... other variables */
}
```

### Add New Products
Edit `server.js`, update the `products` array:
```javascript
{
  productId: 'AUR-XXX',
  productName: 'Product Name',
  productCategory: 'Category',
  brand: 'Aurora Apparel',
  price: 99.99,
  description: 'Product description',
  image: 'https://image-url.jpg',
  colors: ['Color1', 'Color2'],
  sizes: ['S', 'M', 'L', 'XL']
}
```

### Integrate Adobe Analytics
Replace the placeholder Adobe script in each page's `<head>`:
```html
<!-- Old -->
<script src="https://assets.adobedtm.com/REPLACE_WITH_YOUR_ADOBE_LAUNCH_URL.js"></script>

<!-- New -->
<script src="https://assets.adobedtm.com/YOUR_REAL_EMBED_CODE.js"></script>
```

All pages reference this in `src/html/pages/*.html`

## 📊 Data Layer Events Tracked

- **pageView** - Page navigation
- **productClick** - Product clicked on PLP
- **productDetail** - Viewed product detail page
- **scAdd** - Item added to cart (includes color, size)
- **scView** - Viewed cart
- **scRemove** - Item removed from cart
- **scCheckout** - Started checkout
- **scOpen** - Cart opened

## 🔐 Security

- CORS enabled for safe cross-origin requests
- Helmet middleware for XSS/clickjacking protection
- HTTPOnly cookies for session management
- Input validation on all API endpoints
- Content-Security-Policy (CSP) disabled for demo (enable in production)

## 🐛 Known Limitations

- **In-Memory Storage** - Orders lost on server restart (upgrade to database)
- **No Payment Gateway** - Checkout doesn't process payments (add Stripe/PayPal)
- **No Authentication** - No user accounts (add auth system)
- **Placeholder Adobe URL** - Must replace with real tracking URL

## 📈 Roadmap

- [ ] User authentication & accounts
- [ ] Persistent database (MongoDB/PostgreSQL)
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Admin dashboard for product management
- [ ] Email notifications
- [ ] Search & filtering
- [ ] Wishlist/favorites
- [ ] Customer reviews & ratings
- [ ] Inventory management
- [ ] Multi-currency support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👤 Author

**Aurora Apparel Development Team**

## 💬 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `STRUCTURE.md` and `RESTRUCTURING.md`
- Review server logs for errors

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Adobe Data Layer Guide](https://github.com/adobe/adobe-client-data-layer)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Status:** ✅ Ready for Production (with Adobe URL configuration)

**Last Updated:** December 11, 2025
  - In console, run: `adl.debug()`
  - In console, run: `adl.getCart()`
  - In console, run: `adl.getOrder()`
  - Screenshot: Console showing utility function outputs

### Edge Cases

- [ ] **Empty cart checkout redirect**
  - Clear cart (remove all items)
  - Navigate directly to: http://localhost:3000/checkout
  - Verify error message appears or redirect to cart

- [ ] **Direct /thankyou access**
  - Without placing an order, navigate to: http://localhost:3000/thankyou
  - Verify redirect to cart (no order exists)

- [ ] **Invalid product ID**
  - Navigate to: http://localhost:3000/pdp/INVALID-ID
  - Verify 404 or "Product not found" message

### Screenshot Checklist

Capture these screenshots for documentation:

1. **Home page** - Full page view
2. **PLP with products** - Grid of products
3. **Console: productImpression event** - `adl.getLastPush()` output
4. **Console: productClick event** - Triggered on PLP click
5. **PDP with Add to Cart** - Product detail page
6. **Console: scAdd event** - After adding to cart
7. **API response: /api/cart** - JSON output in browser
8. **Cart page with items** - Table showing cart items
9. **Console: scView event** - Cart page data layer
10. **Checkout form** - Filled checkout page
11. **Thank You page** - With Order ID visible
12. **Console: purchase event** - With order object
13. **Page source: Server push** - View source showing data layer
14. **Console: adl.debug() output** - Helper utility result

## Data Layer Documentation

Complete Adobe Data Layer documentation is available in:

📄 **[docs/adobe-data-layer.md](docs/adobe-data-layer.md)**

This includes:
- Canonical schema specification
- Event type descriptions
- Server-side and client-side push patterns
- Helper utility documentation
- Integration guidelines for Adobe Launch/Analytics
- Complete examples and best practices

## Architecture Notes

### Server-Rendered HTML

All pages are rendered server-side using template strings in `server.js`. No templating engine is used, but you can easily integrate EJS, Handlebars, or Pug if needed.

### In-Memory Data Store

- **Products:** Hardcoded array in `server.js`
- **Sessions:** Stored in memory using `sessionId` cookie
- **Cart:** Stored per session
- **Orders:** Stored in session as `lastOrder` (prevents duplicate purchase events)

**Note:** All data is cleared when the server restarts.

### Session Management

Sessions are identified by a `sessionId` cookie. The server automatically creates a session if one doesn't exist.

### Order ID Generation

Order IDs are generated using:
```javascript
'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase()
```

Example: `ORD-1733844000000-ABC123XYZ`

### Order Deduplication

The `purchase` event is only pushed once per order:
1. Order is created in `POST /checkout`
2. Order is stored in `session.lastOrder`
3. `GET /thankyou` renders the stored order
4. Reloading `/thankyou` shows the same order (no new purchase event)

## Extending the Demo

### Adding Products

Edit the `products` array in `server.js`:

```javascript
const products = [
  {
    productId: 'AUR-005',
    productName: 'New Product',
    productCategory: 'Category',
    brand: 'Aurora Apparel',
    price: 99.99,
    description: 'Product description',
    image: '/images/new-product.jpg'
  },
  // ...
];
```

### Adding Product Images

1. Add image files to `public/images/`
2. Update the `image` field in product objects to match filenames
3. Images should be in JPG, PNG, or SVG format

### Customizing Styles

Edit `public/styles.css` to change colors, fonts, layout, etc.

### Adding Custom Data Layer Fields

1. Update the schema in `docs/adobe-data-layer.md`
2. Modify server templates in `server.js`
3. Update client-side pushes in `public/client.js`
4. Test with `adl.getLastPush()` and `adl.debug()`

## Troubleshooting

### Server won't start

**Error:** `Cannot find module 'express'`  
**Solution:** Run `npm install`

**Error:** `Port 3000 is already in use`  
**Solution:** Kill the process using port 3000 or set a different port:
```bash
$env:PORT=3001; npm start
```

### Data layer is empty

**Problem:** `adl.getLastPush()` returns `null`  
**Solution:** Check browser console for JavaScript errors. Verify `adl-utils.js` is loaded.

### Server pushes not appearing

**Problem:** Data layer events don't show in console  
**Solution:** View page source (Ctrl+U) to verify the push is in the HTML. If not, check `server.js` template rendering.

### Cart not updating

**Problem:** Cart count doesn't update after adding items  
**Solution:** Check Network tab for API call errors. Verify `/api/cart/add` returns success.

### Purchase event fires multiple times

**Problem:** Reloading Thank You page creates new orders  
**Solution:** Verify `session.lastOrder` is being stored and reused in `GET /thankyou`.

## Browser Compatibility

Tested and working in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** Uses modern JavaScript (ES6+). IE11 not supported.

## Security Notes

This is a **demo application** and should not be used in production without:

- Proper input validation
- CSRF protection
- SQL injection prevention (if using a real database)
- Secure session management
- HTTPS enforcement
- Rate limiting
- Payment security (currently fake payment)

## Performance Considerations

- All data is in-memory (fast, but not persistent)
- No database queries (instant response)
- Minimal JavaScript (fast page loads)
- Placeholder images (can be replaced with real product photos)

## License

ISC License - Free to use and modify for your projects.

## Support

For questions or issues:

1. Check `docs/adobe-data-layer.md` for data layer questions
2. Review this README for setup/usage questions
3. Check browser console for JavaScript errors
4. Verify API endpoints in Network tab

## Version History

- **v1.0.0** (2025-12-10): Initial release
  - Server-rendered multi-page architecture
  - Complete e-commerce flow
  - Comprehensive adobeDataLayer integration
  - Helper utilities and documentation

---

**Built with ❤️ for Adobe Analytics integration demos**
