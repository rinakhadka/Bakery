import React from 'react';
import { Cake, Clock, Phone, MapPin, Mail, Heart } from 'lucide-react';

/**
 * Footer Component for Sweet Crumbs Bakery
 * Contains contact information, opening hours, quick links, and branding.
 */
export default function Footer() {
  return (
    <footer className="bg-[#2C1810] text-[#FAF4EB] border-t border-[#4A3328] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#4A3328]">
          {/* Brand & Story */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F8D2D7] flex items-center justify-center text-[#2C1810]">
                <Cake className="w-5 h-5 text-[#9F5F2B]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FCF9F2]">
                Sweet Crumbs
              </span>
            </div>
            <p className="text-xs text-[#D8C3B0] leading-relaxed">
              Handcrafting moments of sweetness with pure French butter, unbleached flour, and wholesome organic ingredients baked fresh every sunrise.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href="#social-instagram" 
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-[#4A3328] hover:bg-[#9F5F2B] transition-colors flex items-center justify-center text-[#FAF4EB]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="#social-facebook" 
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-[#4A3328] hover:bg-[#9F5F2B] transition-colors flex items-center justify-center text-[#FAF4EB]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.75 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a 
                href="#social-twitter" 
                aria-label="Twitter / X"
                className="w-8 h-8 rounded-full bg-[#4A3328] hover:bg-[#9F5F2B] transition-colors flex items-center justify-center text-[#FAF4EB]"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FCF9F2] tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#D8C3B0]">
              <li>
                <a href="#home" className="hover:text-[#F8D2D7] transition-colors">Home</a>
              </li>
              <li>
                <a href="#categories" className="hover:text-[#F8D2D7] transition-colors">Categories</a>
              </li>
              <li>
                <a href="#featured" className="hover:text-[#F8D2D7] transition-colors">Featured Treats</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-[#F8D2D7] transition-colors">Why Choose Us</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#F8D2D7] transition-colors">Our Story</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FCF9F2] tracking-wide flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              Bake House Hours
            </h4>
            <ul className="space-y-2 text-xs text-[#D8C3B0]">
              <li className="flex justify-between">
                <span>Monday – Friday:</span>
                <span className="font-medium text-[#FAF4EB]">7:00 AM – 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-medium text-[#FAF4EB]">8:00 AM – 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-medium text-[#FAF4EB]">8:00 AM – 6:00 PM</span>
              </li>
              <li className="pt-2 text-[11px] text-[#D4AF37] italic">
                * Fresh batches pulled from oven at 7:30 AM & 3:00 PM daily.
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#FCF9F2] tracking-wide">
              Bakery Location
            </h4>
            <ul className="space-y-2.5 text-xs text-[#D8C3B0]">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>Bakery Lane, Kathmandu / Lalitpur, Nepal</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>+977 01-555-BAKE (2253)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>hello@sweetcrumbsbakery.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E8272]">
          <p>© {new Date().getFullYear()} Sweet Crumbs Bakery. College Project Demo.</p>
          <div className="flex items-center gap-1">
            <span>Baked with</span>
            <Heart className="w-3.5 h-3.5 text-[#DE7C88] fill-current inline" />
            <span>using React, Express, MongoDB & Khalti</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
