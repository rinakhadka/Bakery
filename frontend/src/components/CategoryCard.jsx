import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

/**
 * Category Card Component
 * Highlights bakery product categories with warm imagery and links to Shop filtered by category.
 */
export default function CategoryCard({ category }) {
  const { name, shopCategory, count, description, image, badge } = category;
  const filterCategory = shopCategory || name;

  return (
    <Link 
      to={`/shop?category=${encodeURIComponent(filterCategory)}`}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-[#EADBCC] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
    >
      {/* Category Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-[#FAF4EB]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>
        
        {badge && (
          <span className="absolute top-3 left-3 bg-[#FCF9F2]/90 backdrop-blur-xs text-[#2C1810] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            {badge}
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <h3 className="font-serif text-xl font-bold tracking-tight drop-shadow-xs">
              {name}
            </h3>
            <span className="text-xs text-[#FAF4EB]/80 font-medium">
              {count} items
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#9F5F2B] group-hover:text-white transition-colors duration-300">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 bg-white">
        <p className="text-xs text-[#6B5347] line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
