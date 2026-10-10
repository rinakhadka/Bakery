import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  RotateCcw,
  CheckCircle2,
  PackageOpen,
  Sparkles,
  Filter,
  AlertCircle
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { getAllProducts, getCategories } from '../services/api';
import { categoriesList } from '../data/products';

/**
 * ShopPage - Product Catalog
 *
 * Products are fetched from the Express backend API:
 *   GET /api/products?search=...&category=...&sort=...
 *
 * Filtering happens server-side (via query params) and client-side
 * for the price slider, so the UI stays fast and responsive.
 */
export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  // ── State ──────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter state synced with URL params (navbar search, category cards, etc.)
  const searchTerm = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const sortBy = searchParams.get('sort') || 'featured';
  const [maxPrice, setMaxPrice] = useState(2000);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [searchInput, setSearchInput] = useState(searchTerm);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  // ── Fetch products from backend ───────────────────────────
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (sortBy) params.sort = sortBy;

      const response = await getAllProducts(params);
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to load products. Please ensure the backend server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data || []);
    } catch (err) {
      // Fallback to static list if categories endpoint fails
      setCategories(categoriesList.map((name) => ({ name, count: 0 })));
    }
  };

  // ── Client-side price filter (keeps slider snappy) ────────
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const priceOk = p.price <= maxPrice;
      const stockOk = onlyInStock ? p.stock > 0 : true;
      return priceOk && stockOk;
    });
  }, [products, maxPrice, onlyInStock]);

  // ── Handlers ──────────────────────────────────────────────
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    const next = {};
    if (trimmed) next.search = trimmed;
    if (selectedCategory !== 'All') next.category = selectedCategory;
    if (sortBy !== 'featured') next.sort = sortBy;
    setSearchParams(next);
  };

  const handleCategorySelect = (cat) => {
    const next = {};
    if (searchTerm) next.search = searchTerm;
    if (cat !== 'All') next.category = cat;
    if (sortBy !== 'featured') next.sort = sortBy;
    setSearchParams(next);
  };

  const handleSortChange = (value) => {
    const next = {};
    if (searchTerm) next.search = searchTerm;
    if (selectedCategory !== 'All') next.category = selectedCategory;
    if (value !== 'featured') next.sort = value;
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearchInput('');
    setMaxPrice(2000);
    setOnlyInStock(false);
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    const res = addToCart(product, 1);
    setToastMessage(res.message);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const isFiltered = searchTerm || selectedCategory !== 'All' || maxPrice < 2000 || onlyInStock;

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2C1810] text-[#FAF4EB] px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── Shop Header ── */}
      <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-8 sm:p-10 text-center space-y-3 shadow-xs">
        <span className="text-xs font-bold tracking-widest text-[#9F5F2B] uppercase inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Sweet Crumbs Oven Fresh
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#2C1810]">
          Artisan Bakery Shop
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5347] max-w-xl mx-auto leading-relaxed">
          Browse our complete collection of fresh cakes, flaky croissants, sourdough breads, artisan cookies, cupcakes, and desserts baked daily.
        </p>
      </div>

      {/* ── Filter & Search Bar ── */}
      <div className="bg-white border border-[#EADBCC] rounded-2xl p-5 shadow-xs space-y-5">

        {/* Search + Sort row */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, ingredient..."
              className="w-full pl-10 pr-20 py-2.5 text-xs rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] placeholder-[#8C7466] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
            />
            <Search className="w-4 h-4 text-[#8C7466] absolute left-3 top-3 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 top-1.5 px-3 py-1 bg-[#9F5F2B] text-white text-[11px] font-bold rounded-lg cursor-pointer hover:bg-[#834C1F] transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs text-[#7A6152] font-medium hidden sm:inline shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="flex-1 md:flex-initial px-4 py-2 text-xs font-semibold rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B] cursor-pointer"
            >
              <option value="featured">Featured / Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1E6D8]">
          <span className="text-xs font-bold text-[#2C1810] mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#9F5F2B]" />
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedCategory.toLowerCase() === cat.name.toLowerCase()
                  ? 'bg-[#9F5F2B] text-white shadow-xs'
                  : 'bg-[#FAF4EB] text-[#4A3328] hover:bg-[#F1E6D8] border border-[#EADBCC]'
              }`}
            >
              {cat.name}
              {cat.name !== 'All' && cat.count > 0 && (
                <span className="ml-1 opacity-70">({cat.count})</span>
              )}
            </button>
          ))}
        </div>

        {/* Price slider + stock toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-[#F1E6D8] text-xs">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <span className="font-semibold text-[#2C1810] shrink-0">
              Max Price: <span className="text-[#9F5F2B] font-bold">Rs.&nbsp;{maxPrice.toLocaleString()}</span>
            </span>
            <input
              type="range"
              min="150"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full sm:w-44 accent-[#9F5F2B] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-[#4A3328]">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded accent-[#9F5F2B] cursor-pointer"
              />
              In Stock Only
            </label>

            {isFiltered && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7466] hover:text-[#2C1810] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-[#7A6152] px-1">
        <span>
          {loading ? 'Loading...' : (
            <>Showing <strong className="text-[#2C1810]">{filteredProducts.length}</strong> bakery treats</>
          )}
        </span>
        {isFiltered && !loading && (
          <span className="italic text-[#9F5F2B]">Filters applied</span>
        )}
      </div>

      {/* ── Loading State ── */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-[#EADBCC] animate-pulse space-y-4">
              <div className="aspect-4/3 bg-[#F1E6D8] rounded-xl"></div>
              <div className="h-3 bg-[#F1E6D8] rounded w-1/3"></div>
              <div className="h-4 bg-[#F1E6D8] rounded w-3/4"></div>
              <div className="h-3 bg-[#F1E6D8] rounded"></div>
              <div className="h-8 bg-[#F1E6D8] rounded-xl mt-2"></div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error State ── */}
      {!loading && error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm text-rose-800 font-medium">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-5 py-2 bg-rose-600 text-white text-xs font-semibold rounded-full hover:bg-rose-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Product Grid ── */}
      {!loading && !error && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* ── Empty State ── */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#2C1810]">
            No Bakery Treats Found
          </h3>
          <p className="text-xs text-[#6B5347] leading-relaxed">
            We couldn't find anything matching your search or filters. Try adjusting the price slider or resetting your filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#9F5F2B] hover:bg-[#834C1F] cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
