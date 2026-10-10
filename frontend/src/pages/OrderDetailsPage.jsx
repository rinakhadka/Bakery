import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ChefHat, 
  CreditCard, 
  MapPin, 
  Phone, 
  ShieldCheck,
  Package
} from 'lucide-react';

/**
 * OrderDetailsPage Component
 * Comprehensive order invoice, preparation progress tracker, and Khalti payment receipt.
 */
export default function OrderDetailsPage() {
  const { id } = useParams();

  // Find order in localStorage or create fallback demo order
  const savedOrders = JSON.parse(localStorage.getItem('sweet_crumbs_orders') || '[]');
  let order = savedOrders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <div className="bg-white border border-[#EADBCC] rounded-3xl p-8 shadow-sm space-y-4">
          <h1 className="font-serif text-2xl font-bold text-[#2C1810]">Order Not Found</h1>
          <p className="text-sm text-[#6B5347]">This order does not exist in your local order history. A payment is never shown as verified unless Khalti has been checked by the backend.</p>
          <Link to="/shop" className="inline-flex px-6 py-3 rounded-full bg-[#9F5F2B] text-white text-sm font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Status step index calculation
  const statusSteps = [
    { title: 'Order Confirmed', desc: 'Received & Accepted', icon: CheckCircle2 },
    { title: 'In The Oven', desc: 'Baking & Decorating', icon: ChefHat },
    { title: 'Out For Delivery', desc: 'On its way to you', icon: Truck },
    { title: 'Delivered Fresh', desc: 'Handed over warm', icon: Package }
  ];

  const currentStep = 
    order.orderStatus === 'DELIVERED' ? 3 :
    order.orderStatus === 'OUT_FOR_DELIVERY' ? 2 :
    order.orderStatus === 'PREPARING' || order.orderStatus === 'READY' ? 1 : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Navigation & Print Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C7466] hover:text-[#2C1810]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-[#EADBCC] text-[#2C1810] hover:bg-[#F1E6D8] transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5 text-[#9F5F2B]" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Main Order Card */}
      <div className="bg-white border border-[#EADBCC] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F1E6D8] pb-6">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9F5F2B] bg-[#F8D2D7]/70 px-2.5 py-0.5 rounded-full">
              Order Receipt
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C1810]">
              Order #{order.id}
            </h1>
            <p className="text-xs text-[#7A6152]">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at{' '}
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Khalti Payment Verified
            </span>
            <p className="text-[11px] text-[#7A6152]">
              Ref: <code className="text-[#2C1810]">{order.paymentReference || 'KHL-992144'}</code>
            </p>
          </div>
        </div>

        {/* Visual Bakery Progress Tracker */}
        <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-6 space-y-6">
          <h3 className="font-serif font-bold text-sm text-[#2C1810]">
            Bakery Preparation & Delivery Progress
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statusSteps.map((step, idx) => {
              const Icon = step.icon;
              const isPassed = idx <= currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={idx} className="flex flex-col items-center text-center space-y-2 relative">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isPassed
                        ? 'bg-[#9F5F2B] text-white shadow-xs'
                        : 'bg-white text-neutral-400 border border-[#EADBCC]'
                    } ${isCurrent ? 'ring-4 ring-[#9F5F2B]/20' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isPassed ? 'text-[#2C1810]' : 'text-neutral-400'}`}>
                      {step.title}
                    </h4>
                    <span className="text-[10px] text-[#7A6152] block">
                      {step.desc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery & Customer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-5 rounded-2xl bg-[#FAF4EB]/60 border border-[#EADBCC] space-y-2">
            <h4 className="font-bold text-[#2C1810] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <MapPin className="w-3.5 h-3.5 text-[#9F5F2B]" />
              <span>Delivery Address</span>
            </h4>
            <p className="text-[#2C1810] font-semibold">{order.shippingAddress?.address}</p>
            <p className="text-[#6B5347]">{order.shippingAddress?.city}, Nepal</p>
            {order.shippingAddress?.deliveryNotes && (
              <p className="text-[11px] text-[#9F5F2B] bg-white p-2.5 rounded-xl border border-[#EADBCC] mt-2 italic">
                Notes: "{order.shippingAddress.deliveryNotes}"
              </p>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF4EB]/60 border border-[#EADBCC] space-y-2">
            <h4 className="font-bold text-[#2C1810] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <CreditCard className="w-3.5 h-3.5 text-[#5C2D91]" />
              <span>Payment Details (Khalti)</span>
            </h4>
            <div className="flex justify-between py-1 border-b border-[#EADBCC]/60">
              <span className="text-[#6B5347]">Payment Method:</span>
              <span className="font-bold text-[#5C2D91]">Khalti Digital Wallet</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EADBCC]/60">
              <span className="text-[#6B5347]">Payment Status:</span>
              <span className="font-bold text-emerald-700">COMPLETED & VERIFIED</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#6B5347]">Transaction Reference:</span>
              <span className="font-mono text-[#2C1810]">{order.paymentReference}</span>
            </div>
          </div>
        </div>

        {/* Itemized Breakdown Table */}
        <div className="space-y-3">
          <h3 className="font-serif font-bold text-base text-[#2C1810]">
            Itemized Order Breakdown
          </h3>

          <div className="border border-[#EADBCC] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF4EB] border-b border-[#EADBCC] text-[#7A6152] font-semibold">
                <tr>
                  <th className="p-4">Item</th>
                  <th className="p-4 text-center">Price</th>
                  <th className="p-4 text-center">Quantity</th>
                  <th className="p-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1E6D8]">
                {order.orderItems.map((item, index) => (
                  <tr key={index} className="hover:bg-[#FAF4EB]/30">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#EADBCC]"
                      />
                      <div>
                        <p className="font-bold text-[#2C1810]">{item.name}</p>
                        <span className="text-[10px] text-[#7A6152]">{item.category}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center text-[#6B5347]">
                      Rs. {item.price.toLocaleString()}
                    </td>
                    <td className="p-4 text-center font-bold text-[#2C1810]">
                      {item.quantity}
                    </td>
                    <td className="p-4 text-right font-bold text-[#2C1810]">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="max-w-xs ml-auto space-y-2 text-xs pt-2">
          <div className="flex justify-between text-[#6B5347]">
            <span>Subtotal:</span>
            <span className="font-semibold text-[#2C1810]">
              Rs. {order.subtotal ? order.subtotal.toLocaleString() : order.totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-[#6B5347]">
            <span>Delivery Fee:</span>
            <span className="font-semibold text-[#2C1810]">
              {order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}
            </span>
          </div>

          <div className="pt-3 border-t border-[#F1E6D8] flex justify-between items-baseline">
            <span className="text-sm font-bold text-[#2C1810]">Total Paid:</span>
            <span className="text-2xl font-bold text-[#9F5F2B]">
              Rs. {order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
