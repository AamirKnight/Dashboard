import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Sliders, List, ChevronDown, ChevronRight, Cpu, Bell, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { Toaster } from 'react-hot-toast';
import { alertsBySource } from '../../data/mockData';
import { SeverityBadge, TypeBadge } from '../ui/Badges';
import AlertDrawer from '../alerts/AlertDrawer';
import { triggerBatchAlerts, triggerAlertToast } from '../alerts/alertToast';

// ─── SIDEBAR MINI CARD ────────────────────────────────────────────────────────
function SidebarCard({ alert, onClick }) {
  const sevLine = {
    Critical: 'border-l-red-500',
    High:     'border-l-amber-400',
    Medium:   'border-l-blue-400',
  };
  return (
    <button
      onClick={() => onClick(alert)}
      className={clsx(
        'w-full text-left bg-[#FAFBFC] border border-[#E4E8EE] border-l-[3px] rounded-lg p-3 mb-2 transition-all hover:bg-white hover:shadow-md hover:border-blue-200 group',
        sevLine[alert.severity],
      )}
    >
      <p className="text-[12.5px] font-semibold text-[#111827] group-hover:text-blue-700 leading-snug mb-2 line-clamp-2">
        {alert.title}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <SeverityBadge severity={alert.severity} size="xs" />
        <TypeBadge type={alert.type} size="xs" />
        <span className="ml-auto text-[11px] text-[#9CA3AF]">{alert.time}</span>
      </div>
    </button>
  );
}

// ─── SOURCE SECTION ───────────────────────────────────────────────────────────
function SourceSection({ label, dot, alerts, filter, onAlertClick }) {
  const [open, setOpen] = useState(true);

  const filtered = alerts.filter(a => {
    if (filter === 'all') return true;
    if (filter === 'Critical') return a.severity === 'Critical';
    return a.type === filter;
  });

  const critCount = alerts.filter(a => a.severity === 'Critical').length;

  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#F0F4F8] transition-colors group"
      >
        <span className={clsx('w-2 h-2 rounded-full flex-shrink-0', dot)} />
        <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest flex-1 text-left">
          {label}
        </span>
        {critCount > 0 && (
          <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">
            {critCount}
          </span>
        )}
        {open
          ? <ChevronDown size={13} className="text-[#9CA3AF]" />
          : <ChevronRight size={13} className="text-[#9CA3AF]" />}
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
                <p className="text-[11px] text-[#9CA3AF] text-center py-3">No alerts match filter</p>
              ) : (
                filtered.map(a => (
                  <SidebarCard key={a.id} alert={a} onClick={onAlertClick} />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarFilter, setSidebarFilter] = useState('all');
  const [activeAlert, setActiveAlert] = useState(null);

  const allAlerts = Object.values(alertsBySource).flat();
  const totalActive = allAlerts.length;
  const criticalCount = allAlerts.filter(a => a.severity === 'Critical').length;

  // ── TOAST TRIGGER ON LOAD ────────────────────────────────────────────────
  useEffect(() => {
    const criticals = allAlerts.filter(a => a.severity === 'Critical').slice(0, 3);
    if (criticals.length) {
      triggerBatchAlerts(criticals, navigate);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navItems = [
    { name: 'Dashboard',   path: '/',             icon: LayoutDashboard },
    { name: 'Simulator',   path: '/simulator',    icon: Sliders },
    { name: 'Alerts',      path: '/alerts',       icon: List },
    { name: 'Equipment',   path: '/equipment',    icon: Cpu },
  ];

  const FILTERS = [
    { key: 'all',      label: 'All' },
    { key: 'AI',       label: 'AI' },
    { key: 'Rules',    label: 'Rules' },
    { key: 'Critical', label: 'Critical' },
  ];

  const SOURCES = [
    { label: 'UNMS / NOC',       dot: 'bg-blue-500',    data: alertsBySource.unms },
    { label: 'Samridh Gram App', dot: 'bg-emerald-500', data: alertsBySource.samridh },
    { label: 'Issue Management', dot: 'bg-amber-400',   data: alertsBySource.issues },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F2F5F9]">

      {/* ── REACT-HOT-TOAST PORTAL ─────────────────────────────────── */}
      <Toaster
        position="top-right"
        containerStyle={{ top: 20, right: 20 }}
        toastOptions={{ duration: 5000 }}
      />

      {/* ── ALERT DRAWER (global, shared) ─────────────────────────── */}
      <AlertDrawer alert={activeAlert} onClose={() => setActiveAlert(null)} />

      {/* ── SIDEBAR ───────────────────────────────────────────────── */}
      <aside className="w-[280px] min-w-[280px] bg-white border-r border-[#E4E8EE] flex flex-col overflow-hidden shadow-sm">

        {/* Logo strip */}
        <div className="px-5 py-4 border-b border-[#E4E8EE]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-[12px] font-bold tracking-tight">BN</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-[#0F1623] leading-none tracking-tight">
                BharatNet ALERT
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">AI Early Risk Tracking</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[11px] text-[#9CA3AF]">Live</span>
            </div>
          </div>

          {/* KPI pills */}
          <div className="flex gap-2 mt-3">
            <div className="flex-1 bg-[#F5F7FA] rounded-xl px-3 py-2.5 text-center">
              <p className="text-[20px] font-bold text-[#0F1623] leading-none">{totalActive}</p>
              <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wide mt-1">Active</p>
            </div>
            <div className="flex-1 bg-red-50 rounded-xl px-3 py-2.5 text-center">
              <p className="text-[20px] font-bold text-red-600 leading-none">{criticalCount}</p>
              <p className="text-[10px] text-red-400 uppercase tracking-wide mt-1">Critical</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-3 border-b border-[#E4E8EE] flex gap-1">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={clsx(
                  'flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[10.5px] font-semibold transition-all',
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
        <div className="px-3 py-2.5 border-b border-[#E4E8EE] flex gap-1.5 flex-wrap">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setSidebarFilter(f.key)}
              className={clsx(
                'text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all',
                sidebarFilter === f.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#F5F7FA] text-[#6B7280] hover:bg-[#EEF2F7] hover:text-[#374151]',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Alert feed */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {SOURCES.map(s => (
            <SourceSection
              key={s.label}
              label={s.label}
              dot={s.dot}
              alerts={s.data}
              filter={sidebarFilter}
              onAlertClick={setActiveAlert}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-[#E4E8EE] flex items-center justify-between bg-[#FAFBFC]">
          <span className="text-[11px] text-[#9CA3AF]">{totalActive} alerts active</span>
          <span className="text-[11px] text-[#9CA3AF]">Updated 2m ago</span>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto bg-[#F2F5F9]">

        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E4E8EE] px-8 py-3.5 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-[17px] font-bold text-[#0F1623] leading-none">
              {navItems.find(n => n.path === location.pathname)?.name ?? 'Dashboard'}
            </h1>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">BharatNet Network Operations Centre</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Global alert badge */}
            <button
              onClick={() => navigate('/alerts')}
              className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200 hover:bg-red-100 transition-all"
            >
              <Bell size={14} className="text-red-500" />
              <span className="text-[12px] font-bold text-red-600">Alerts Active</span>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {criticalCount}
              </span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[12px] font-bold text-blue-700">
              AD
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}