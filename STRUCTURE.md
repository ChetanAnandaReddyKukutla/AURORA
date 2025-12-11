# Project Structure

## Overview
This is a professional e-commerce website with a well-organized folder structure following best practices.

## Directory Structure

```
ecommerce website/
├── src/                          # Source files (development)
│   ├── html/
│   │   ├── pages/               # Main page files
│   │   │   ├── index.html       # Homepage
│   │   │   ├── plp.html         # Product Listing Page
│   │   │   ├── pdp.html         # Product Detail Page
│   │   │   ├── cart.html        # Shopping Cart
│   │   │   ├── checkout.html    # Checkout Page
│   │   │   └── thankyou.html    # Order Confirmation
│   │   └── components/          # Reusable HTML components (for future use)
│   │
│   ├── css/
│   │   └── styles.css           # Global stylesheet
│   │
│   ├── js/
│   │   ├── client.js            # Client-side interaction & event tracking
│   │   └── adl-utils.js         # Adobe Data Layer utilities
│   │
│   └── assets/
│       └── images/              # Images used in the site
│
├── public/                       # Public assets (backward compatibility)
│   ├── index.html               # Homepage (legacy)
│   ├── styles.css               # Stylesheet (legacy)
│   ├── client.js                # Client JS (legacy)
│   ├── adl-utils.js             # ADL utilities (legacy)
│   └── images/                  # Images
│
├── server.js                    # Express server
├── package.json                 # Dependencies
├── README.md                    # Project documentation
├── STRUCTURE.md                 # This file
├── DEPLOYMENT.md                # Deployment guide
├── QUICK-DEPLOY.md              # Quick deployment steps
└── docs/                        # Additional documentation

```

## File Organization Best Practices

### Why this structure?

1. **Separation of Concerns**
   - `src/html/pages/` - Content & markup
   - `src/css/` - Styling
   - `src/js/` - Functionality
   - `src/assets/` - Media files

2. **Scalability**
   - Easy to add new pages
   - Components folder ready for modularization
   - Clear path for future template system

3. **Development vs Production**
   - `src/` contains development files
   - `public/` serves static files to browsers
   - Server routes handle both for backward compatibility

4. **File Serving**
   - Static files are served via Express with these routes:
     - `/` → Serves from `src/html/pages/` or `public/`
     - `/css/` → Serves from `src/css/`
     - `/js/` → Serves from `src/js/`
     - `/assets/` → Serves from `src/assets/`

## File References

### HTML File References
All HTML files reference resources as follows:
```html
<!-- Stylesheets -->
<link rel="stylesheet" href="/css/styles.css">

<!-- Scripts -->
<script src="/js/adl-utils.js"></script>
<script src="/js/client.js"></script>
```

### Pages Overview

| Page | Path | Purpose |
|------|------|---------|
| Homepage | `src/html/pages/index.html` | Landing page with hero, categories, trust badges |
| Collection | `src/html/pages/plp.html` | Product listing with filters |
| Product Detail | `src/html/pages/pdp.html` | Single product details with options |
| Shopping Cart | `src/html/pages/cart.html` | View and manage cart items |
| Checkout | `src/html/pages/checkout.html` | Shipping & order info |
| Confirmation | `src/html/pages/thankyou.html` | Order confirmation |

## Development Workflow

1. **Edit source files** in `src/` folder
2. **Server automatically serves** from new locations
3. **No build process needed** (currently static HTML/CSS/JS)
4. **Future:** Can add build tools (Webpack, Gulp, etc.)

## Adding New Files

### Adding a new HTML page:
1. Create file in `src/html/pages/`
2. Reference CSS: `<link rel="stylesheet" href="/css/styles.css">`
3. Reference JS: `<script src="/js/client.js"></script>`

### Adding new CSS:
1. Add to `src/css/` folder
2. Or append to `src/css/styles.css`

### Adding new JavaScript:
1. Add to `src/js/` folder
2. Reference in HTML files as needed

### Adding images:
1. Place in `src/assets/images/`
2. Reference with: `<img src="/assets/images/filename.jpg">`

## Server Configuration

Server (`server.js`) serves files from multiple locations:
- **Main pages:** `src/html/pages/`
- **Stylesheets:** `src/css/`
- **Scripts:** `src/js/`
- **Assets:** `src/assets/`
- **Legacy support:** `public/` (for backward compatibility)

## Future Improvements

1. **Build System** - Add Webpack/Vite for asset optimization
2. **Component System** - Use templates (EJS, Handlebars)
3. **Database** - Store cart & order data persistently
4. **Testing** - Add unit & integration tests
5. **CI/CD** - Automate deployment
