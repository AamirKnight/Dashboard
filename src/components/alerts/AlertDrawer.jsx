import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Database, Zap, Tag, BarChart2 } from 'lucide-react';
import { SeverityBadge, TypeBadge, SourceBadge } from '../ui/Badges';

const SEV_ACCENT = {
  Critical: { bar: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200' },
  High:     { bar: 'bg-amber-500',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  Medium:   { bar: 'bg-violet-400', bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
};

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#F0F3F7] last:border-0">
      <div className="w-7 h-7 rounded-lg bg-[#F5F7FA] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={13} className="text-[#6B7280]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-[13px] text-[#0F1623] leading-snug">{value}</p>
      </div>
    </div>
  );
}

export default function AlertDrawer({ alert, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const accent = SEV_ACCENT[alert?.severity] ?? SEV_ACCENT.Medium;

  return (
    <AnimatePresence>
      {alert && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Top accent bar */}
            <div className={`h-1 w-full ${accent.bar} flex-shrink-0`} />

            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E8ECF0] flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <SeverityBadge severity={alert.severity} />
                  <TypeBadge type={alert.type} />
                </div>
                <h2 className="text-[15px] font-600 text-[#0F1623] leading-tight">{alert.title}</h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:bg-[#F5F7FA] hover:text-[#374151] transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* Description */}
              <div className={`${accent.bg} border ${accent.border} rounded-xl p-4 mb-5`}>
                <p className={`text-[12px] font-medium ${accent.text} mb-1`}>Alert Description</p>
                <p className="text-[13px] text-[#374151] leading-relaxed">{alert.desc}</p>
              </div>

              {/* Trigger condition */}
              <div className="mb-5">
                <p className="text-[10px] font-medium text-[#9CA3AF] uppercase tracking-wider mb-2">Trigger Condition</p>
                <div className="bg-[#F8FAFC] border border-[#E8ECF0] rounded-xl px-4 py-3 font-mono text-[12px] text-[#0F1623]">
                  {alert.trigger}
                </div>
              </div>

              {/* Detail rows */}
              <div>
                <DetailRow icon={Tag}      label="Risk Dimension" value={alert.dim} />
                <DetailRow icon={BarChart2} label="Data Field"     value={alert.dataField} />
                <DetailRow icon={Database} label="Data Source"     value={alert.dataSource} />
                <DetailRow icon={Clock}    label="Last Triggered"  value={alert.time} />
              </div>

              {/* AI tag */}
              {alert.type === 'AI' && (
                <div className="mt-5 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={13} className="text-indigo-600" />
                    <p className="text-[11px] font-600 text-indigo-700">AI-Detected Pattern</p>
                  </div>
                  <p className="text-[12px] text-indigo-600 leading-relaxed">
                    This alert was identified through ML pattern recognition across multiple data sources and time-series analysis by the BharatNet AI Risk Engine.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[#E8ECF0] flex items-center gap-3">
              <SourceBadge source={alert.source} />
              <span className="text-[11px] text-[#9CA3AF] ml-auto">Updated {alert.time}</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}