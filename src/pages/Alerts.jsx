import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertTriangle, Brain, Filter, Search } from 'lucide-react';
import clsx from 'clsx';
import { alertsBySource } from '../data/mockData';
import AlertDrawer from '../components/alerts/AlertDrawer';
import { SeverityBadge, TypeBadge } from '../components/ui/Badges';

const ALL_ALERTS = Object.entries({
  'UNMS / NOC': 'unms',
  'Samridh Gram App': 'samridh',
  'Issue Management': 'issues',
}).flatMap(([source, key]) =>
  (alertsBySource[key] || []).map(a => ({ ...a, source }))
);

const SEV_ORDER = { Critical: 0, High: 1, Medium: 2 };

export default function Alerts() {
  const location   = useLocation();
  const navigate   = useNavigate();
  const [active, setActive]   = useState(null);
  const [filter, setFilter]   = useState('all');
  const [search, setSearch]   = useState('');

  // Auto-open alert if navigated with state
  useEffect(() => {
    const id = location.state?.alertId;
    if (id) {
      const found = ALL_ALERTS.find(a => a.id === id);
      if (found) setActive(found);
    }
  }, [location.state]);

  const filtered = ALL_ALERTS
    .filter(a => {
      const matchFilter =
        filter === 'all' ||
        (filter === 'Critical' && a.severity === 'Critical') ||
        a.type === filter;
      const matchSearch =
        !search || a.title.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity]);

  const counts = {
    all:      ALL_ALERTS.length,
    Critical: ALL_ALERTS.filter(a => a.severity === 'Critical').length,
    AI:       ALL_ALERTS.filter(a => a.type === 'AI').length,
    Rules:    ALL_ALERTS.filter(a => a.type === 'Rules').length,
  };

  const TABS = [
    { key: 'all',      label: 'All Alerts', count: counts.all },
    { key: 'Critical', label: 'Critical',   count: counts.Critical },
    { key: 'AI',       label: 'AI Alerts',  count: counts.AI },
    { key: 'Rules',    label: 'Rules',      count: counts.Rules },
  ];

  const sevBorder = {
    Critical: 'border-l-red-500',
    High:     'border-l-amber-400',
    Medium:   'border-l-blue-400',
  };

  return (
    <>
      <AlertDrawer
        alert={active}
        onClose={() => setActive(null)}
        onAskAI={(alert) => navigate('/ai-query',  { state: { alertId: alert.id }  })}
      />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="mb-6">
        <h2 className="text-[24px] font-bold text-[#0F1623] leading-none">Alert Feed</h2>
        <p className="text-[14px] text-[#9CA3AF] mt-1">
          Real-time risk alerts from all integrated sources
        </p>
      </div>

      {/* ── SUMMARY CARDS ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Alerts',   value: ALL_ALERTS.length,          color: 'bg-blue-50   text-blue-700' },
          { label: 'Critical',       value: counts.Critical,            color: 'bg-red-50    text-red-600' },
          { label: 'High Severity',  value: ALL_ALERTS.filter(a => a.severity === 'High').length, color: 'bg-amber-50  text-amber-600' },
          { label: 'AI-Generated',   value: counts.AI,                  color: 'bg-violet-50 text-violet-600' },
        ].map(c => (
          <div key={c.label} className={clsx('rounded-xl p-4 flex flex-col gap-1', c.color)}>
            <span className="text-[12px] font-semibold uppercase tracking-wide opacity-70">{c.label}</span>
            <span className="text-[30px] font-bold leading-none">{c.value}</span>
          </div>
        ))}
      </div>

      {/* ── FILTER TABS + SEARCH ──────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-[#E4E8EE] shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4E8EE] gap-4 flex-wrap">
          <div className="flex gap-1 flex-wrap">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={clsx(
                  'flex items-center gap-1.5 text-[12.5px] font-semibold px-3.5 py-2 rounded-lg transition-all',
                  filter === t.key
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-[#6B7280] hover:bg-[#F5F7FA]',
                )}
              >
                {t.label}
                <span className={clsx(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                  filter === t.key ? 'bg-blue-500 text-white' : 'bg-[#F0F0F0] text-[#6B7280]',
                )}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search alerts…"
              className="pl-8 pr-4 py-2 text-[13px] border border-[#E4E8EE] rounded-lg bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-blue-200 w-56 placeholder-[#C0C8D4]"
            />
          </div>
        </div>

        {/* ── ALERT LIST ─────────────────────────────────────── */}
        <div className="divide-y divide-[#F0F4F8]">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-[#9CA3AF]">
              <AlertTriangle size={28} className="mx-auto mb-3 opacity-30" />
              <p className="text-[14px]">No alerts match your filter</p>
            </div>
          ) : (
            filtered.map(alert => (
              <div
                key={alert.id}
                className={clsx(
                  'flex items-start gap-4 px-5 py-4 cursor-pointer border-l-4 hover:bg-[#FAFBFC] transition-colors',
                  sevBorder[alert.severity],
                )}
                onClick={() => setActive(alert)}
              >
                {/* Icon */}
                <div className={clsx(
                  'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                  alert.severity === 'Critical' ? 'bg-red-100' :
                  alert.severity === 'High'     ? 'bg-amber-100' : 'bg-blue-100',
                )}>
                  <AlertTriangle size={16} className={
                    alert.severity === 'Critical' ? 'text-red-500' :
                    alert.severity === 'High'     ? 'text-amber-500' : 'text-blue-500'
                  } />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#0F1623] leading-snug mb-1.5">
                    {alert.title}
                  </p>
                  <p className="text-[12.5px] text-[#6B7280] mb-2 line-clamp-1">
                    {alert.desc}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={alert.severity} size="xs" />
                    <TypeBadge type={alert.type} size="xs" />
                    <span className="text-[11px] text-[#9CA3AF]">{alert.source}</span>
                    <span className="ml-auto text-[11px] text-[#9CA3AF]">{alert.time}</span>
                  </div>
                </div>

                {/* Ask AI button */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    navigate('/ai-query',  { state: { alertId: alert.id } });
                  }}
                  className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-[12px] font-semibold text-violet-700 hover:bg-violet-100 transition-all"
                >
                  <Brain size={13} />
                  Ask AI
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}