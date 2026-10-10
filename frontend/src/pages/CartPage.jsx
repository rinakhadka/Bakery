import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';

/**
 * CartPage Component
 * Full-featured bakery shopping cart with item list, quantity controls,
 * delivery progress bar, cost breakdown, and empty-state layout.
 */
export default function CartPage() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    subtotal, 
    deliveryFee, 
    totalAmount,
    freeDeliveryThreshold 
  } = useCart();

  const navigate = useNavigate();
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const deliveryProgressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[#FAF4EB] border-2 border-[#EADBCC] flex items-center justify-center mx-auto text-[#9F5F2B]">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold text-[#2C1810]">
            Your Bakery Basket is Empty
          </h1>
          <p className="text-sm text-[#6B5347] max-w-md mx-auto">
            You haven't added any delicious cakes, warm pastries, or artisan sourdough to your cart yet.
          </p>
        </div>
        <div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-bold text-white bg-[#9F5F2B] hover:bg-[#834C1F] shadow-sm transition-all"
          >
            <span>Explore Fresh Bakery Items</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#EADBCC] pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C1810]">
            Your Bakery Cart
          </h1>
          <p className="text-xs text-[#7A6152] mt-0.5">
            Review your selected treats before proceeding to checkout.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-rose-700 hover:text-rose-900 font-semibold cursor-pointer"
        >
          Clear Basket
        </button>
      </div>

      {/* Free Delivery Incentive Bar */}
      <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-[#2C1810]">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#9F5F2B]" />
            {amountNeededForFreeDelivery === 0 ? (
              <span className="text-emerald-700">🎉 You have unlocked FREE delivery!</span>
            ) : (
              <span>Add <strong className="text-[#9F5F2B]">Rs. {amountNeededForFreeDelivery.toLocaleString()}</strong> more to get FREE delivery!</span>
            )}
          </span>
          <span className="text-[11px] text-[#7A6152]">Goal: Rs. {freeDeliveryThreshold}</span>
        </div>
        <div className="w-full bg-[#EADBCC] h-2 rounded-full overflow-hidden">
          <div 
            className="bg-[#9F5F2B] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${deliveryProgressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-[#EADBCC] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover bg-[#FAF4EB] shrink-0 border border-[#EADBCC]"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9F5F2B] bg-[#F8D2D7]/60 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-serif text-base font-bold text-[#2C1810] hover:text-[#9F5F2B] transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-[#7A6152]">
                    Rs. {item.price.toLocaleString()} each
                  </p>
                </div>
              </div>

              {/* Quantity Controls & Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[#F1E6D8]">
                {/* Quantity Buttons */}
                <div className="flex items-center border border-[#EADBCC] rounded-full bg-[#FAF4EB]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 text-xs text-[#2C1810] hover:text-[#9F5F2B] cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#2C1810]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-1.5 text-xs text-[#2C1810] hover:text-[#9F5F2B] disabled:opacity-30 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal for Item */}
                <div className="text-right min-w-[90px]">
                  <span className="text-[10px] text-[#7A6152] block sm:hidden">Total</span>
                  <span className="text-sm font-bold text-[#2C1810]">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Remove Item"
                  aria-label="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping Link */}
          <div className="pt-2">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C7466] hover:text-[#2C1810] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-xs space-y-6 sticky top-28">
          <h2 className="font-serif text-xl font-bold text-[#2C1810] border-b border-[#F1E6D8] pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#6B5347]">
              <span>Items Subtotal:</span>
              <span className="font-semibold text-[#2C1810]">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-[#6B5347]">
              <span>Estimated Delivery Fee:</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  <span className="font-semibold text-[#2C1810]">Rs. {deliveryFee}</span>
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#F1E6D8] flex justify-between items-baseline">
              <span className="text-sm font-bold text-[#2C1810]">Total Amount:</span>
              <span className="text-2xl font-bold text-[#9F5F2B]">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold text-white bg-[#9F5F2B] hover:bg-[#834C1F] shadow-sm transition-all duration-200 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 border-t border-[#F1E6D8] text-[11px] text-[#7A6152] space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Khalti Payment Gateway Supported</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>Baked fresh in small batches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
