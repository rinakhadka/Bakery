import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Award, 
  Heart, 
  Star, 
  ShoppingBag, 
  Send,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { getFeaturedProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { featuredBakeryProducts } from '../data/products';

/**
 * Sweet Crumbs Bakery - Home Page Component
 * Warm, food-focused, elegant design with React Router integration.
 */
export default function HomePage({ apiStatus, onRefreshApiStatus }) {
  const { addToCart } = useCart();
  
  // Featured products fetched from backend or local fallback
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const response = await getFeaturedProducts();
      if (response && response.data && response.data.length > 0) {
        setFeaturedProducts(response.data);
      } else {
        // Fallback to local catalog preview
        setFeaturedProducts(featuredBakeryProducts);
      }
    } catch (err) {
      console.warn('Could not fetch products from backend, using catalog fallback:', err);
      setFeaturedProducts(featuredBakeryProducts);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    const res = addToCart(product, 1);
    setToastMessage(res.message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Bakery Categories Data
  const categories = [
    {
      id: 'cakes',
      name: 'Artisan Cakes',
      shopCategory: 'Cakes',
      count: '5',
      description: 'Decadent multi-layered celebrations, rich chocolate truffles, and delicate sponge cakes.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular'
    },
    {
      id: 'pastries',
      name: 'Flaky Pastries',
      shopCategory: 'Pastries',
      count: '4',
      description: 'Laminated French croissants, pain au chocolat, fruit danishes, and choux pastries.',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
      badge: 'Fresh'
    },
    {
      id: 'bread',
      name: 'Rustic Bread',
      shopCategory: 'Bread',
      count: '4',
      description: 'Naturally fermented sourdough loaves, crusty baguettes, and roasted garlic bread.',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
      badge: 'Healthy'
    },
    {
      id: 'cookies',
      name: 'Crispy Cookies',
      shopCategory: 'Cookies',
      count: '3',
      description: 'Gooey double-chocolate chip cookies, traditional butter shortbread, and spiced oat clusters.',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
      badge: 'Treat'
    },
    {
      id: 'cupcakes',
      name: 'Cupcakes',
      shopCategory: 'Cupcakes',
      count: '3',
      description: 'Hand-piped cupcakes with salted caramel, Belgian ganache, and lemon blueberry frosting.',
      image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80',
      badge: 'Sweet'
    },
    {
      id: 'desserts',
      name: 'Sweet Desserts',
      shopCategory: 'Desserts',
      count: '3',
      description: 'Fudgy brownies, velvety New York cheesecakes, and glazed cinnamon donuts.',
      image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
      badge: 'Heavenly'
    }
  ];

  // Why Choose Us
  const whyUsFeatures = [
    {
      icon: <Clock className="w-6 h-6 text-[#9F5F2B]" />,
      title: 'Freshly Baked Daily',
      desc: 'Our bakers start before dawn at 4:00 AM so every pastry and bread reaches you warm and aromatic.'
    },
    {
      icon: <Award className="w-6 h-6 text-[#9F5F2B]" />,
      title: 'Quality Ingredients',
      desc: 'Pure European butter, stone-ground flours, fresh local dairy, and organic seasonal berries.'
    },
    {
      icon: <Truck className="w-6 h-6 text-[#9F5F2B]" />,
      title: 'Safe & Fast Delivery',
      desc: 'Temperature-controlled bakery boxes ensuring your cakes arrive picture-perfect and intact.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#9F5F2B]" />,
      title: 'Secure Payment (Khalti)',
      desc: 'Instant, encrypted digital checkout with Khalti payment gateway for peace of mind.'
    }
  ];

  // Demo Customer Reviews
  const testimonials = [
    {
      id: 1,
      name: 'Aayush Sharma',
      role: 'Regular Customer',
      rating: 5,
      comment: 'The Belgian Chocolate Cake made my sister’s graduation celebration unforgettable. Incredibly rich, moist, and not overly sweet. Truly the best bakery in town!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 2,
      name: 'Pooja Thapa',
      role: 'Pastry Lover',
      rating: 5,
      comment: 'The French Butter Croissants have incredible lamination and flakiness. Paired with morning coffee, it feels like sitting in a Paris street café.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 3,
      name: 'Rohan Adhikari',
      role: 'Food Enthusiast',
      rating: 5,
      comment: 'Ordering was super easy and paying with Khalti was seamless! The sourdough bread stayed fresh and crusty for three full days. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1810] text-[#FAF4EB] px-5 py-3 rounded-2xl shadow-xl border border-[#D8C3B0]/30 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 bg-gradient-to-b from-[#FCF9F2] via-[#FAF4EB] to-[#FCF9F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8D2D7] text-[#2C1810] text-xs font-semibold tracking-wide border border-[#ECA1A6]/50 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#9F5F2B]" />
                <span>Sweet Crumbs Artisan Bakery • Kathmandu</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#2C1810] tracking-tight leading-tight">
                Freshly Baked, <br />
                <span className="text-[#9F5F2B] italic font-normal">Made With Love</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6B5347] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Delicious cakes, flaky pastries, crusty sourdough breads and sweet treats baked fresh daily for every special moment and craving.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-semibold text-white bg-[#9F5F2B] hover:bg-[#834C1F] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop Now</span>
                </Link>

                <Link
                  to="/shop?category=Cakes"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-[#2C1810] bg-white border border-[#EADBCC] hover:bg-[#F1E6D8] transition-all duration-200 cursor-pointer shadow-xs"
                >
                  <span>Explore Cakes</span>
                  <ArrowRight className="w-4 h-4 text-[#9F5F2B]" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-[#EADBCC]/70 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <span className="font-serif text-2xl font-bold text-[#2C1810] block">100%</span>
                  <span className="text-[11px] text-[#7A6152] font-medium">Real French Butter</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-[#2C1810] block">04:00 AM</span>
                  <span className="text-[11px] text-[#7A6152] font-medium">Daily Fresh Batch</span>
                </div>
                <div>
                  <span className="font-serif text-2xl font-bold text-[#2C1810] block">4.9 ★</span>
                  <span className="text-[11px] text-[#7A6152] font-medium">Customer Rating</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[#F8D2D7]/50 via-[#EADBCC]/60 to-[#F1E6D8]/40 rounded-3xl filter blur-xl opacity-70"></div>
                
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
                    alt="Fresh Sweet Crumbs Bakery display"
                    className="w-full h-96 sm:h-[450px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-[#FCF9F2]/95 backdrop-blur-md p-4 rounded-2xl border border-[#EADBCC] shadow-md flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9F5F2B] block">
                        Today's Special
                      </span>
                      <span className="font-serif text-sm font-bold text-[#2C1810]">
                        Fresh Warm Croissants
                      </span>
                      <span className="text-xs text-[#7A6152] block">Pulled from oven 30m ago</span>
                    </div>
                    <span className="px-3 py-1 bg-[#2C1810] text-white rounded-full text-xs font-bold">
                      Rs. 220
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FULLSTACK API BRIDGE STATUS */}
      

      {/* 3. SHOP BY CATEGORY */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
            Handcrafted Selection
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
            Shop By Category
          </h2>
          <p className="text-sm text-[#6B5347]">
            Explore our artisanal categories made from wholesome recipes and pure ingredients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS */}
      <section id="featured" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
              Fresh From Our Ovens
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] mt-1">
              Featured Bakery Products
            </h2>
            <p className="text-sm text-[#6B5347] mt-1">
              Hand-picked treats our customers love the most.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchProducts}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7466] hover:text-[#2C1810] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${productsLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              to="/shop"
              className="text-xs font-bold text-[#9F5F2B] hover:text-[#834C1F] transition-colors"
            >
              View Full Menu →
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-[#EADBCC] animate-pulse space-y-4">
                <div className="aspect-4/3 bg-[#F1E6D8] rounded-xl"></div>
                <div className="h-4 bg-[#F1E6D8] rounded w-3/4"></div>
                <div className="h-3 bg-[#F1E6D8] rounded w-1/2"></div>
                <div className="h-8 bg-[#F1E6D8] rounded-xl mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY CHOOSE SWEET CRUMBS */}
      <section className="bg-[#FAF4EB] border-y border-[#EADBCC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
              Our Promise
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
              Why Choose Sweet Crumbs?
            </h2>
            <p className="text-sm text-[#6B5347]">
              We believe a bakery isn't just about food — it's about warmth, tradition, and pure joy in every bite.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyUsFeatures.map((feat, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl border border-[#EADBCC] shadow-xs text-center space-y-3 hover:translate-y-[-2px] transition-transform duration-200"
              >
                <div className="w-12 h-12 mx-auto rounded-full bg-[#F8D2D7]/70 flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="font-serif text-base font-bold text-[#2C1810]">
                  {feat.title}
                </h3>
                <p className="text-xs text-[#6B5347] leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ABOUT BAKERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-lg border border-[#EADBCC]">
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80"
                alt="Sweet Crumbs Baker preparing dough"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden sm:block bg-[#2C1810] text-[#FAF4EB] p-5 rounded-2xl shadow-xl max-w-xs border border-[#4A3328]">
              <p className="text-xs italic leading-relaxed">
                "We don't cut corners. If it's not made with patience and love, it doesn't leave our kitchen."
              </p>
              <span className="text-[11px] font-bold text-[#D4AF37] block mt-2">
                — Head Pastry Chef
              </span>
            </div>
          </div>

          <div className="space-y-5">
            <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
              Our Story
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] leading-snug">
              From a Passionate Kitchen to Your Celebration Table
            </h2>
            <p className="text-sm text-[#6B5347] leading-relaxed">
              Sweet Crumbs Bakery began with a simple belief: real baked goods should be made with genuine, time-honored ingredients. No artificial shelf-life extenders, no shortcuts.
            </p>
            <p className="text-sm text-[#6B5347] leading-relaxed">
              From our slow-fermented sourdoughs with crackling crusts to velvety celebration cakes decorated petal by petal, every recipe is tested, perfected, and crafted to bring warmth into your home.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#9F5F2B] hover:bg-[#834C1F] transition-colors shadow-xs"
              >
                <span>Read Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="bg-[#FAF4EB] py-16 border-t border-[#EADBCC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
              Customer Voices
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810]">
              Loved By Dessert Enthusiasts
            </h2>
            <p className="text-xs text-[#7A6152] italic">
              * Sample demo testimonials for college project demonstration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((review) => (
              <div
                key={review.id}
                className="bg-white p-6 rounded-2xl border border-[#EADBCC] shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-[#6B5347] leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#F1E6D8]">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#EADBCC]"
                  />
                  <div>
                    <h4 className="font-serif text-xs font-bold text-[#2C1810]">
                      {review.name}
                    </h4>
                    <span className="text-[10px] text-[#7A6152]">
                      {review.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2C1810] text-[#FAF4EB] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Join the Sweet Crumbs Club
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FCF9F2]">
              Get 10% Off Your First Order
            </h2>
            <p className="text-xs text-[#D8C3B0] leading-relaxed">
              Subscribe to receive weekly specials, secret weekend recipes, and first dibs on seasonal strawberry & chocolate cakes.
            </p>
          </div>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for subscribing to Sweet Crumbs Bakery!');
            }}
            className="relative max-w-md mx-auto flex flex-col sm:flex-row gap-2"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              className="flex-1 px-4 py-3 rounded-full text-xs bg-[#FAF4EB] text-[#2C1810] placeholder-[#7A6152] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#9F5F2B] hover:bg-[#834C1F] transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
