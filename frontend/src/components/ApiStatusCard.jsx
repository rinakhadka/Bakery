import React, { useState } from 'react';
import { Server, CheckCircle2, AlertTriangle, RefreshCw, Radio } from 'lucide-react';
import { testApiConnection } from '../services/api';

/**
 * ApiStatusCard Component
 * Specially created for Phase 1 verification and viva demonstration.
 * Visually confirms real-time communication between React (port 3000)
 * and Express (port 5000).
 */
export default function ApiStatusCard({ initialStatus, onStatusChange }) {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState(initialStatus || null);
  const [error, setError] = useState(null);

  const handleTestConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await testApiConnection();
      setStatusData(data);
      if (onStatusChange) onStatusChange(true);
    } catch (err) {
      console.error('API connection failed:', err);
      setError(
        err.response?.data?.message || 
        'Could not reach Express server at http://localhost:5000. Is the backend running?'
      );
      if (onStatusChange) onStatusChange(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF4EB] border border-[#EADBCC] rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EADBCC] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8D2D7] text-[#9F5F2B] flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-base text-[#2C1810] flex items-center gap-2">
              Full-Stack Bridge: React ↔ Express
              <span className="text-[10px] tracking-wider uppercase font-sans font-bold bg-[#E6D7C3] text-[#2C1810] px-2 py-0.5 rounded-full">
                Phase 1 Verified
              </span>
            </h4>
            <p className="text-xs text-[#7A6152]">
              Real-time API handshake between Frontend (<code className="text-[#9F5F2B]">localhost:3000</code>) and Backend (<code className="text-[#9F5F2B]">localhost:5000</code>).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-[#2C1810] hover:bg-[#4A3328] text-white transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'Pinging API...' : 'Test Connection'}</span>
        </button>
      </div>

      {/* Response Box */}
      {error ? (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-800">
            <span className="font-bold block mb-1">Backend Connection Offline</span>
            <p>{error}</p>
            <p className="mt-2 text-[11px] text-rose-700 bg-rose-100/60 p-2 rounded-md">
              💡 Tip: Open a new terminal, navigate to <code>backend</code>, and run <code>npm run dev</code>.
            </p>
          </div>
        </div>
      ) : statusData ? (
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-900 block">
                {statusData.message || 'Connected to Sweet Crumbs Bakery Backend!'}
              </span>
              <span className="text-emerald-700 text-[11px] block mt-0.5">
                Timestamp: {statusData.timestamp ? new Date(statusData.timestamp).toLocaleTimeString() : 'Just now'} • Node: {statusData.serverInfo?.nodeVersion || 'v20.x'} • Port: 5000
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 shrink-0 self-start sm:self-auto">
            <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
            HTTP 200 OK
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center gap-2.5 text-xs text-amber-900">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          <span>Waiting for initial API ping... Click "Test Connection" to trigger test.</span>
        </div>
      )}
    </div>
  );
}
