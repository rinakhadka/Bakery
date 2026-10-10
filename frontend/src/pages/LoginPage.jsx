import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cake, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/**
 * LoginPage Component
 * User login page with demo auto-fill shortcuts for effortless college evaluation.
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { login, loading, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to requested page after login or default to /
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Something went wrong during sign in. Please try again.');
    }
  };

  const handleQuickCustomer = () => {
    loginAsDemo();
    navigate(from, { replace: true });
  };

  const handleQuickAdmin = async () => {
    await login('admin@sweetcrumbs.com', 'admin123');
    navigate(from, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center mx-auto shadow-xs border border-[#ECA1A6]/50">
          <Cake className="w-7 h-7" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#2C1810]">
          Welcome Back
        </h1>
        <p className="text-xs text-[#6B5347]">
          Sign in to your Sweet Crumbs Bakery account to view orders and manage profile.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white border border-[#EADBCC] rounded-3xl p-7 shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-[#2C1810]">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@sweetcrumbs.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
              />
              <Mail className="w-4 h-4 text-[#8C7466] absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="font-semibold text-[#2C1810]">Password</label>
              <a href="#forgot" className="text-[11px] text-[#9F5F2B] hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] text-[#2C1810] focus:outline-none focus:ring-2 focus:ring-[#9F5F2B]"
              />
              <Lock className="w-4 h-4 text-[#8C7466] absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-xs font-bold text-white bg-[#2C1810] hover:bg-[#4A3328] transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Shortcuts (College Viva Feature) */}
        <div className="pt-4 border-t border-[#F1E6D8] space-y-2.5">
          <span className="text-[11px] font-bold text-[#7A6152] uppercase tracking-wider block text-center">
            College Viva Demo Shortcuts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="p-2.5 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] hover:bg-[#F1E6D8] transition-colors text-[11px] font-semibold text-[#2C1810] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#9F5F2B]" />
              <span>Demo Customer</span>
            </button>
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="p-2.5 rounded-xl bg-[#FAF4EB] border border-[#EADBCC] hover:bg-[#F1E6D8] transition-colors text-[11px] font-semibold text-[#2C1810] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#9F5F2B]" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        {/* Register Link */}
        <div className="text-center text-xs text-[#7A6152] pt-2">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="font-bold text-[#9F5F2B] hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
