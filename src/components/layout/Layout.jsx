import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sliders, List, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { alertsBySource } from '../../data/mockData';
import { SeverityBadge, TypeBadge } from '../ui/Badges';
import AlertDrawer from '../alerts/AlertDrawer';

// ─── SIDEBAR ALERT CARD ───────────────────────────────────────────────────────
function SidebarAlertCard({ alert, onClick }) {
  return (
    <button
      onClick={() => onClick(alert)}
      className="w-full text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg p-2.5 mb-1.5 transition-all group"
    >
      <p className="text-[11px] font-semibold text-slate-800 group-hover:text-blue-700 leading-snug mb-1.5">{alert.title}</p>
      <p className="text-[10px] text-slate-500 leading-snug mb-2 line-clamp-2">{alert.desc}</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <SeverityBadge severity={alert.severity} size="xs" />
        <TypeBadge type={alert.type} size="xs" />
        <span className="ml-auto text-[9px] text-slate-400 font-medium">{alert.time}</span>
      </div>
    </button>
  );
}

// ─── COLLAPSIBLE SOURCE SECTION ───────────────────────────────────────────────
function SourceSection({ id, label, icon, dot, alerts, filter }) {
  const [open, setOpen] = useState(true);
  const [activeAlert, setActiveAlert] = useState(null);

  const filtered = alerts.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'Critical') return a.severity === 'Critical';
    return a.type === filter;
  });

  const critCount = alerts.filter(a => a.severity === 'Critical').length;

  return (
    <>
      <AlertDrawer alert={activeAlert} onClose={() => setActiveAlert(null)} />
      <div className="border-b border-slate-100 last:border-0">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 transition-colors"
        >
          <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', dot)} />
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider flex-1 text-left">{icon} {label}</span>
          {critCount > 0 && (
            <span className="text-[9px] font-bold bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">
              {critCount}
            </span>
          )}
          {open
            ? <ChevronDown size={13} className="text-slate-400 flex-shrink-0" />
            : <ChevronRight size={13} className="text-slate-400 flex-shrink-0" />
          }
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-2 pb-2">
                {filtered.length === 0 ? (
                  <p className="text-[10px] text-slate-400 text-center py-3">No alerts match filter</p>
                ) : (
                  filtered.map(a => (
                    <SidebarAlertCard key={a.id} alert={a} onClick={setActiveAlert} />
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── MAIN LAYOUT ──────────────────────────────────────────────────────────────
export default function Layout() {
  const location = useLocation();
  const [sidebarFilter, setSidebarFilter] = useState('all');

  const navItems = [
    { name: 'Dashboard',  path: '/',          icon: LayoutDashboard },
    { name: 'Simulator',  path: '/simulator', icon: Sliders },
    { name: 'All Alerts', path: '/alerts',    icon: List },
  ];

  const FILTERS = [
    { key: 'all',      label: 'All' },
    { key: 'AI',       label: '🧠 AI' },
    { key: 'Rules',    label: '📏 Rules' },
    { key: 'Critical', label: '🔴 Crit' },
  ];

  const SOURCES = [
    { id: 'unms',    label: 'UNMS / NOC',      icon: '📡', dot: 'bg-blue-500',   data: alertsBySource.unms },
    { id: 'samridh', label: 'Samridh Gram App', icon: '📱', dot: 'bg-emerald-500', data: alertsBySource.samridh },
    { id: 'issues',  label: 'Issue Management', icon: '🛠️', dot: 'bg-amber-500',  data: alertsBySource.issues },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* ── LEFT SIDEBAR ─────────────────────────────────────────────── */}
      <aside className="w-[268px] min-w-[268px] bg-white border-r border-slate-200 flex flex-col overflow-hidden">

        {/* Logo */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[10px] font-bold">BN</span>
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-900 leading-none">BharatNet ALERT</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">AI Early Risk Tracking</p>
            </div>
            <span className="ml-auto flex items-center gap-1">
              <span className="live-dot" />
              <span className="text-[9px] text-slate-400">Live</span>
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-2 py-2 border-b border-slate-100 flex gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  'flex-1 flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg text-[10px] font-medium transition-colors',
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
                )}
              >
                <item.icon size={14} />
                {item.name.split(' ')[0]}
              </Link>
            );
          })}
        </nav>

        {/* Filter tabs */}
        <div className="px-2 py-1.5 border-b border-slate-100 flex gap-1">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setSidebarFilter(f.key)}
              className={clsx(
                'flex-1 text-[9px] font-semibold py-1 rounded-md transition-colors',
                sidebarFilter === f.key
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-slate-500 hover:bg-slate-100',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Alert sources */}
        <div className="flex-1 overflow-y-auto">
          {SOURCES.map(s => (
            <SourceSection
              key={s.id}
              id={s.id}
              label={s.label}
              icon={s.icon}
              dot={s.dot}
              alerts={s.data}
              filter={sidebarFilter}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-[9px] text-slate-400">
            <span>15 alerts active</span>
            <span>Updated 2m ago</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <Outlet />
      </main>
    </div>
  );
}