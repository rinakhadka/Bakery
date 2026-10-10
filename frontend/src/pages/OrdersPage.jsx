import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  Truck, 
  CreditCard,
  ChefHat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getOrdersByEmail } from '../services/api';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      // MongoDB is the source of truth when the user has an email.
      if (user?.email) {
        try {
          const result = await getOrdersByEmail(user.email);
          if (result?.success) {
            setOrders(result.data || []);
            return;
          }
        } catch (e) {
          console.warn('Could not load orders from MongoDB; using local history.', e);
        }
      }

      const saved = localStorage.getItem('sweet_crumbs_orders');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOrders(Array.isArray(parsed) ? parsed : []);
          return;
        } catch (e) {
          console.error(e);
        }
      }
      setOrders([]);
    };
    loadOrders();
  }, [user?.email]);

  const getStatusBadge = (status) => {
    const config = {
      PENDING: { bg: 'bg-amber-100 text-amber-800', label: 'Order Pending' },
      CONFIRMED: { bg: 'bg-sky-100 text-sky-800', label: 'Order Confirmed' },
      PREPARING: { bg: 'bg-indigo-100 text-indigo-800', label: 'In The Oven / Preparing' },
      READY: { bg: 'bg-blue-100 text-blue-800', label: 'Ready for Dispatch' },
      OUT_FOR_DELIVERY: { bg: 'bg-purple-100 text-purple-800', label: 'Out for Delivery' },
      DELIVERED: { bg: 'bg-emerald-100 text-emerald-800', label: 'Delivered Fresh' },
      CANCELLED: { bg: 'bg-rose-100 text-rose-800', label: 'Cancelled' }
    };
    const c = config[status] || config.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${c.bg}`}>
        {c.label}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-[#EADBCC] pb-4">
        <h1 className="font-serif text-3xl font-bold text-[#2C1810]">
          My Bakery Orders
        </h1>
        <p className="text-xs text-[#7A6152] mt-0.5">
          Track the preparation and delivery of your fresh bakery orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-3xl p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-[#9F5F2B] mx-auto" />
          <h2 className="font-serif text-2xl font-bold text-[#2C1810]">
            No Orders Placed Yet
          </h2>
          <p className="text-xs text-[#6B5347] max-w-sm mx-auto">
            Ready to taste something extraordinary? Explore our fresh daily bakes!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-semibold text-white bg-[#9F5F2B]"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#EADBCC] rounded-3xl p-6 shadow-xs space-y-5"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1E6D8] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF4EB] text-[#9F5F2B] flex items-center justify-center font-bold">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#2C1810]">
                      Order #{order.id}
                    </h3>
                    <span className="text-[11px] text-[#7A6152] block">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {getStatusBadge(order.orderStatus)}
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#5C2D91]/10 text-[#5C2D91] border border-[#5C2D91]/20">
                    Khalti {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Items Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF4EB]/60 border border-[#EADBCC]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-white shrink-0 border border-[#EADBCC]"
                    />
                    <div className="truncate text-xs">
                      <p className="font-bold text-[#2C1810] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#7A6152]">Qty: {item.quantity}</p>
                      <p className="text-[11px] font-semibold text-[#9F5F2B]">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#F1E6D8] text-xs">
                <div>
                  <span className="text-[#7A6152]">Delivering to: </span>
                  <strong className="text-[#2C1810]">{order.shippingAddress?.address}, {order.shippingAddress?.city}</strong>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-[#7A6152] mr-2">Total Amount:</span>
                    <span className="font-bold text-base text-[#2C1810]">
                      Rs. {order.totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/order/${order.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#9F5F2B] hover:bg-[#834C1F] transition-colors"
                  >
                    <span>View Receipt</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
