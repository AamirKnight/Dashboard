import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, TrendingDown, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import clsx from 'clsx';
import { summaryStats, allAlerts, recentAlerts } from '../data/mockData';
import { SeverityBadge, TypeBadge, SourceBadge, SeverityBar } from '../components/ui/Badges';
import AlertDrawer from '../components/alerts/AlertDrawer';

const ICONS = { AlertTriangle, Activity, TrendingDown, TrendingUp };

// ─── METRIC CARD ──────────────────────────────────────────────────────────────
function MetricCard({ stat, index }) {
  const Icon = ICONS[stat.icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl border border-[#E8ECF0] p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
        >
          <Icon size={17} style={{ color: stat.color }} />
        </div>
        <span className="text-[10px] font-500 text-[#9CA3AF] bg-[#F5F7FA] px-2 py-1 rounded-md">
          {stat.sub}
        </span>
      </div>
      <p className="text-[32px] font-700 leading-none mb-1" style={{ color: stat.color }}>
        {stat.value}
      </p>
      <p className="text-[12px] font-500 text-[#4B5563]">{stat.title}</p>
    </motion.div>
  );
}

// ─── RISK BAR ─────────────────────────────────────────────────────────────────
function RiskBar({ label, dotColor, total, critical }) {
  const pct = Math.round((critical / total) * 100);
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span className={clsx('w-2 h-2 rounded-full', dotColor)} />
          <span className="text-[12px] font-500 text-[#374151]">{label}</span>
        </div>
        <span className="text-[11px] text-[#9CA3AF]">
          {total} total · <span className="text-red-600 font-600">{critical} critical</span>
        </span>
      </div>
      <div className="h-1.5 bg-[#F0F3F7] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={clsx('h-full rounded-full', dotColor)}
        />
      </div>
    </div>
  );
}

// ─── ALERT ROW ────────────────────────────────────────────────────────────────
function AlertRow({ alert, onClick, index }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      onClick={() => onClick(alert)}
      className="w-full text-left flex items-center gap-3 px-5 py-3.5 hover:bg-[#F8FAFC] transition-colors border-b border-[#F0F3F7] last:border-0 group"
    >
      <SeverityBar severity={alert.severity} />
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-500 text-[#0F1623] group-hover:text-blue-700 transition-colors truncate">{alert.title}</p>
        <p className="text-[11px] text-[#9CA3AF] truncate mt-0.5">{alert.desc}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <SeverityBadge severity={alert.severity} size="xs" />
        <TypeBadge type={alert.type} size="xs" />
        <span className="text-[10px] text-[#9CA3AF] w-12 text-right">{alert.time}</span>
        <ArrowRight size={12} className="text-[#D1D5DB] group-hover:text-blue-500 transition-colors" />
      </div>
    </motion.button>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeAlert, setActiveAlert] = useState(null);
  const critical = allAlerts.filter(a => a.severity === 'Critical');
  const high     = allAlerts.filter(a => a.severity === 'High');

  return (
    <>
      <AlertDrawer alert={activeAlert} onClose={() => setActiveAlert(null)} />

      <div className="px-6 py-6 max-w-[1400px] mx-auto">

        {/* ── AI SUMMARY BANNER ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-blue-600 rounded-2xl p-5 mb-6 relative overflow-hidden"
        >
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Zap size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-[14px] font-600 text-white">AI Analysis Summary</h2>
                <span className="text-[10px] font-500 bg-red-500/25 text-red-200 border border-red-400/30 px-2.5 py-1 rounded-full">
                  ⚠ {critical.length} Critical Alerts
                </span>
              </div>
              <p className="text-[12px] text-blue-100 leading-relaxed max-w-3xl">
                BharatNet ALERT identified{' '}
                <strong className="text-white font-600">{critical.length} critical</strong> and{' '}
                <strong className="text-white font-600">{high.length} high-priority</strong> alerts
                requiring immediate attention — primarily network infrastructure issues in Eastern regions.
                Service disruptions predicted within <strong className="text-white font-600">48 hours</strong>{' '}
                based on pattern recognition across 5 data sources.
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {['Network SLA Degradation', 'Infrastructure Gaps', 'FTTH Underperformance', 'Issue Aging Risk'].map(tag => (
                  <span key={tag} className="text-[10px] text-blue-200 bg-white/10 border border-white/15 px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── METRICS ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {summaryStats.map((stat, i) => (
            <MetricCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>

        {/* ── MAIN GRID ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-4">

          {/* Critical / High Alerts list */}
          <div className="col-span-2 bg-white rounded-2xl border border-[#E8ECF0] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F3F7]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-500" />
                <h3 className="text-[13px] font-600 text-[#0F1623]">Critical & High Alerts</h3>
              </div>
              <span className="text-[11px] text-[#9CA3AF] bg-[#F5F7FA] px-2.5 py-1 rounded-lg">
                {critical.length + high.length} active
              </span>
            </div>
            <div>
              {[...critical, ...high].slice(0, 7).map((alert, i) => (
                <AlertRow key={alert.id} alert={alert} onClick={setActiveAlert} index={i} />
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-4">
            {/* Risk by source */}
            <div className="bg-white rounded-2xl border border-[#E8ECF0] p-5">
              <h3 className="text-[13px] font-600 text-[#0F1623] mb-4">Risk by Source</h3>
              <RiskBar label="UNMS / NOC"       dotColor="bg-blue-500"    total={4} critical={2} />
              <RiskBar label="Samridh Gram App" dotColor="bg-emerald-500" total={4} critical={1} />
              <RiskBar label="Issue Management" dotColor="bg-amber-500"   total={7} critical={2} />
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-2xl border border-[#E8ECF0] p-5 flex-1">
              <h3 className="text-[13px] font-600 text-[#0F1623] mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentAlerts.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setActiveAlert(a)}
                    className="w-full text-left group"
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-500 text-[#0F1623] group-hover:text-blue-700 transition-colors leading-snug">{a.title}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <SourceBadge source={a.source} />
                          <span className="text-[10px] text-[#9CA3AF] ml-auto">{a.time}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FULL ALERTS TABLE ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#E8ECF0] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F3F7]">
            <h3 className="text-[13px] font-600 text-[#0F1623]">All Active Alerts</h3>
            <span className="text-[11px] text-[#9CA3AF] bg-[#F5F7FA] px-2.5 py-1 rounded-lg">{allAlerts.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#F0F3F7]">
                  {['Alert', 'Risk Dimension', 'Source', 'Severity', 'Type', 'Time'].map(h => (
                    <th key={h} className="px-5 py-3 text-[10px] font-600 text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allAlerts.map((alert, i) => (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setActiveAlert(alert)}
                    className="border-b border-[#F0F3F7] last:border-0 hover:bg-[#F8FAFC] cursor-pointer transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <p className="text-[12px] font-500 text-[#0F1623] group-hover:text-blue-700 transition-colors">{alert.title}</p>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5 max-w-xs truncate">{alert.desc}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[11px] text-[#6B7280]">{alert.dim}</span>
                    </td>
                    <td className="px-5 py-3.5"><SourceBadge source={alert.source} /></td>
                    <td className="px-5 py-3.5"><SeverityBadge severity={alert.severity} size="xs" /></td>
                    <td className="px-5 py-3.5"><TypeBadge type={alert.type} size="xs" /></td>
                    <td className="px-5 py-3.5 text-[11px] text-[#9CA3AF] whitespace-nowrap">{alert.time}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}