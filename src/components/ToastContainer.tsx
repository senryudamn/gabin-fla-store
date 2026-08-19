import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl border text-xs font-semibold backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-white/95 text-emerald-900 border-emerald-300'
              : toast.type === 'warning'
              ? 'bg-white/95 text-amber-900 border-amber-300'
              : toast.type === 'error'
              ? 'bg-white/95 text-rose-900 border-rose-300'
              : 'bg-white/95 text-[#321F13] border-[#E8DCD1]'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === 'success' && (
              <CheckCircle className="h-4 w-4 text-emerald-600 flex-shrink-0" />
            )}
            {toast.type === 'warning' && (
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="h-4 w-4 text-[#E88C38] flex-shrink-0" />
            )}
            <span className="truncate">{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="p-1 rounded-lg hover:bg-black/5 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
