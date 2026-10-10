import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Eye } from 'lucide-react';

/**
 * Reusable Product Card Component
 * Displays bakery product details, availability, rating, and actions.
 */
export default function ProductCard({ product, onAddToCart }) {
  const {
    id,
    name,
    category,
    price,
    rating = 4.8,
    reviewsCount = 24,
    stock = 10,
    image,
    badge,
    description
  } = product;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#EADBCC] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col group">
      {/* Product Image Container */}
      <Link to={`/product/${id}`} className="relative aspect-4/3 overflow-hidden bg-[#FAF4EB] block">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {badge && (
            <span className="bg-[#2C1810]/85 backdrop-blur-xs text-[#FAF4EB] text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full uppercase">
              {badge}
            </span>
          )}
          <span className="bg-[#F8D2D7]/90 text-[#2C1810] text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {category}
          </span>
        </div>

        {/* Stock status indicator */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            stock > 0 
              ? 'bg-emerald-100/90 text-emerald-800' 
              : 'bg-rose-100/90 text-rose-800'
          }`}>
            {stock > 0 ? `${stock} left` : 'Out of Stock'}
          </span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-[#D4AF37]">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-semibold text-[#2C1810]">{rating}</span>
            <span className="text-[11px] text-[#7A6152]">({reviewsCount})</span>
          </div>

          {/* Title */}
          <Link to={`/product/${id}`}>
            <h3 className="font-serif text-lg font-bold text-[#2C1810] line-clamp-1 group-hover:text-[#9F5F2B] transition-colors">
              {name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs text-[#6B5347] line-clamp-2 mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Price & Action Buttons */}
        <div className="pt-4 mt-4 border-t border-[#F1E6D8] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-[#7A6152] block uppercase tracking-wider font-semibold">Price</span>
            <span className="text-lg font-bold text-[#2C1810]">
              Rs. {price.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/product/${id}`}
              className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-[#6B5347] hover:text-[#2C1810] hover:bg-[#F1E6D8] transition-colors"
              title="View Product Details"
              aria-label="View Details"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
            </Link>

            <button
              type="button"
              onClick={() => onAddToCart && onAddToCart(product)}
              disabled={stock <= 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 shadow-xs cursor-pointer ${
                stock > 0
                  ? 'bg-[#9F5F2B] hover:bg-[#834C1F] text-white active:scale-95'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
