import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Heart,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Truck,
  Loader2,
  PackageOpen
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { getProductById } from '../services/api';
// Fallback to local data if the backend is unreachable
import { bakeryProducts } from '../data/products';

/**
 * ProductDetailsPage
 *
 * Fetches a single product from the Express backend:
 *   GET /api/products/:id
 * Falls back to local data (src/data/products.js) if the backend is offline.
 */
export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);

  // ── Fetch product from backend ─────────────────────────────
  useEffect(() => {
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductById(id);
      setProduct(response.data);
      setRelatedProducts(response.related || []);
    } catch (err) {
      // Graceful fallback to local data when backend is unreachable
      const local = bakeryProducts.find(p => p.id === id || p.slug === id);
      if (local) {
        setProduct(local);
        const related = bakeryProducts
          .filter(p => p.category === local.category && p.id !== local.id)
          .slice(0, 4);
        setRelatedProducts(related);
      } else {
        setError('Product not found.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Quantity controls ──────────────────────────────────────
  const handleIncrease = () => {
    if (product && quantity < product.stock) {
      setQuantity(q => q + 1);
    }
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  // ── Cart actions ───────────────────────────────────────────
  const handleAddToCart = () => {
    const res = addToCart(product, quantity);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleRelatedAddToCart = (p) => {
    const res = addToCart(p, 1);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-[#6B5347]">
        <Loader2 className="w-8 h-8 animate-spin text-[#9F5F2B]" />
        <p className="text-sm font-medium">Loading bakery treat...</p>
      </div>
    );
  }

  // ── Error / Not found state ────────────────────────────────
  if (error || !product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#F8D2D7] flex items-center justify-center mx-auto">
          <PackageOpen className="w-8 h-8 text-[#9F5F2B]" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#2C1810]">
          Bakery Treat Not Found
        </h2>
        <p className="text-sm text-[#6B5347] max-w-sm mx-auto">
          {error || "This item might have been retired or is temporarily unavailable. Check our full shop for fresh arrivals."}
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#9F5F2B] hover:bg-[#834C1F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Bakery Shop</span>
        </Link>
      </div>
    );
  }

  // ── Main page ──────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1810] text-[#FAF4EB] px-5 py-3 rounded-2xl shadow-2xl border border-[#D8C3B0]/30 flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#8C7466]">
        <Link to="/" className="hover:text-[#2C1810] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#2C1810] transition-colors">Shop</Link>
        <span>/</span>
        <Link
          to={`/shop?category=${encodeURIComponent(product.category)}`}
          className="hover:text-[#2C1810] transition-colors"
        >
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-[#2C1810] font-semibold line-clamp-1">{product.name}</span>
      </div>

      {/* Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* ── Left Column: Image & Value badges ── */}
        <div className="lg:col-span-6 space-y-5">
          <div className="relative rounded-3xl overflow-hidden border-2 border-[#EADBCC] bg-[#FAF4EB] shadow-md aspect-4/3 sm:aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#2C1810]/85 backdrop-blur-xs text-[#FAF4EB] text-xs font-bold tracking-wider px-3 py-1 rounded-full uppercase">
                {product.badge}
              </span>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="bg-rose-600 text-white text-sm font-bold px-5 py-2 rounded-full rotate-[-8deg] shadow-md">
                  Sold Out Today
                </span>
              </div>
            )}
          </div>

          {/* Quality badges */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            {[
              { icon: Clock, label: 'Fresh Batch', sub: 'Baked Daily' },
              { icon: Truck, label: 'Careful Delivery', sub: 'Damage-proof box' },
              { icon: ShieldCheck, label: 'Pure Ingredients', sub: 'No artificial fats' }
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="p-3 rounded-2xl bg-[#FAF4EB] border border-[#EADBCC]">
                <Icon className="w-4 h-4 text-[#9F5F2B] mx-auto mb-1" />
                <span className="font-semibold text-[#2C1810] block">{label}</span>
                <span className="text-[10px] text-[#7A6152]">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: Info & Actions ── */}
        <div className="lg:col-span-6 space-y-6">
          {/* Category + Weight */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#F8D2D7] text-[#2C1810]">
              {product.category}
            </span>
            {product.weight && (
              <span className="text-xs text-[#7A6152]">• {product.weight}</span>
            )}
            {product.preparationTime && (
              <span className="text-xs text-[#7A6152]">• {product.preparationTime}</span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2C1810] leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-[#D4AF37]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'fill-current' : 'opacity-30'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-[#2C1810]">{product.rating}</span>
            <span className="text-xs text-[#7A6152]">({product.reviewsCount} reviews)</span>
          </div>

          {/* Price + Stock */}
          <div className="p-4 rounded-2xl bg-[#FAF4EB] border border-[#EADBCC] flex items-center justify-between">
            <div>
              <span className="text-xs text-[#7A6152] block font-medium">Price (NPR)</span>
              <span className="text-3xl font-bold text-[#2C1810]">
                Rs. {product.price.toLocaleString()}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-[#6B5347] leading-relaxed">
            {product.description}
          </p>

          {/* Ingredients */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#2C1810] tracking-wide uppercase">
                Handcrafted Ingredients:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs bg-white border border-[#EADBCC] text-[#4A3328] font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-[#F1E6D8]">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-[#2C1810] uppercase tracking-wide">Quantity:</span>
              <div className="flex items-center border border-[#EADBCC] rounded-full bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={handleDecrease}
                  disabled={quantity <= 1}
                  className="px-3.5 py-1.5 text-base font-bold text-[#2C1810] hover:text-[#9F5F2B] disabled:opacity-30 cursor-pointer"
                >
                  −
                </button>
                <span className="px-4 text-sm font-bold text-[#2C1810] min-w-[2ch] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  disabled={quantity >= product.stock}
                  className="px-3.5 py-1.5 text-base font-bold text-[#2C1810] hover:text-[#9F5F2B] disabled:opacity-30 cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-[#7A6152]">
                Subtotal: Rs. {(product.price * quantity).toLocaleString()}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-white bg-[#9F5F2B] hover:bg-[#834C1F] shadow-sm transition-all duration-200 cursor-pointer disabled:opacity-40"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {quantity} to Cart</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold text-[#2C1810] bg-[#F8D2D7] hover:bg-[#F3B4B9] border border-[#ECA1A6]/50 transition-all duration-200 cursor-pointer disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-10 border-t border-[#EADBCC] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase">
                More from {product.category}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2C1810] mt-0.5">
                You May Also Like
              </h2>
            </div>
            <Link
              to={`/shop?category=${encodeURIComponent(product.category)}`}
              className="text-xs font-semibold text-[#9F5F2B] hover:text-[#2C1810] transition-colors"
            >
              View all {product.category} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                onAddToCart={handleRelatedAddToCart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
