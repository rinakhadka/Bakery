/**
 * ============================================================
 * Sweet Crumbs Bakery - Backend Server (Phase 3 - Product Catalog)
 * ============================================================
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Order = require('./models/Order');
const OrderItem = require('./models/OrderItem');
const Payment = require('./models/Payment');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
let mongoReady = false;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI)
    .then(() => {
      mongoReady = true;
      console.log('🗄️  MongoDB connected successfully');
    })
    .catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
    });
} else {
  console.log('ℹ️  MONGODB_URI is not configured. Orders will not be persisted to MongoDB.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

// Broad CORS - supports any localhost port (3000, 3001, 3002, 5173, etc.)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like curl, Postman) and any localhost
    if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ============================================================
// IN-MEMORY PRODUCT CATALOG
// These are the source-of-truth products served by the backend.
// In Phase 3 (MongoDB), these will be replaced by database queries.
// ============================================================
const products = [
  // ===== CAKES =====
  {
    id: 'cake-01',
    name: 'Belgian Chocolate Truffle Cake',
    slug: 'belgian-chocolate-truffle-cake',
    category: 'Cakes',
    price: 1850,
    rating: 4.9,
    reviewsCount: 48,
    stock: 12,
    isAvailable: true,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    description: 'Layers of moist, dark chocolate sponge drenched in 70% Belgian chocolate ganache, finished with artisan chocolate curls.',
    ingredients: ['Belgian dark chocolate (70%)', 'European butter', 'Dutch-process cocoa', 'Organic unbleached flour', 'Farm-fresh eggs', 'Pure vanilla extract'],
    weight: '1 kg',
    preparationTime: '4 hours notice',
    isFeatured: true
  },
  {
    id: 'cake-02',
    name: 'Classic Red Velvet Cake',
    slug: 'classic-red-velvet-cake',
    category: 'Cakes',
    price: 1750,
    rating: 4.8,
    reviewsCount: 36,
    stock: 9,
    isAvailable: true,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=800&q=80',
    description: 'A traditional Southern red velvet sponge with a subtle hint of cocoa, layered with our signature Madagascar vanilla cream cheese frosting.',
    ingredients: ['Buttermilk', 'Madagascar cream cheese', 'Unbleached flour', 'Organic cocoa', 'Pure vanilla extract', 'Beetroot extract'],
    weight: '1 kg',
    preparationTime: '4 hours notice',
    isFeatured: false
  },
  {
    id: 'cake-03',
    name: 'Traditional Black Forest Cake',
    slug: 'traditional-black-forest-cake',
    category: 'Cakes',
    price: 1650,
    rating: 4.7,
    reviewsCount: 29,
    stock: 8,
    isAvailable: true,
    badge: 'Classic',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=800&q=80',
    description: 'Decadent chocolate sponge soaked in tart cherry compote syrup, layered with fresh whipped dairy cream and shaved bittersweet chocolate.',
    ingredients: ['Dark sour cherries', 'Whipped dairy cream', 'Dark chocolate curls', 'Cocoa powder', 'Unbleached flour', 'Pure cane sugar'],
    weight: '1 kg',
    preparationTime: '3 hours notice',
    isFeatured: false
  },
  {
    id: 'cake-04',
    name: 'Madagascar Vanilla Bean Cake',
    slug: 'madagascar-vanilla-bean-cake',
    category: 'Cakes',
    price: 1500,
    rating: 4.8,
    reviewsCount: 22,
    stock: 14,
    isAvailable: true,
    badge: 'Chef Choice',
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    description: 'Fluffy, buttery vanilla sponge infused with real Madagascar vanilla bean caviar and frosted with silky Swiss meringue buttercream.',
    ingredients: ['Madagascar vanilla beans', 'European cultured butter', 'Swiss meringue frosting', 'Pastry flour', 'Fresh farm milk'],
    weight: '1 kg',
    preparationTime: '3 hours notice',
    isFeatured: false
  },
  {
    id: 'cake-05',
    name: 'Alpine Strawberry Cream Cake',
    slug: 'alpine-strawberry-cream-cake',
    category: 'Cakes',
    price: 1800,
    rating: 4.9,
    reviewsCount: 31,
    stock: 7,
    isAvailable: true,
    badge: 'Seasonal',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80',
    description: 'Light-as-air vanilla chiffon sponge layered with freshly harvested strawberries and chantilly cream.',
    ingredients: ['Fresh alpine strawberries', 'Chantilly whipped cream', 'Chiffon sponge', 'Strawberry glaze', 'Organic cane sugar'],
    weight: '1 kg',
    preparationTime: '4 hours notice',
    isFeatured: true
  },

  // ===== PASTRIES =====
  {
    id: 'pastry-01',
    name: 'Artisan French Butter Croissant',
    slug: 'artisan-french-butter-croissant',
    category: 'Pastries',
    price: 220,
    rating: 4.9,
    reviewsCount: 54,
    stock: 25,
    isAvailable: true,
    badge: 'Fresh Daily',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional 27-layer laminated French viennoiserie baked golden brown with crisp outer layers and an airy honeycomb center.',
    ingredients: ['French cultured butter (84% butterfat)', 'French T55 flour', 'Natural yeast levain', 'Whole milk', 'Sea salt'],
    weight: '90 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: true
  },
  {
    id: 'pastry-02',
    name: 'Pain au Chocolat',
    slug: 'pain-au-chocolat',
    category: 'Pastries',
    price: 260,
    rating: 4.8,
    reviewsCount: 41,
    stock: 18,
    isAvailable: true,
    badge: 'Favorite',
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=800&q=80',
    description: 'Flaky buttery croissant dough folded around two batons of semi-sweet dark chocolate, baked until caramelized.',
    ingredients: ['Semi-sweet chocolate batons', 'Laminated dough', 'Cultured butter', 'Organic wheat flour', 'Egg wash'],
    weight: '105 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },
  {
    id: 'pastry-03',
    name: 'Vanilla Custard Cream Pastry',
    slug: 'vanilla-custard-cream-pastry',
    category: 'Pastries',
    price: 240,
    rating: 4.7,
    reviewsCount: 27,
    stock: 15,
    isAvailable: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80',
    description: 'Puff pastry horns piped with freshly cooked vanilla bean diplomat custard and dusted with snowy powdered sugar.',
    ingredients: ['Egg yolk custard', 'Madagascar vanilla', 'Crisp puff pastry', 'Powdered sugar', 'Dairy cream'],
    weight: '110 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },
  {
    id: 'pastry-04',
    name: 'Glazed Fresh Fruit Danish',
    slug: 'glazed-fresh-fruit-danish',
    category: 'Pastries',
    price: 280,
    rating: 4.8,
    reviewsCount: 30,
    stock: 10,
    isAvailable: true,
    badge: 'Seasonal',
    image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=800&q=80',
    description: 'Buttery braided puff pastry filled with almond frangipane cream, topped with kiwi, berries, and peach slices.',
    ingredients: ['Fresh seasonal berries', 'Kiwi slices', 'Almond cream', 'Laminated puff pastry', 'Apricot glaze'],
    weight: '130 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },

  // ===== BREADS =====
  {
    id: 'bread-01',
    name: 'Rustic Garlic Herb Sourdough',
    slug: 'rustic-garlic-herb-sourdough',
    category: 'Bread',
    price: 350,
    rating: 4.8,
    reviewsCount: 34,
    stock: 16,
    isAvailable: true,
    badge: 'Organic',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    description: 'Naturally fermented 36-hour sourdough loaf baked on stone hearth with roasted garlic cloves and fresh rosemary.',
    ingredients: ['Stone-ground unbleached flour', 'Wild sourdough starter', 'Roasted garlic', 'Fresh rosemary', 'Himalayan rock salt', 'Water'],
    weight: '650 g',
    preparationTime: 'Baked at 6:00 AM',
    isFeatured: true
  },
  {
    id: 'bread-02',
    name: 'Artisan Crusty French Baguette',
    slug: 'artisan-crusty-french-baguette',
    category: 'Bread',
    price: 200,
    rating: 4.7,
    reviewsCount: 26,
    stock: 20,
    isAvailable: true,
    badge: 'Traditional',
    image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80',
    description: 'Crisp golden crust with a soft, open crumb structure, baked according to traditional French bread-making techniques.',
    ingredients: ['French wheat flour', 'Water', 'Levain culture', 'Sea salt'],
    weight: '300 g',
    preparationTime: 'Baked twice daily',
    isFeatured: false
  },
  {
    id: 'bread-03',
    name: 'Wholesome Whole Wheat Loaf',
    slug: 'wholesome-whole-wheat-loaf',
    category: 'Bread',
    price: 250,
    rating: 4.6,
    reviewsCount: 19,
    stock: 18,
    isAvailable: true,
    badge: 'Healthy',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    description: '100% stone-ground whole wheat sandwich loaf packed with dietary fiber, sweetened with raw mountain honey.',
    ingredients: ['100% whole wheat flour', 'Wild raw honey', 'Extra virgin olive oil', 'Yeast', 'Purified water', 'Sea salt'],
    weight: '500 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },
  {
    id: 'bread-04',
    name: 'Soft Farmhouse White Milk Bread',
    slug: 'soft-farmhouse-white-milk-bread',
    category: 'Bread',
    price: 180,
    rating: 4.7,
    reviewsCount: 28,
    stock: 22,
    isAvailable: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?auto=format&fit=crop&w=800&q=80',
    description: 'Pillow-soft Japanese-style milk bread loaf baked with whole milk and pure butter, ideal for morning toasts.',
    ingredients: ['Enriched unbleached flour', 'Fresh whole milk', 'Butter', 'Cane sugar', 'Yeast', 'Salt'],
    weight: '450 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },

  // ===== COOKIES =====
  {
    id: 'cookie-01',
    name: 'Chewy Double Chocolate Chip Cookies',
    slug: 'chewy-double-chocolate-chip-cookies',
    category: 'Cookies',
    price: 380,
    rating: 4.9,
    reviewsCount: 62,
    stock: 30,
    isAvailable: true,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
    description: 'Pack of 6 jumbo cookies with crisp golden edges, gooey melted chocolate centers, and a touch of sea salt flakes.',
    ingredients: ['Dark chocolate chunks', 'Semi-sweet chocolate chips', 'Brown cane sugar', 'Pure butter', 'Flour', 'Maldon sea salt flakes'],
    weight: 'Pack of 6 (300 g)',
    preparationTime: 'Ready to dispatch',
    isFeatured: true
  },
  {
    id: 'cookie-02',
    name: 'Heritage Danish Butter Shortbread',
    slug: 'heritage-danish-butter-shortbread',
    category: 'Cookies',
    price: 420,
    rating: 4.8,
    reviewsCount: 33,
    stock: 25,
    isAvailable: true,
    badge: 'Gift Box',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    description: 'Melt-in-your-mouth shortbread biscuits made with 4 pure ingredients, packed in our bakery kraft box.',
    ingredients: ['European butter', 'Flour', 'Confectioners sugar', 'Cornstarch', 'Pinch of sea salt'],
    weight: 'Pack of 10 (250 g)',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },
  {
    id: 'cookie-03',
    name: 'Golden Cinnamon Oat Raisin Cookies',
    slug: 'golden-cinnamon-oat-raisin-cookies',
    category: 'Cookies',
    price: 350,
    rating: 4.6,
    reviewsCount: 21,
    stock: 18,
    isAvailable: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
    description: 'Wholesome rolled oats blended with warm Ceylon cinnamon, nutmeg, and plump California golden raisins.',
    ingredients: ['Rolled oats', 'Golden raisins', 'Ceylon cinnamon', 'Raw brown sugar', 'Butter', 'Whole wheat flour'],
    weight: 'Pack of 6 (280 g)',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },

  // ===== CUPCAKES =====
  {
    id: 'cupcake-01',
    name: 'Salted Caramel Vanilla Cupcake',
    slug: 'salted-caramel-vanilla-cupcake',
    category: 'Cupcakes',
    price: 180,
    rating: 4.8,
    reviewsCount: 32,
    stock: 16,
    isAvailable: true,
    badge: null,
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=800&q=80',
    description: 'Tender vanilla bean cupcake with a gooey salted caramel core, swirled with caramel buttercream frosting.',
    ingredients: ['Vanilla sponge', 'Homemade salted caramel', 'Buttercream', 'Gold sanding sugar', 'Fleur de sel'],
    weight: '100 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },
  {
    id: 'cupcake-02',
    name: 'Dark Chocolate Ganache Cupcake',
    slug: 'dark-chocolate-ganache-cupcake',
    category: 'Cupcakes',
    price: 190,
    rating: 4.9,
    reviewsCount: 41,
    stock: 20,
    isAvailable: true,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80',
    description: 'Rich dark chocolate cupcake topped with silky 70% Belgian ganache and a dusting of premium cocoa powder.',
    ingredients: ['Belgian dark chocolate', 'Dutch cocoa', 'Pastry flour', 'Farm eggs', 'Heavy cream', 'Pure vanilla'],
    weight: '110 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: true
  },
  {
    id: 'cupcake-03',
    name: 'Lemon Blueberry Cupcake',
    slug: 'lemon-blueberry-cupcake',
    category: 'Cupcakes',
    price: 175,
    rating: 4.7,
    reviewsCount: 28,
    stock: 14,
    isAvailable: true,
    badge: 'Seasonal',
    image: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?auto=format&fit=crop&w=800&q=80',
    description: 'Zesty lemon sponge studded with fresh blueberries, crowned with tangy lemon cream cheese frosting.',
    ingredients: ['Lemon zest', 'Fresh blueberries', 'Cream cheese', 'Cane sugar', 'Pastry flour', 'Butter'],
    weight: '100 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },

  // ===== DESSERTS =====
  {
    id: 'dessert-01',
    name: 'Fudgy Dark Chocolate Brownie',
    slug: 'fudgy-dark-chocolate-brownie',
    category: 'Desserts',
    price: 240,
    rating: 4.9,
    reviewsCount: 57,
    stock: 20,
    isAvailable: true,
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-fudgy brownie square with shiny crackly crust, loaded with melted dark chocolate pools and roasted walnuts.',
    ingredients: ['70% Dark chocolate', 'Roasted walnuts', 'Cocoa powder', 'Butter', 'Eggs', 'Cane sugar'],
    weight: '140 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },
  {
    id: 'dessert-02',
    name: 'New York Baked Cheesecake Slice',
    slug: 'new-york-baked-cheesecake-slice',
    category: 'Desserts',
    price: 360,
    rating: 4.9,
    reviewsCount: 44,
    stock: 14,
    isAvailable: true,
    badge: 'Chef Favorite',
    image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80',
    description: 'Dense, velvety Philadelphia cream cheese filling over a buttery graham cracker crust, topped with berry coulis.',
    ingredients: ['Philadelphia cream cheese', 'Graham cracker crust', 'Sour cream', 'Lemon zest', 'Blueberry-raspberry coulis'],
    weight: '160 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  },
  {
    id: 'dessert-03',
    name: 'Gourmet Glazed Cinnamon Donut',
    slug: 'gourmet-glazed-cinnamon-donut',
    category: 'Desserts',
    price: 150,
    rating: 4.7,
    reviewsCount: 39,
    stock: 25,
    isAvailable: true,
    badge: 'Daily Treat',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    description: 'Brioche dough donut fried to golden perfection, coated with a shiny Madagascar vanilla sugar glaze and cinnamon.',
    ingredients: ['Brioche yeast dough', 'Madagascar vanilla glaze', 'Ceylon cinnamon', 'Pure butter', 'Milk'],
    weight: '90 g',
    preparationTime: 'Ready to dispatch',
    isFeatured: false
  }
];

// ============================================================
// API ROUTES
// ============================================================

// Root
app.get('/', (req, res) => {
  res.json({
    project: 'Sweet Crumbs Bakery API',
    status: 'online',
    message: 'Welcome to Sweet Crumbs Bakery Backend! 🥐🎂',
    version: '2.0',
    endpoints: {
      test: 'GET /api/test',
      allProducts: 'GET /api/products',
      productSearch: 'GET /api/products?search=cake&category=Cakes&minPrice=100&maxPrice=2000',
      featuredProducts: 'GET /api/products/featured',
      singleProduct: 'GET /api/products/:id',
      categories: 'GET /api/categories'
    }
  });
});

// Health check
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sweet Crumbs Bakery API is running smoothly and connected to React!',
    timestamp: new Date().toISOString(),
    serverInfo: {
      nodeVersion: process.version,
      port: PORT,
      status: 'healthy',
      totalProducts: products.length
    }
  });
});

/**
 * @route   GET /api/categories
 * @desc    Get all available product categories
 */
app.get('/api/categories', (req, res) => {
  const categoryOrder = ['Cakes', 'Pastries', 'Bread', 'Cookies', 'Cupcakes', 'Desserts'];
  const categoryCounts = {};
  products.forEach(p => {
    if (!categoryCounts[p.category]) categoryCounts[p.category] = 0;
    categoryCounts[p.category]++;
  });

  const categories = [
    { name: 'All', count: products.length },
    ...categoryOrder.map(name => ({
      name,
      count: categoryCounts[name] || 0
    }))
  ];

  res.status(200).json({
    success: true,
    data: categories
  });
});

/**
 * @route   GET /api/products/featured
 * @desc    Get featured products (backwards-compatible with Phase 1)
 */
app.get('/api/products/featured', (req, res) => {
  const featured = products.filter(p => p.isFeatured === true).slice(0, 6);
  res.status(200).json({
    success: true,
    count: featured.length,
    data: featured
  });
});

/**
 * @route   GET /api/products
 * @desc    Get all products with optional filtering and search
 * @query   search (string), category (string), minPrice (number), maxPrice (number), sort (string)
 */
app.get('/api/products', (req, res) => {
  let result = [...products];

  // Search by name, description, or ingredients
  const { search, category, minPrice, maxPrice, sort } = req.query;

  if (search && search.trim()) {
    const term = search.trim().toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.ingredients.some(ing => ing.toLowerCase().includes(term))
    );
  }

  // Category filter (case-insensitive). Accept legacy "Breads" as "Bread".
  if (category && category.toLowerCase() !== 'all') {
    const requested = category.toLowerCase() === 'breads' ? 'bread' : category.toLowerCase();
    result = result.filter(p => p.category.toLowerCase() === requested);
  }

  // Price filter
  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter(p => p.price <= Number(maxPrice));
  }

  // Sorting
  if (sort === 'price-low') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    result.sort((a, b) => b.reviewsCount - a.reviewsCount);
  } else if (sort === 'featured') {
    result.sort((a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)));
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
});

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by its ID or slug
 */
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id || p.slug === id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: `Product with id '${id}' was not found.`
    });
  }

  // Also include related products from the same category
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.status(200).json({
    success: true,
    data: product,
    related
  });
});

// ============================================================
// KHALTI E-PAYMENT (SANDBOX / TEST READY)
// ============================================================
// The secret key stays on the backend. The browser only receives
// Khalti's payment_url and is redirected there.
const KHALTI_INITIATE_URL = 'https://dev.khalti.com/api/v2/epayment/initiate/';
const KHALTI_LOOKUP_URL = 'https://dev.khalti.com/api/v2/epayment/lookup/';
const FREE_DELIVERY_THRESHOLD = 1000;
const STANDARD_DELIVERY_FEE = 100;

function getServerCartTotals(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Your cart is empty.');
  }

  let subtotal = 0;
  const normalizedItems = [];

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    const quantity = Number(item.quantity);

    if (!product) throw new Error(`Product '${item.productId}' was not found.`);
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error(`Invalid quantity for '${product.name}'.`);
    }
    if (quantity > product.stock) {
      throw new Error(`Only ${product.stock} unit(s) of ${product.name} are available.`);
    }

    subtotal += product.price * quantity;
    normalizedItems.push({
      product: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      quantity,
      image: product.image
    });
  }

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const totalAmount = subtotal + deliveryFee;

  return { normalizedItems, subtotal, deliveryFee, totalAmount };
}

app.post('/api/payment/khalti/initiate', async (req, res) => {
  try {
    const secretKey = process.env.KHALTI_SECRET_KEY;
    if (!secretKey || secretKey === 'PASTE_YOUR_KHALTI_TEST_SECRET_KEY_HERE') {
      return res.status(503).json({
        success: false,
        code: 'KHALTI_KEY_MISSING',
        message: 'Khalti test key is not configured yet. Add KHALTI_SECRET_KEY to backend/.env.'
      });
    }

    const { items, customer, shippingAddress } = req.body || {};
    const { normalizedItems, subtotal, deliveryFee, totalAmount } = getServerCartTotals(items);

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ success: false, message: 'Customer name, email and phone are required.' });
    }

    const orderId = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const returnUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/khalti/callback`;
    const websiteUrl = process.env.WEBSITE_URL || process.env.CLIENT_URL || 'http://localhost:3000';

    const payload = {
      return_url: returnUrl,
      website_url: websiteUrl,
      amount: Math.round(totalAmount * 100),
      purchase_order_id: orderId,
      purchase_order_name: `Sweet Crumbs Bakery ${orderId}`,
      customer_info: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone
      }
    };

    const response = await fetch(KHALTI_INITIATE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Key ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.pidx || !data.payment_url) {
      console.error('[Khalti Initiate Error]', data);
      return res.status(502).json({
        success: false,
        message: data.detail || data.message || 'Khalti could not initiate the payment.',
        khalti: data
      });
    }

    // Create the order as PENDING before redirecting to Khalti.
    // The order is marked PAID only after the backend verifies the Khalti pidx.
    if (mongoReady) {
      try {
        const order = await Order.create({
          orderNumber: orderId,
          customer,
          shippingAddress: shippingAddress || {},
          subtotal,
          deliveryFee,
          totalAmount,
          paymentMethod: 'Khalti',
          paymentStatus: 'PENDING',
          orderStatus: 'PENDING_PAYMENT',
          khaltiPidx: data.pidx
        });

        await OrderItem.insertMany(normalizedItems.map((item) => ({
          order: order._id,
          productId: item.product,
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })));

        await Payment.create({
          order: order._id,
          provider: 'Khalti',
          pidx: data.pidx,
          amount: totalAmount,
          status: 'Pending',
          verified: false
        });
      } catch (dbError) {
        console.error('[MongoDB Order Save Error]', dbError);
        // Do not expose database internals or block the Khalti redirect.
      }
    }

    // These details are returned to the browser only as temporary checkout data.
    // The final payment status is always decided by Khalti lookup on the backend.
    res.status(200).json({
      success: true,
      pidx: data.pidx,
      paymentUrl: data.payment_url,
      order: {
        id: orderId,
        user: customer,
        shippingAddress: shippingAddress || {},
        orderItems: normalizedItems,
        subtotal,
        deliveryFee,
        totalAmount,
        paymentMethod: 'Khalti',
        paymentStatus: 'PENDING',
        orderStatus: 'PENDING_PAYMENT',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[Khalti Initiate Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to start Khalti payment.' });
  }
});

app.post('/api/payment/khalti/lookup', async (req, res) => {
  try {
    const secretKey = process.env.KHALTI_SECRET_KEY;
    if (!secretKey || secretKey === 'PASTE_YOUR_KHALTI_TEST_SECRET_KEY_HERE') {
      return res.status(503).json({
        success: false,
        code: 'KHALTI_KEY_MISSING',
        message: 'Khalti test key is not configured yet.'
      });
    }

    const { pidx } = req.body || {};
    if (!pidx) {
      return res.status(400).json({ success: false, message: 'Khalti pidx is required.' });
    }

    const response = await fetch(KHALTI_LOOKUP_URL, {
      method: 'POST',
      headers: {
        Authorization: `Key ${secretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pidx })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Khalti Lookup Error]', data);
      return res.status(502).json({
        success: false,
        message: data.detail || data.message || 'Khalti verification failed.',
        khalti: data
      });
    }

    const isCompleted = data.status === 'Completed';
    const transactionId = data.transaction_id || null;
    const paidAmount = data.total_amount ? Number(data.total_amount) / 100 : null;

    if (mongoReady) {
      try {
        const payment = await Payment.findOne({ pidx });
        if (payment) {
          payment.status = data.status || payment.status;
          payment.transactionId = transactionId;
          payment.amount = paidAmount ?? payment.amount;
          payment.verified = isCompleted;
          payment.rawResponse = data;
          payment.paidAt = isCompleted ? new Date() : null;
          await payment.save();

          const orderUpdate = {
            paymentStatus: isCompleted ? 'PAID' : 'FAILED',
            khaltiStatus: data.status || null,
            paymentReference: transactionId || pidx
          };
          if (isCompleted) {
            orderUpdate.orderStatus = 'CONFIRMED';
            orderUpdate.paidAt = new Date();
          }
          await Order.findByIdAndUpdate(payment.order, orderUpdate);
        }
      } catch (dbError) {
        console.error('[MongoDB Payment Update Error]', dbError);
      }
    }

    res.status(200).json({
      success: true,
      verified: isCompleted,
      status: data.status,
      transactionId,
      totalAmount: paidAmount,
      khalti: data
    });
  } catch (error) {
    console.error('[Khalti Lookup Error]', error);
    res.status(500).json({ success: false, message: error.message || 'Unable to verify Khalti payment.' });
  }
});

// ============================================================
// ORDER API
// ============================================================
app.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    if (!mongoReady) return res.status(503).json({ success: false, message: 'MongoDB is not connected.' });
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    const items = await OrderItem.find({ order: order._id }).lean();
    const payment = await Payment.findOne({ order: order._id }).lean();
    res.json({ success: true, data: { ...order, id: order.orderNumber, orderItems: items, payment } });
  } catch (error) {
    console.error('[Order Fetch Error]', error);
    res.status(500).json({ success: false, message: 'Unable to fetch order.' });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    if (!mongoReady) return res.status(503).json({ success: false, message: 'MongoDB is not connected.' });
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ success: false, message: 'Email is required.' });
    const orders = await Order.find({ 'customer.email': email }).sort({ createdAt: -1 }).lean();
    const withItems = await Promise.all(orders.map(async (order) => ({
      ...order,
      id: order.orderNumber,
      orderItems: await OrderItem.find({ order: order._id }).lean()
    })));
    res.json({ success: true, count: withItems.length, data: withItems });
  } catch (error) {
    console.error('[Orders Fetch Error]', error);
    res.status(500).json({ success: false, message: 'Unable to fetch orders.' });
  }
});

// ============================================================
// ERROR HANDLING
// ============================================================

// 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🥐 Sweet Crumbs Bakery Backend Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛒 Products: http://localhost:${PORT}/api/products`);
  console.log(`🔍 Search:   http://localhost:${PORT}/api/products?search=cake`);
  console.log(`🗂️  Category: http://localhost:${PORT}/api/products?category=Cakes`);
  console.log(`📦 Single:   http://localhost:${PORT}/api/products/cake-01`);
  console.log(`====================================================`);
});
