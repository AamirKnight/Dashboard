import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function AlertDrawer({ alert, onClose }) {
  return (
    <AnimatePresence>
      {alert && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[500px] h-full bg-white dark:bg-brand-900 shadow-2xl border-l border-slate-200 dark:border-slate-700 z-50 p-6 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">{alert.title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="text-xs font-bold text-orange-800 uppercase mb-2">Trigger Condition</h3>
                <p className="text-sm text-orange-900">{alert.triggerCondition}</p>
              </div>

              {alert.type === 'AI' && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h3 className="text-xs font-bold text-purple-800 uppercase mb-2">🧠 How the AI decides</h3>
                  <p className="text-sm text-purple-900">
                    The AI trend engine monitors compliance values across a rolling 6-week window. If the slope is negative for 3 consecutive weeks, it flags an early warning before a breach occurs.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Data Field</h3>
                  <p className="text-sm font-medium">{alert.dataField}</p>
                </div>
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Source</h3>
                  <p className="text-sm font-medium">{alert.dataSource}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}