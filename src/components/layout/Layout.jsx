import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sliders, List, ChevronDown, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { alertsBySource } from '../../data/mockData';
import { SeverityBadge, TypeBadge } from '../ui/Badges';
import AlertDrawer from '../alerts/AlertDrawer';

// ─── SIDEBAR MINI CARD ────────────────────────────────────────────────────────
function SidebarCard({ alert, onClick }) {
  const sevLine = {
    Critical: 'border-l-red-500',
    High:     'border-l-amber-500',
    Medium:   'border-l-violet-400',
  };
  return (
    <button
      onClick={() => onClick(alert)}
      className={clsx(
        'w-full text-left bg-white border border-[#E8ECF0] border-l-2 rounded-xl p-3 mb-2 transition-all hover:border-blue-300 hover:shadow-sm group',
        sevLine[alert.severity],
      )}
    >
      <p className="text-[11px] font-500 text-[#0F1623] group-hover:text-blue-700 leading-snug mb-1.5 line-clamp-2">{alert.title}</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <SeverityBadge severity={alert.severity} size="xs" />
        <TypeBadge type={alert.type} size="xs" />
        <span className="ml-auto text-[10px] text-[#9CA3AF]">{alert.time}</span>
      </div>
    </button>
  );
}

// ─── SOURCE SECTION ───────────────────────────────────────────────────────────
function SourceSection({ label, dot, alerts, filter }) {
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
      <div className="mb-1">
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F5F7FA] transition-colors group"
        >
          <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', dot)} />
          <span className="text-[10px] font-600 text-[#6B7280] uppercase tracking-widest flex-1 text-left">{label}</span>
          {critCount > 0 && (
            <span className="text-[9px] font-600 bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">
              {critCount}
            </span>
          )}
          {open
            ? <ChevronDown size={12} className="text-[#9CA3AF]" />
            : <ChevronRight size={12} className="text-[#9CA3AF]" />}
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-1 pt-1">
                {filtered.length === 0 ? (
                  <p className="text-[10px] text-[#9CA3AF] text-center py-3">No alerts match filter</p>
                ) : (
                  filtered.map(a => <SidebarCard key={a.id} alert={a} onClick={setActiveAlert} />)
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
export default function Layout() {
  const location = useLocation();
  const [sidebarFilter, setSidebarFilter] = useState('all');

  const navItems = [
    { name: 'Dashboard',  path: '/',          icon: LayoutDashboard },
    { name: 'Simulator',  path: '/simulator', icon: Sliders },
    { name: 'Alerts',     path: '/alerts',    icon: List },
  ];

  const FILTERS = [
    { key: 'all',      label: 'All' },
    { key: 'AI',       label: 'AI' },
    { key: 'Rules',    label: 'Rules' },
    { key: 'Critical', label: 'Critical' },
  ];

  const SOURCES = [
    { label: 'UNMS / NOC',       dot: 'bg-blue-500',   data: alertsBySource.unms },
    { label: 'Samridh Gram App', dot: 'bg-emerald-500', data: alertsBySource.samridh },
    { label: 'Issue Management', dot: 'bg-amber-500',   data: alertsBySource.issues },
  ];

  const totalActive = Object.values(alertsBySource).flat().length;
  const criticalCount = Object.values(alertsBySource).flat().filter(a => a.severity === 'Critical').length;

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F5F7FA' }}>

      {/* ── SIDEBAR ───────────────────────────────────────────────── */}
      <aside className="w-[272px] min-w-[272px] bg-white border-r border-[#E8ECF0] flex flex-col overflow-hidden">

        {/* Logo */}
        <div className="px-4 py-4 border-b border-[#E8ECF0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-[11px] font-700 tracking-tight">BN</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-600 text-[#0F1623] leading-none">BharatNet ALERT</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5">AI Early Risk Tracking</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="live-dot" />
              <span className="text-[10px] text-[#9CA3AF]">Live</span>
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-2 mt-3">
            <div className="flex-1 bg-[#F5F7FA] rounded-lg px-3 py-2 text-center">
              <p className="text-[16px] font-700 text-[#0F1623]">{totalActive}</p>
              <p className="text-[9px] text-[#9CA3AF] uppercase tracking-wide">Active</p>
            </div>
            <div className="flex-1 bg-red-50 rounded-lg px-3 py-2 text-center">
              <p className="text-[16px] font-700 text-red-600">{criticalCount}</p>
              <p className="text-[9px] text-red-400 uppercase tracking-wide">Critical</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-3 border-b border-[#E8ECF0] flex gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  'flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-500 transition-all',
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[#6B7280] hover:bg-[#F5F7FA] hover:text-[#374151]',
                )}
              >
                <item.icon size={15} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Filter chips */}
        <div className="px-3 py-2.5 border-b border-[#E8ECF0] flex gap-1 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setSidebarFilter(f.key)}
              className={clsx(
                'text-[10px] font-500 px-2.5 py-1 rounded-lg transition-all',
                sidebarFilter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#F5F7FA] text-[#6B7280] hover:bg-[#EEF2F7]',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Alert feed */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {SOURCES.map(s => (
            <SourceSection
              key={s.label}
              label={s.label}
              dot={s.dot}
              alerts={s.data}
              filter={sidebarFilter}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E8ECF0] flex items-center justify-between">
          <span className="text-[10px] text-[#9CA3AF]">{totalActive} alerts active</span>
          <span className="text-[10px] text-[#9CA3AF]">Updated 2m ago</span>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto" style={{ background: '#F5F7FA' }}>
        <Outlet />
      </main>
    </div>
  );
}