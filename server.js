const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Security and performance middleware
try {
  const helmet = require('helmet');
  const compression = require('compression');
  const cors = require('cors');
  
  app.use(helmet({
    contentSecurityPolicy: false // Disable for demo
  }));
  app.use(compression());
  app.use(cors());
} catch (e) {
  console.log('Optional security packages not installed. Run: npm install helmet compression cors');
}

// Root route - serve homepage (must come before static middleware)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/html/pages/homepage.html'));
});

// Serve images (legacy path)
app.use('/images', express.static(path.join(__dirname, 'public/images'), {
  maxAge: isProduction ? '7d' : 0
}));

// Serve static files from src/html/pages (main app files)
app.use(express.static(path.join(__dirname, 'src/html/pages'), {
  maxAge: isProduction ? '1d' : 0
}));

// Serve static files from src/css and src/js
app.use('/css', express.static(path.join(__dirname, 'src/css'), {
  maxAge: isProduction ? '1d' : 0
}));

app.use('/js', express.static(path.join(__dirname, 'src/js'), {
  maxAge: isProduction ? '1d' : 0
}));

// In-memory data store
const products = [
  {
    productId: 'AUR-001',
    productName: 'Premium Cotton Crew Neck Tee',
    productCategory: 'Essentials',
    brand: 'Aurora Apparel',
    price: 39.99,
    description: 'Crafted from 100% organic cotton with a relaxed fit. Our signature crew neck tee combines comfort with timeless style. Pre-shrunk for lasting quality.',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=700&fit=crop',
    colors: ['White', 'Black', 'Navy', 'Heather Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    productId: 'AUR-002',
    productName: 'High-Waisted Slim Fit Jeans',
    productCategory: 'Denim',
    brand: 'Aurora Apparel',
    price: 89.99,
    description: 'Premium stretch denim with a flattering high-waisted cut. Features sustainable production methods and reinforced stitching for durability.',
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=700&fit=crop',
    colors: ['Dark Indigo', 'Light Wash', 'Black'],
    sizes: ['24', '26', '28', '30', '32', '34']
  },
  {
    productId: 'AUR-003',
    productName: 'Oversized Pullover Hoodie',
    productCategory: 'Outerwear',
    brand: 'Aurora Apparel',
    price: 69.99,
    description: 'Ultra-soft fleece hoodie with a relaxed oversized fit. Double-lined hood and kangaroo pocket. Perfect for layering or wearing solo.',
    image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=500&h=700&fit=crop',
    colors: ['Charcoal', 'Dusty Rose', 'Sage Green', 'Cream'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-004',
    productName: 'Midi Wrap Dress',
    productCategory: 'Dresses',
    brand: 'Aurora Apparel',
    price: 119.99,
    description: 'Elegant midi wrap dress in flowing fabric. Adjustable waist tie and flutter sleeves create a universally flattering silhouette. Versatile for any occasion.',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=700&fit=crop',
    colors: ['Floral Print', 'Solid Black', 'Burgundy'],
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-005',
    productName: 'Ribbed Knit Cardigan',
    productCategory: 'Knitwear',
    brand: 'Aurora Apparel',
    price: 79.99,
    description: 'Luxuriously soft ribbed cardigan with button closure. Made from sustainable wool blend. Essential layering piece for every wardrobe.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&h=700&fit=crop',
    colors: ['Oatmeal', 'Camel', 'Forest Green'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-006',
    productName: 'Wide-Leg Linen Pants',
    productCategory: 'Bottoms',
    brand: 'Aurora Apparel',
    price: 74.99,
    description: 'Breezy wide-leg pants in 100% European linen. High-waisted with an elastic back waistband for comfort. Perfect for warm weather styling.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&h=700&fit=crop',
    colors: ['White', 'Sand', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-007',
    productName: 'Classic V-Neck T-Shirt',
    productCategory: 'Essentials',
    brand: 'Aurora Apparel',
    price: 35.99,
    description: 'Soft cotton v-neck tee with a flattering fit. Perfect for everyday wear with jeans or layering under jackets.',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=700&fit=crop',
    colors: ['White', 'Black', 'Navy', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    productId: 'AUR-008',
    productName: 'Graphic Print Tee',
    productCategory: 'Essentials',
    brand: 'Aurora Apparel',
    price: 42.99,
    description: 'Trendy graphic tee with unique artwork. Made from premium cotton with a comfortable relaxed fit.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=700&fit=crop',
    colors: ['White', 'Black', 'Gray'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    productId: 'AUR-009',
    productName: 'Pocket Detail T-Shirt',
    productCategory: 'Essentials',
    brand: 'Aurora Apparel',
    price: 38.99,
    description: 'Classic tee with chest pocket detail. Versatile style that pairs with everything in your wardrobe.',
    image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=500&h=700&fit=crop',
    colors: ['White', 'Navy', 'Olive', 'Heather Gray'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-010',
    productName: 'Skinny Fit Jeans',
    productCategory: 'Denim',
    brand: 'Aurora Apparel',
    price: 85.99,
    description: 'Form-fitting skinny jeans with stretch comfort. Modern silhouette with classic five-pocket styling.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=700&fit=crop',
    colors: ['Dark Blue', 'Black', 'Light Wash'],
    sizes: ['24', '26', '28', '30', '32', '34', '36']
  },
  {
    productId: 'AUR-011',
    productName: 'Bootcut Denim Jeans',
    productCategory: 'Denim',
    brand: 'Aurora Apparel',
    price: 92.99,
    description: 'Timeless bootcut jeans with mid-rise waist. Flattering fit that works from day to night.',
    image: 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&h=700&fit=crop',
    colors: ['Medium Wash', 'Dark Indigo'],
    sizes: ['25', '27', '29', '31', '33']
  },
  {
    productId: 'AUR-012',
    productName: 'Distressed Boyfriend Jeans',
    productCategory: 'Denim',
    brand: 'Aurora Apparel',
    price: 95.99,
    description: 'Relaxed boyfriend fit with trendy distressing. Comfortable and stylish with a lived-in look.',
    image: 'https://images.unsplash.com/photo-1598522325074-042db73aa4e6?w=500&h=700&fit=crop',
    colors: ['Light Blue', 'Medium Wash'],
    sizes: ['26', '28', '30', '32', '34']
  },
  {
    productId: 'AUR-013',
    productName: 'Zip-Up Hoodie',
    productCategory: 'Outerwear',
    brand: 'Aurora Apparel',
    price: 72.99,
    description: 'Full-zip hoodie with soft fleece interior. Features side pockets and adjustable drawstring hood.',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500&h=700&fit=crop',
    colors: ['Black', 'Gray', 'Navy', 'Burgundy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL']
  },
  {
    productId: 'AUR-014',
    productName: 'Athletic Performance Hoodie',
    productCategory: 'Outerwear',
    brand: 'Aurora Apparel',
    price: 78.99,
    description: 'Technical hoodie with moisture-wicking fabric. Perfect for workouts or casual athletic wear.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=700&fit=crop',
    colors: ['Black', 'Charcoal', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-015',
    productName: 'Cropped Hoodie',
    productCategory: 'Outerwear',
    brand: 'Aurora Apparel',
    price: 65.99,
    description: 'Trendy cropped hoodie with relaxed fit. Perfect for pairing with high-waisted bottoms.',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&h=700&fit=crop',
    colors: ['White', 'Pink', 'Lavender', 'Black'],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    productId: 'AUR-016',
    productName: 'Floral Summer Dress',
    productCategory: 'Dresses',
    brand: 'Aurora Apparel',
    price: 109.99,
    description: 'Lightweight floral dress perfect for summer days. Features adjustable straps and flowing silhouette.',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=700&fit=crop',
    colors: ['Floral Blue', 'Floral Pink', 'Floral Yellow'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-017',
    productName: 'Little Black Dress',
    productCategory: 'Dresses',
    brand: 'Aurora Apparel',
    price: 129.99,
    description: 'Classic LBD with modern touches. Versatile design that transitions from office to evening.',
    image: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=500&h=700&fit=crop',
    colors: ['Black'],
    sizes: ['XXS', 'XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-018',
    productName: 'Maxi Boho Dress',
    productCategory: 'Dresses',
    brand: 'Aurora Apparel',
    price: 115.99,
    description: 'Flowing maxi dress with bohemian flair. Features elastic waist and relaxed fit for all-day comfort.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=700&fit=crop',
    colors: ['Navy', 'Rust', 'Olive'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-019',
    productName: 'Cocktail Party Dress',
    productCategory: 'Dresses',
    brand: 'Aurora Apparel',
    price: 139.99,
    description: 'Stunning cocktail dress perfect for special occasions. Features elegant draping and flattering cut.',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&h=700&fit=crop',
    colors: ['Red', 'Black', 'Navy', 'Emerald'],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    productId: 'AUR-020',
    productName: 'Casual Shirt Dress',
    productCategory: 'Dresses',
    brand: 'Aurora Apparel',
    price: 89.99,
    description: 'Comfortable shirt dress with button-down front. Perfect for casual outings or work-from-home days.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=700&fit=crop',
    colors: ['White', 'Chambray', 'Khaki'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-021',
    productName: 'Cable Knit Sweater',
    productCategory: 'Knitwear',
    brand: 'Aurora Apparel',
    price: 89.99,
    description: 'Classic cable knit sweater in soft wool blend. Timeless design with ribbed trim and comfortable fit.',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500&h=700&fit=crop',
    colors: ['Cream', 'Navy', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-022',
    productName: 'Turtleneck Sweater',
    productCategory: 'Knitwear',
    brand: 'Aurora Apparel',
    price: 82.99,
    description: 'Cozy turtleneck sweater perfect for layering. Features soft merino wool blend and relaxed fit.',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=500&h=700&fit=crop',
    colors: ['Black', 'Camel', 'Ivory'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-023',
    productName: 'Chunky Knit Cardigan',
    productCategory: 'Knitwear',
    brand: 'Aurora Apparel',
    price: 94.99,
    description: 'Oversized chunky cardigan with button closure. Ultra-cozy and perfect for cooler weather.',
    image: '/images/cardigan.jpg',
    colors: ['Oatmeal', 'Gray', 'Rust'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-024',
    productName: 'Striped Knit Pullover',
    productCategory: 'Knitwear',
    brand: 'Aurora Apparel',
    price: 76.99,
    description: 'Modern striped pullover with crew neck. Lightweight knit perfect for transitional seasons.',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&h=700&fit=crop',
    colors: ['Navy/White', 'Black/Cream'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-025',
    productName: 'Cropped Cargo Pants',
    productCategory: 'Bottoms',
    brand: 'Aurora Apparel',
    price: 79.99,
    description: 'Trendy cropped cargo pants with multiple pockets. High-waisted fit with adjustable drawstring.',
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=700&fit=crop',
    colors: ['Olive', 'Black', 'Khaki'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-026',
    productName: 'Pleated Midi Skirt',
    productCategory: 'Bottoms',
    brand: 'Aurora Apparel',
    price: 68.99,
    description: 'Elegant pleated midi skirt with elastic waist. Flowing silhouette perfect for both casual and dressy occasions.',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=700&fit=crop',
    colors: ['Black', 'Navy', 'Burgundy', 'Beige'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-027',
    productName: 'High-Waisted Shorts',
    productCategory: 'Bottoms',
    brand: 'Aurora Apparel',
    price: 54.99,
    description: 'Classic high-waisted shorts with tailored fit. Perfect for summer styling with any top.',
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&h=700&fit=crop',
    colors: ['White', 'Black', 'Tan', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-028',
    productName: 'Jogger Sweatpants',
    productCategory: 'Bottoms',
    brand: 'Aurora Apparel',
    price: 62.99,
    description: 'Comfortable jogger sweatpants with tapered leg. Soft fleece interior and elastic waistband with drawstring.',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=700&fit=crop',
    colors: ['Gray', 'Black', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    productId: 'AUR-029',
    productName: 'Tailored Trousers',
    productCategory: 'Bottoms',
    brand: 'Aurora Apparel',
    price: 84.99,
    description: 'Professional tailored trousers with straight leg cut. Features belt loops and side pockets.',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500&h=700&fit=crop',
    colors: ['Black', 'Charcoal', 'Navy'],
    sizes: ['24', '26', '28', '30', '32', '34']
  },
  {
    productId: 'AUR-030',
    productName: 'Longline Blazer',
    productCategory: 'Outerwear',
    brand: 'Aurora Apparel',
    price: 129.99,
    description: 'Sophisticated longline blazer with structured shoulders. Perfect for office or smart casual styling.',
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500&h=700&fit=crop',
    colors: ['Black', 'Camel', 'Navy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-031',
    productName: 'Puffer Vest',
    productCategory: 'Outerwear',
    brand: 'Aurora Apparel',
    price: 99.99,
    description: 'Lightweight puffer vest with quilted design. Perfect layering piece for transitional weather.',
    image: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=500&h=700&fit=crop',
    colors: ['Black', 'Olive', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-032',
    productName: 'Denim Jacket',
    productCategory: 'Outerwear',
    brand: 'Aurora Apparel',
    price: 95.99,
    description: 'Classic denim jacket with timeless appeal. Features button closure and chest pockets.',
    image: 'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=500&h=700&fit=crop',
    colors: ['Light Wash', 'Dark Wash'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-033',
    productName: 'Leather Moto Jacket',
    productCategory: 'Outerwear',
    brand: 'Aurora Apparel',
    price: 249.99,
    description: 'Premium leather moto jacket with asymmetric zip. Features multiple pockets and belted waist.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=700&fit=crop',
    colors: ['Black', 'Brown'],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    productId: 'AUR-034',
    productName: 'Trench Coat',
    productCategory: 'Outerwear',
    brand: 'Aurora Apparel',
    price: 179.99,
    description: 'Classic double-breasted trench coat with belt. Water-resistant fabric perfect for rainy days.',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=700&fit=crop',
    colors: ['Beige', 'Black'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    productId: 'AUR-035',
    productName: 'Silk Camisole',
    productCategory: 'Essentials',
    brand: 'Aurora Apparel',
    price: 58.99,
    description: 'Luxurious silk camisole with adjustable straps. Elegant and versatile for layering or solo wear.',
    image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500&h=700&fit=crop',
    colors: ['Black', 'Ivory', 'Navy', 'Blush'],
    sizes: ['XS', 'S', 'M', 'L']
  },
  {
    productId: 'AUR-036',
    productName: 'Striped Long Sleeve Tee',
    productCategory: 'Essentials',
    brand: 'Aurora Apparel',
    price: 44.99,
    description: 'Classic striped long sleeve tee in soft cotton. Perfect for casual everyday wear.',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&h=700&fit=crop',
    colors: ['Navy/White', 'Black/White', 'Red/White'],
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  }
];

// Session data (in-memory)
const sessions = {};

// Helper to get or create session
function getSession(req) {
  let sessionId = req.cookies.sessionId;
  if (!sessionId || !sessions[sessionId]) {
    sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessions[sessionId] = {
      cart: []
    };
  }
  return { sessionId, session: sessions[sessionId] };
}

// Helper to generate order ID
function generateOrderId() {
  return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get cart
app.get('/api/cart', (req, res) => {
  const { sessionId, session } = getSession(req);
  res.cookie('sessionId', sessionId, { httpOnly: true });
  
  const cartItems = session.cart.map(item => {
    const product = products.find(p => p.productId === item.productId);
    return {
      ...item,
      image: product ? product.image : '/images/placeholder.jpg',
      name: item.productName
    };
  });
  
  res.json({
    sessionId: sessionId,
    cart: cartItems,
    items: cartItems,
    total: session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  });
});

// Add to cart
app.post('/api/cart/add', (req, res) => {
  const { sessionId, session } = getSession(req);
  res.cookie('sessionId', sessionId, { httpOnly: true });
  
  const { id, productId, color, size, quantity, qty } = req.body;
  const finalQty = parseInt(quantity || qty) || 1;
  const finalProductId = id || productId;
  
  const product = products.find(p => p.productId === finalProductId);
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // Check if exact item (same product, color, size) already in cart
  const existingItem = session.cart.find(
    item => item.productId === finalProductId && item.color === color && item.size === size
  );
  
  if (existingItem) {
    existingItem.quantity += finalQty;
  } else {
    session.cart.push({
      productId: product.productId,
      productName: product.productName,
      productCategory: product.productCategory,
      brand: product.brand,
      price: product.price,
      color: color,
      size: size,
      quantity: finalQty
    });
  }
  
  const total = session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json({
    success: true,
    cart: session.cart,
    total: total,
    cartCount: session.cart.reduce((sum, item) => sum + item.quantity, 0)
  });
});

// Update cart quantity
app.post('/api/cart/update', (req, res) => {
  const { sessionId, session } = getSession(req);
  res.cookie('sessionId', sessionId, { httpOnly: true });
  
  const { productId, color, size, change } = req.body;
  
  const item = session.cart.find(
    item => item.productId === productId && item.color === color && item.size === size
  );
  
  if (!item) {
    return res.json({ success: false, message: 'Item not found in cart' });
  }
  
  item.quantity += parseInt(change);
  
  // Remove item if quantity becomes 0 or less
  if (item.quantity <= 0) {
    session.cart = session.cart.filter(
      cartItem => !(cartItem.productId === productId && cartItem.color === color && cartItem.size === size)
    );
  }
  
  const total = session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json({
    success: true,
    cart: session.cart,
    items: session.cart,
    total: total,
    cartCount: session.cart.reduce((sum, item) => sum + item.quantity, 0)
  });
});

// Remove from cart
app.post('/api/cart/remove', (req, res) => {
  const { sessionId, session } = getSession(req);
  res.cookie('sessionId', sessionId, { httpOnly: true });
  
  const { productId, color, size } = req.body;
  
  session.cart = session.cart.filter(
    item => !(item.productId === productId && item.color === color && item.size === size)
  );
  
  const total = session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  res.json({
    success: true,
    cart: session.cart,
    items: session.cart,
    total: total,
    cartCount: session.cart.reduce((sum, item) => sum + item.quantity, 0)
  });
});

// Get order details
app.get('/api/order/:orderId', (req, res) => {
  const { sessionId, session } = getSession(req);
  
  if (!session.lastOrder || session.lastOrder.id !== req.params.orderId) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  res.json(session.lastOrder);
});

// Process checkout
app.post('/api/checkout', (req, res) => {
  const { sessionId, session } = getSession(req);
  
  if (session.cart.length === 0) {
    return res.json({ success: false, message: 'Cart is empty' });
  }
  
  const { firstName, lastName, email, address, city, state, zip, country, cardNumber, expiry, cvv } = req.body;
  
  // Generate order
  const orderId = generateOrderId();
  const orderRevenue = session.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const order = {
    id: orderId,
    revenue: orderRevenue,
    items: session.cart.map(item => ({
      productId: item.productId,
      name: item.productName,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size
    })),
    firstName: firstName,
    lastName: lastName,
    email: email,
    address: address,
    city: city,
    state: state,
    zip: zip,
    country: country || 'USA',
    createdAt: new Date().toISOString(),
    sessionId: sessionId
  };
  
  // Store order in session
  session.lastOrder = order;
  
  // Clear cart
  session.cart = [];
  
  res.json({ success: true, orderId: orderId });
});

// Start server
app.listen(PORT, () => {
  console.log(`Aurora Apparel server running at http://localhost:${PORT}`);
  console.log('Routes:');
  console.log('  Static files served from /public');
  console.log('  GET  /api/products    - Get all products');
  console.log('  GET  /api/cart        - Get cart');
  console.log('  POST /api/cart/add    - Add to cart');
  console.log('  POST /api/cart/remove - Remove from cart');
  console.log('  GET  /api/order/:id   - Get order details');
  console.log('  POST /api/checkout    - Process checkout');
});
