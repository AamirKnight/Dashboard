import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import clsx from 'clsx';
import { allAlerts } from '../../data/mockData';
import { SeverityBadge, TypeBadge, SourceBadge } from '../ui/Badges';

export default function Alerts() {
  const [search, setSearch]           = useState('');
  const [severityF, setSeverityF]     = useState('All');
  const [typeF, setTypeF]             = useState('All');
  const [activeAlert, setActiveAlert] = useState(null);

  const filtered = allAlerts.filter(a => {
    const q = search.toLowerCase();
    const matchSearch   = a.title.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q);
    const matchSeverity = severityF === 'All' || a.severity === severityF;
    const matchType     = typeF === 'All' || a.type === typeF;
    return matchSearch && matchSeverity && matchType;
  });

  const FilterBtn = ({ label, active, onClick }) => (
    <button
      onClick={onClick}
      className={clsx(
        'text-[10px] font-semibold px-3 py-1.5 rounded-lg border transition-colors',
        active
          ? 'bg-blue-50 border-blue-200 text-blue-700'
          : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50',
      )}
    >
      {label}
    </button>
  );

  return (
    <>
      <AlertDrawer alert={activeAlert} onClose={() => setActiveAlert(null)} />

      <div className="p-5 max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-4">
          <h1 className="text-sm font-bold text-slate-800">Alert Register</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
              27 Defined
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-[10px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200">
              {allAlerts.length} Active
            </span>
            <p className="text-[10px] text-slate-400 ml-2">
              All alerts sourced from BharatNet ALERT Concept Note — tracking network health, FTTH utilization, and infrastructure SLAs.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-4 flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search alerts…"
              className="w-full pl-8 pr-3 py-1.5 text-[11px] border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
            />
          </div>

          {/* Severity */}
          <div className="flex items-center gap-1.5">
            <Filter size={11} className="text-slate-400" />
            {['All', 'Critical', 'High', 'Medium'].map(s => (
              <FilterBtn key={s} label={s} active={severityF === s} onClick={() => setSeverityF(s)} />
            ))}
          </div>

          {/* Type */}
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
            {[['All', 'All Types'], ['AI', '🧠 AI'], ['Rules', '📏 Rules']].map(([v, l]) => (
              <FilterBtn key={v} label={l} active={typeF === v} onClick={() => setTypeF(v)} />
            ))}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 mb-3">Showing {filtered.length} of {allAlerts.length} alerts</p>

        {/* Alert rows */}
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-12 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-400"
              >
                No alerts match your filters.
              </motion.div>
            ) : filtered.map((alert, i) => (
              <motion.button
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.15, delay: i * 0.025 }}
                onClick={() => setActiveAlert(alert)}
                className="w-full text-left bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 rounded-xl px-4 py-3 transition-all group flex items-center gap-4"
              >
                {/* Severity indicator */}
                <div className={clsx(
                  'w-1 h-8 rounded-full flex-shrink-0',
                  alert.severity === 'Critical' ? 'bg-red-500' :
                  alert.severity === 'High' ? 'bg-orange-500' : 'bg-yellow-400',
                )} />

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug truncate">
                    {alert.title}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">{alert.desc}</p>
                </div>

                {/* Trigger condition */}
                <div className="hidden lg:block w-56 flex-shrink-0">
                  <p className="text-[9px] text-slate-400 uppercase tracking-wide mb-0.5">Trigger</p>
                  <p className="text-[10px] text-slate-600 font-medium leading-snug">{alert.trigger}</p>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <SeverityBadge severity={alert.severity} size="xs" />
                  <TypeBadge type={alert.type} size="xs" />
                  <SourceBadge source={alert.source} />
                </div>

                {/* Time */}
                <span className="text-[10px] text-slate-400 w-14 text-right flex-shrink-0">{alert.time}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}