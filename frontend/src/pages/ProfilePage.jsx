import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Calendar, 
  CheckCircle2, 
  Edit3, 
  Save, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * ProfilePage Component
 * Displays customer account information, saved delivery addresses, and order summary.
 */
export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || 'Kathmandu'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Get orders count from localStorage
  const existingOrders = JSON.parse(localStorage.getItem('sweet_crumbs_orders') || '[]');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-[#EADBCC] pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#2C1810]">
            My Bakery Profile
          </h1>
          <p className="text-xs text-[#7A6152] mt-0.5">
            Manage your personal details, default delivery address, and account preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#EADBCC] text-[#2C1810] hover:bg-[#F1E6D8] transition-colors cursor-pointer"
        >
          <Edit3 className="w-3.5 h-3.5 text-[#9F5F2B]" />
          <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Your profile details have been saved successfully!</span>
        </div>
      )}

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-[#EADBCC] rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center font-bold text-lg">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#2C1810] truncate max-w-[150px]">
              {user?.name || 'Customer'}
            </h3>
            <span className="text-[11px] text-[#7A6152] capitalize">
              {user?.role || 'Customer'} Account
            </span>
          </div>
        </div>

        <div className="bg-white border border-[#EADBCC] rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FAF4EB] text-[#9F5F2B] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-serif font-bold text-[#2C1810] block">
              {existingOrders.length}
            </span>
            <Link to="/orders" className="text-[11px] text-[#9F5F2B] font-semibold hover:underline">
              Orders Placed →
            </Link>
          </div>
        </div>

        <div className="bg-white border border-[#EADBCC] rounded-2xl p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-900 block">
              Verified Member
            </span>
            <span className="text-[11px] text-[#7A6152]">Sweet Crumbs Club</span>
          </div>
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white border border-[#EADBCC] rounded-3xl p-7 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Full Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-600 cursor-not-allowed"
              />
              <span className="text-[10px] text-[#7A6152]">Email cannot be changed directly</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Contact Phone</label>
              <input
                type="tel"
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-[#2C1810]">City</label>
              <select
                disabled={!isEditing}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
              >
                <option value="Kathmandu">Kathmandu</option>
                <option value="Lalitpur">Lalitpur</option>
                <option value="Bhaktapur">Bhaktapur</option>
              </select>
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="font-semibold text-[#2C1810]">Default Delivery Address</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. Jhamsikhel, Ward 3, Lalitpur"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] disabled:opacity-75 focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
              />
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-[#F1E6D8] flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-[#9F5F2B] hover:bg-[#834C1F] shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
