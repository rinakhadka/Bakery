import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Cake, 
  Sparkles, 
  User, 
  LogOut, 
  Package, 
  ChevronDown 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/**
 * Modern Bakery Navbar with React Router integration,
 * Live Cart Counter, User Profile Dropdown, and API Status Badge.
 */
export default function Navbar({ apiConnected }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-[#9F5F2B] ${
      isActive ? 'text-[#9F5F2B] font-semibold border-b-2 border-[#9F5F2B] pb-1' : 'text-[#4A3328]'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#FCF9F2]/95 backdrop-blur-md border-b border-[#EADBCC] shadow-xs">
      {/* Top Bakery Announcement */}
      <div className="bg-[#2C1810] text-[#FAF4EB] text-xs py-1.5 px-4 text-center tracking-wide font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Freshly baked every morning! Free delivery on orders over Rs. 1,000</span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-11 h-11 rounded-full bg-[#F8D2D7] flex items-center justify-center text-[#2C1810] group-hover:scale-105 transition-transform duration-200 shadow-xs border border-[#ECA1A6]/40">
            <Cake className="w-6 h-6 text-[#9F5F2B]" />
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-[#2C1810] block leading-none">
              Sweet Crumbs
            </span>
            <span className="text-[11px] font-medium tracking-widest text-[#9F5F2B] uppercase">
              Artisan Bakery
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-7">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={navLinkClass}>
            Shop All
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            Our Story
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cakes, pastries, breads..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-full bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] placeholder-[#8C7466] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
          />
          <Search className="w-4 h-4 text-[#8C7466] absolute left-3 pointer-events-none" />
        </form>

        {/* Right Actions: API Badge, Cart, Profile */}
        <div className="flex items-center gap-3 shrink-0">
   

          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full hover:bg-[#F1E6D8] text-[#2C1810] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#9F5F2B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth State */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 pr-2 rounded-full bg-[#FAF4EB] border border-[#EADBCC] hover:bg-[#F1E6D8] transition-colors text-xs font-semibold text-[#2C1810] cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#9F5F2B] text-white flex items-center justify-center font-bold text-[11px]">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <span className="max-w-[90px] truncate">{user?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8C7466]" />
              </button>

              {userDropdownOpen && (
                <div 
                  onClick={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#EADBCC] py-2 z-50 text-xs animate-fadeIn"
                >
                  <div className="px-4 py-2 border-b border-[#F1E6D8]">
                    <p className="font-bold text-[#2C1810] truncate">{user?.name}</p>
                    <p className="text-[10px] text-[#8C7466] truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-[#4A3328] hover:bg-[#FAF4EB] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#9F5F2B]" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-2.5 px-4 py-2 text-[#4A3328] hover:bg-[#FAF4EB] transition-colors"
                  >
                    <Package className="w-3.5 h-3.5 text-[#9F5F2B]" />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-700 hover:bg-rose-50 transition-colors text-left border-t border-[#F1E6D8] mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2 text-xs font-semibold tracking-wide text-white bg-[#2C1810] hover:bg-[#4A3328] rounded-full transition-all duration-200 shadow-xs"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-[#2C1810] hover:bg-[#F1E6D8]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF4EB] border-b border-[#EADBCC] px-4 pt-3 pb-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bakery treats..."
              className="w-full pl-9 pr-4 py-2.5 text-xs rounded-full bg-white border border-[#EADBCC] text-[#2C1810]"
            />
            <Search className="w-4 h-4 text-[#8C7466] absolute left-3 top-3 pointer-events-none" />
          </form>

          <div className="flex flex-col space-y-2 text-sm font-medium text-[#2C1810]">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F1E6D8]"
            >
              Home
            </Link>
            <Link 
              to="/shop" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F1E6D8]"
            >
              Shop All Products
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F1E6D8]"
            >
              Our Story & Philosophy
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-3 rounded-lg hover:bg-[#F1E6D8]"
            >
              Contact Us & Hours
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg hover:bg-[#F1E6D8]"
                >
                  My Profile
                </Link>
                <Link 
                  to="/orders" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg hover:bg-[#F1E6D8]"
                >
                  My Orders
                </Link>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-[#EADBCC]">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 rounded-full text-center"
              >
                Sign Out ({user?.name})
              </button>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-center text-[#2C1810] border border-[#2C1810] rounded-full"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2.5 text-xs font-semibold text-center text-white bg-[#9F5F2B] rounded-full"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
