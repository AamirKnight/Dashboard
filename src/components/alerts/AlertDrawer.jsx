
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Brain, ExternalLink, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const SEV_COLORS = {
  Critical: {
    bg:     'bg-red-50',
    border: 'border-red-200',
    badge:  'bg-red-600 text-white',
    icon:   'text-red-500',
    iconBg: 'bg-red-100',
  },
  High: {
    bg:     'bg-amber-50',
    border: 'border-amber-200',
    badge:  'bg-amber-500 text-white',
    icon:   'text-amber-500',
    iconBg: 'bg-amber-100',
  },
  Medium: {
    bg:     'bg-blue-50',
    border: 'border-blue-200',
    badge:  'bg-blue-500 text-white',
    icon:   'text-blue-500',
    iconBg: 'bg-blue-100',
  },
};

export default function AlertDrawer({ alert, onClose, onAskAI }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const c = alert ? (SEV_COLORS[alert.severity] ?? SEV_COLORS.Medium) : null;

  return (
    <AnimatePresence>
      {alert && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden border-l border-[#E4E8EE]"
          >
            {/* Header */}
            <div className={clsx('px-6 py-5 border-b border-[#E4E8EE] flex items-start gap-3', c.bg)}>
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', c.iconBg)}>
                <AlertTriangle size={18} className={c.icon} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide', c.badge)}>
                    {alert.severity}
                  </span>
                  <span className="text-[11px] text-[#9CA3AF]">{alert.type}</span>
                </div>
                <p className="text-[15px] font-bold text-[#0F1623] leading-snug">{alert.title}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-white/60 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X size={16} className="text-[#6B7280]" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Description */}
              <section>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Description</p>
                <p className="text-[14px] text-[#374151] leading-relaxed">
                  {alert.desc ?? 'No description provided.'}
                </p>
              </section>

              {/* Metadata grid */}
              <section>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">Details</p>
                <div className="bg-[#F9FAFB] rounded-xl border border-[#E4E8EE] divide-y divide-[#F0F4F8]">
                  {[
                    { label: 'Alert ID',  value: alert.id },
                    { label: 'Time',      value: alert.time },
                    { label: 'Source',    value: alert.source ?? 'System' },
                    { label: 'Type',      value: alert.type },
                  ].map(row => (
                    <div key={row.label} className="flex items-center px-4 py-3">
                      <span className="text-[12px] text-[#9CA3AF] w-28 flex-shrink-0">{row.label}</span>
                      <span className="text-[13px] font-semibold text-[#111827]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recommended action */}
              <section>
                <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-2">
                  Recommended Action
                </p>
                <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-3">
                  <p className="text-[13px] text-violet-700 leading-relaxed">
                    {alert.action ?? 'Review the affected nodes and check connectivity. Escalate if unresolved within 30 minutes.'}
                  </p>
                </div>
              </section>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-4 border-t border-[#E4E8EE] flex gap-3 bg-[#FAFBFC]">
              <button
                onClick={() => { onAskAI?.(alert); onClose?.(); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-bold transition-all shadow-sm"
              >
                <Brain size={15} />
                Ask AI
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E4E8EE] text-[13px] font-semibold text-[#6B7280] hover:bg-[#F5F7FA] transition-all"
              >
                <X size={14} />
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}