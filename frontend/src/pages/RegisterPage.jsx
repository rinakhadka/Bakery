import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cake, Lock, Mail, User, Phone, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * RegisterPage Component
 * New customer registration form with input validation and instant profile creation.
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Kathmandu',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState(null);
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-check.');
      return;
    }

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/shop');
      } else {
        setError(res.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Registration error. Please try again.');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center mx-auto shadow-xs border border-[#ECA1A6]/50">
          <Cake className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2C1810]">
          Create Bakery Account
        </h1>
        <p className="text-xs text-[#6B5347]">
          Join Sweet Crumbs Bakery to track cake deliveries and receive sweet surprises.
        </p>
      </div>

      {/* Main Register Card */}
      <div className="bg-white border border-[#EADBCC] rounded-3xl p-7 sm:p-8 shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[#2C1810]">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Aayush Sharma"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
              />
              <User className="w-4 h-4 text-[#8C7466] absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="aayush@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
                />
                <Mail className="w-4 h-4 text-[#8C7466] absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Phone Number *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+977 9841234567"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
                />
                <Phone className="w-4 h-4 text-[#8C7466] absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Street Address</label>
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Jhamsikhel, Ward 3"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
                />
                <MapPin className="w-4 h-4 text-[#8C7466] absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">City</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B] cursor-pointer"
              >
                <option value="Kathmandu">Kathmandu</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Min. 6 chars"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
                />
                <Lock className="w-4 h-4 text-[#8C7466] absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Confirm Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
                />
                <Lock className="w-4 h-4 text-[#8C7466] absolute left-3 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold text-white bg-[#9F5F2B] hover:bg-[#834C1F] transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 mt-3"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center text-xs text-[#7A6152] pt-2 border-t border-[#F1E6D8]">
          <span>Already registered? </span>
          <Link to="/login" className="font-bold text-[#9F5F2B] hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}
