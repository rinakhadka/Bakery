import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { verifyKhaltiPayment, getOrderById } from '../services/api';

export default function KhaltiCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [state, setState] = useState({ status: 'checking', message: 'Verifying your Khalti payment...' });

  useEffect(() => {
    let cancelled = false;

    const verify = async () => {
      const pidx = searchParams.get('pidx');
      const pendingRaw = sessionStorage.getItem('sweet_crumbs_pending_khalti');

      if (!pidx || !pendingRaw) {
        if (!cancelled) setState({ status: 'failed', message: 'Payment information was not found. Your cart has not been cleared.' });
        return;
      }

      try {
        const pending = JSON.parse(pendingRaw);
        const result = await verifyKhaltiPayment(pidx);

        if (!result.verified) {
          if (!cancelled) setState({
            status: 'failed',
            message: `Khalti returned payment status: ${result.status || 'Not completed'}. Your order was not marked as paid.`
          });
          return;
        }

        let verifiedOrder = {
          ...pending.order,
          paymentStatus: 'PAID',
          orderStatus: 'CONFIRMED',
          paymentReference: result.transactionId || pidx,
          khaltiPidx: pidx,
          khaltiStatus: result.status,
          verifiedAmount: result.totalAmount,
          paidAt: new Date().toISOString()
        };

        // Prefer the order saved by the backend/MongoDB after payment verification.
        try {
          const saved = await getOrderById(pending.order.id);
          if (saved?.success && saved.data) verifiedOrder = { ...verifiedOrder, ...saved.data, id: saved.data.id || pending.order.id };
        } catch (dbError) {
          console.warn('Could not load saved MongoDB order; using checkout data.', dbError);
        }

        const existingOrders = JSON.parse(localStorage.getItem('sweet_crumbs_orders') || '[]');
        localStorage.setItem('sweet_crumbs_orders', JSON.stringify([verifiedOrder, ...existingOrders]));
        sessionStorage.removeItem('sweet_crumbs_pending_khalti');
        clearCart();

        if (!cancelled) {
          setState({ status: 'success', message: 'Payment verified successfully. Redirecting to your order...' });
          setTimeout(() => navigate(`/order/${verifiedOrder.id}`, { replace: true }), 900);
        }
      } catch (error) {
        console.error('Khalti verification error:', error);
        if (!cancelled) {
          setState({
            status: 'failed',
            message: error.response?.data?.message || 'We could not verify the payment. Your cart has not been cleared.'
          });
        }
      }
    };

    verify();
    return () => { cancelled = true; };
  }, [searchParams, navigate]);

  const success = state.status === 'success';
  const failed = state.status === 'failed';

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="bg-white border border-[#EADBCC] rounded-3xl p-8 shadow-sm space-y-5">
        {state.status === 'checking' && <Loader2 className="w-12 h-12 mx-auto text-[#5C2D91] animate-spin" />}
        {success && <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-600" />}
        {failed && <XCircle className="w-14 h-14 mx-auto text-rose-600" />}

        <h1 className="font-serif text-2xl font-bold text-[#2C1810]">
          {success ? 'Payment Successful' : failed ? 'Payment Not Completed' : 'Checking Payment'}
        </h1>
        <p className="text-sm text-[#6B5347]">{state.message}</p>

        {failed && (
          <Link to="/checkout" className="inline-flex px-6 py-3 rounded-full bg-[#5C2D91] text-white text-sm font-semibold">
            Return to Checkout
          </Link>
        )}
      </div>
    </div>
  );
}
