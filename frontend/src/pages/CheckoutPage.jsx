import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles,
  Lock,
  Truck
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { initiateKhaltiPayment } from '../services/api';

/**
 * CheckoutPage Component
 * Collects Customer Information, Delivery Address, and initiates Khalti Payment.
 */
export default function CheckoutPage() {
  const { cartItems, subtotal, deliveryFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State initialized with logged-in user data if available
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Kathmandu',
    area: '',
    deliveryNotes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('khalti');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  // If cart is empty, redirect back to cart
  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
          Your cart is currently empty
        </h2>
        <p className="text-xs text-[#6B5347]">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#9F5F2B]"
        >
          <span>Go to Bakery Shop</span>
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'A valid email address is required';
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      newErrors.phone = 'A valid phone number is required for delivery';
    }
    if (!formData.address.trim()) newErrors.address = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.area.trim()) newErrors.area = 'Area / Landmark is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 100, behavior: 'smooth' });
      return;
    }

    setIsProcessing(true);
    setErrors({});

    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity
        })),
        customer: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          area: formData.area,
          deliveryNotes: formData.deliveryNotes
        }
      };

      const result = await initiateKhaltiPayment(payload);

      // Keep the order only temporarily until Khalti sends the customer back
      // and the backend verifies the pidx. We never mark it PAID here.
      sessionStorage.setItem('sweet_crumbs_pending_khalti', JSON.stringify({
        pidx: result.pidx,
        order: result.order
      }));

      window.location.href = result.paymentUrl;
    } catch (err) {
      console.error('Khalti checkout error:', err);
      const message = err.response?.data?.message ||
        'Unable to start Khalti payment. Please check that the backend is running and the Khalti test key is configured.';
      setErrors({ payment: message });
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb */}
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C7466] hover:text-[#2C1810]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Shopping Cart</span>
        </Link>
      </div>

      <div className="border-b border-[#EADBCC] pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#2C1810]">
          Checkout & Delivery
        </h1>
        <p className="text-xs text-[#7A6152] mt-0.5">
          Enter your delivery details and complete secure payment with Khalti.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Form: Customer & Delivery Info */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Customer Information */}
          <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#2C1810] flex items-center gap-2 border-b border-[#F1E6D8] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#F8D2D7] text-[#9F5F2B] text-xs flex items-center justify-center font-bold">1</span>
              <span>Customer Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#2C1810]">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="e.g. Aayush Sharma"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border ${
                    errors.fullName ? 'border-rose-400' : 'border-[#EADBCC]'
                  } text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-600">{errors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2C1810]">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. aayush@example.com"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border ${
                    errors.email ? 'border-rose-400' : 'border-[#EADBCC]'
                  } text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]`}
                />
                {errors.email && <p className="text-[11px] text-rose-600">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2C1810]">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +977 9841234567"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border ${
                    errors.phone ? 'border-rose-400' : 'border-[#EADBCC]'
                  } text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]`}
                />
                {errors.phone && <p className="text-[11px] text-rose-600">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* 2. Delivery Information */}
          <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#2C1810] flex items-center gap-2 border-b border-[#F1E6D8] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#F8D2D7] text-[#9F5F2B] text-xs flex items-center justify-center font-bold">2</span>
              <span>Delivery Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#2C1810]">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B] cursor-pointer"
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#2C1810]">Area / Neighborhood *</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="e.g. Jhamsikhel, Baneshwor, Pulchowk"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border ${
                    errors.area ? 'border-rose-400' : 'border-[#EADBCC]'
                  } text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]`}
                />
                {errors.area && <p className="text-[11px] text-rose-600">{errors.area}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#2C1810]">Street Address & House / Apt No *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="e.g. House #14, Lane 3, near Central Park"
                  className={`w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border ${
                    errors.address ? 'border-rose-400' : 'border-[#EADBCC]'
                  } text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]`}
                />
                {errors.address && <p className="text-[11px] text-rose-600">{errors.address}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-[#2C1810]">Optional Delivery Notes / Cake Inscription</label>
                <textarea
                  name="deliveryNotes"
                  rows="2"
                  value={formData.deliveryNotes}
                  onChange={handleInputChange}
                  placeholder="e.g. Please pipe 'Happy Birthday Maya!' in chocolate, call upon arrival."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
                ></textarea>
              </div>
            </div>
          </div>

          {/* 3. Payment Method: Official Khalti */}
          <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#2C1810] flex items-center gap-2 border-b border-[#F1E6D8] pb-3">
              <span className="w-6 h-6 rounded-full bg-[#F8D2D7] text-[#9F5F2B] text-xs flex items-center justify-center font-bold">3</span>
              <span>Payment Method</span>
            </h2>

            {/* Khalti Payment Box */}
            <div className="p-5 rounded-2xl bg-[#5C2D91]/5 border-2 border-[#5C2D91] relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Official Khalti Purple Logo Badge */}
                <div className="w-12 h-12 rounded-xl bg-[#5C2D91] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
                  K
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#5C2D91] text-sm">
                      Khalti Digital Wallet
                    </span>
                    <span className="text-[10px] font-bold bg-[#5C2D91] text-white px-2 py-0.5 rounded-full uppercase">
                      Official Partner
                    </span>
                  </div>
                  <p className="text-xs text-[#5C2D91]/80 mt-0.5">
                    Pay securely with Khalti Wallet, e-Banking, Mobile Banking & SCT Cards.
                  </p>
                </div>
              </div>

              <div className="w-5 h-5 rounded-full border-2 border-[#5C2D91] flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5C2D91]"></div>
              </div>
            </div>

            <p className="text-[11px] text-[#7A6152] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Payments are encrypted and verified directly via Khalti's official API backend.</span>
            </p>
          </div>
        </div>

        {/* Right Sidebar: Order Summary & Place Order */}
        <div className="lg:col-span-5 bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-sm space-y-6 sticky top-28">
          <h2 className="font-serif text-xl font-bold text-[#2C1810] border-b border-[#F1E6D8] pb-3">
            Order Review ({cartItems.length} items)
          </h2>

          {/* Items Preview */}
          <div className="max-h-60 overflow-y-auto space-y-3 pr-1 text-xs">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-1.5 border-b border-[#F1E6D8]/60">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover bg-[#FAF4EB] shrink-0 border border-[#EADBCC]"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-[#2C1810] truncate">{item.name}</p>
                    <p className="text-[11px] text-[#7A6152]">Qty: {item.quantity} × Rs. {item.price}</p>
                  </div>
                </div>
                <span className="font-bold text-[#2C1810] shrink-0">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2.5 text-xs pt-2 border-t border-[#F1E6D8]">
            <div className="flex justify-between text-[#6B5347]">
              <span>Subtotal:</span>
              <span className="font-semibold text-[#2C1810]">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between text-[#6B5347]">
              <span>Delivery Fee ({formData.city}):</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  <span className="font-semibold text-[#2C1810]">Rs. {deliveryFee}</span>
                )}
              </span>
            </div>

            <div className="pt-3 border-t border-[#F1E6D8] flex justify-between items-baseline">
              <span className="text-base font-bold text-[#2C1810]">Total Payable:</span>
              <span className="text-2xl font-bold text-[#9F5F2B]">
                Rs. {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {errors.payment && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errors.payment}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full text-xs font-bold text-white bg-[#5C2D91] hover:bg-[#492275] shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            <span>
              {isProcessing
                ? 'Initiating Khalti Payment...'
                : `Pay Rs. ${totalAmount.toLocaleString()} via Khalti`}
            </span>
          </button>

          <p className="text-[11px] text-[#7A6152] text-center">
            By placing your order, you agree to Sweet Crumbs Bakery terms of service and fresh delivery policy.
          </p>
        </div>
      </form>
    </div>
  );
}
