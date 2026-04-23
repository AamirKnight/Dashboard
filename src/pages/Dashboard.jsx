import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity, TrendingDown, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { summaryStats, allAlerts, recentAlerts } from '../data/mockData';
import { SeverityBadge, TypeBadge, SourceBadge } from '../components/ui/Badges';
import AlertDrawer from '../components/alerts/AlertDrawer';

const ICONS = { AlertTriangle, Activity, TrendingDown, TrendingUp };

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
function MetricCard({ stat, delay }) {
  const Icon = ICONS[stat.icon];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white border border-slate-200 rounded-xl p-4"
    >
      <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center mb-3', stat.bg)}>
        <Icon size={15} className={stat.color} />
      </div>
      <p className={clsx('text-3xl font-bold leading-none mb-1', stat.color)}>{stat.value}</p>
      <p className="text-[11px] font-semibold text-slate-600">{stat.title}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{stat.sub}</p>
    </motion.div>
  );
}

// ─── RISK BY SOURCE BAR ───────────────────────────────────────────────────────
function RiskBar({ label, color, total, critical }) {
  const pct = Math.round((critical / total) * 100);
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className={clsx('w-2 h-2 rounded-full', color)} />
          <span className="text-[11px] font-medium text-slate-600">{label}</span>
        </div>
        <span className="text-[10px] text-slate-400">{total} alerts · <span className="text-red-600 font-semibold">{critical} critical</span></span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={clsx('h-full rounded-full transition-all duration-700', color.replace('bg-', 'bg-'))}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeAlert, setActiveAlert] = useState(null);

  const critical = allAlerts.filter(a => a.severity === 'Critical');
  const high = allAlerts.filter(a => a.severity === 'High');

  return (
    <>
      <AlertDrawer alert={activeAlert} onClose={() => setActiveAlert(null)} />

      <div className="p-5 max-w-[1400px] mx-auto">

        {/* ── TOP: AI SUMMARY ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-[#0c1a32] to-[#0f2040] rounded-xl p-5 mb-5 border border-[#1e3a5f] relative overflow-hidden"
        >
          {/* subtle grid texture */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-lg">🧠</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-sm font-bold text-white">AI Analysis Summary</h2>
                <span className="text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full">
                  ⚠ {critical.length} Critical Alerts
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed max-w-3xl">
                BharatNet ALERT has identified <strong className="text-slate-200">{critical.length} critical</strong> and <strong className="text-slate-200">{high.length} high-priority</strong> alerts
                requiring immediate attention — primarily network infrastructure issues in Eastern regions.
                Service disruptions predicted within <strong className="text-slate-200">48 hours</strong> based on pattern recognition across 5 data sources.
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {['Network SLA Degradation', 'Infrastructure Gaps', 'FTTH Underperformance', 'Issue Aging Risk'].map(tag => (
                  <span key={tag} className="text-[9px] font-medium text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── METRICS ROW ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          {summaryStats.map((stat, i) => (
            <MetricCard key={stat.id} stat={stat} delay={i * 0.07} />
          ))}
        </div>

        {/* ── TWO-COLUMN SECTION ──────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-5">

          {/* Critical alerts list */}
          <div className="col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-red-500" />
                Critical & High Alerts
              </h3>
              <span className="text-[9px] text-slate-400">{critical.length + high.length} active</span>
            </div>
            <div className="divide-y divide-slate-50">
              {[...critical, ...high].slice(0, 7).map((alert, i) => (
                <motion.button
                  key={alert.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setActiveAlert(alert)}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors group flex items-center gap-3"
                >
                  <div className={clsx(
                    'w-1.5 h-1.5 rounded-full flex-shrink-0',
                    alert.severity === 'Critical' ? 'bg-red-500' : 'bg-orange-500',
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate">{alert.title}</p>
                    <p className="text-[10px] text-slate-400 truncate">{alert.desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <SeverityBadge severity={alert.severity} size="xs" />
                    <TypeBadge type={alert.type} size="xs" />
                    <span className="text-[9px] text-slate-400 w-12 text-right">{alert.time}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Risk by source + recent feed */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <h3 className="text-[11px] font-bold text-slate-700 mb-3">Risk by Source</h3>
              <RiskBar label="UNMS / NOC"       color="bg-blue-500"    total={4}  critical={2} />
              <RiskBar label="Samridh Gram App" color="bg-emerald-500" total={4}  critical={1} />
              <RiskBar label="Issue Management" color="bg-amber-500"   total={7}  critical={2} />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 flex-1">
              <h3 className="text-[11px] font-bold text-slate-700 mb-3">Recent Activity</h3>
              <div className="space-y-2.5">
                {recentAlerts.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setActiveAlert(a)}
                    className="w-full text-left group"
                  >
                    <p className="text-[11px] font-medium text-slate-700 group-hover:text-blue-600 transition-colors leading-snug">{a.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <SourceBadge source={a.source} />
                      <span className="text-[9px] text-slate-400 ml-auto">{a.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FULL ALERTS TABLE ────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-700">All Active Alerts</h3>
            <span className="text-[9px] text-slate-400">{allAlerts.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Alert', 'Risk Dimension', 'Source', 'Severity', 'Type', 'Time'].map(h => (
                    <th key={h} className="px-4 py-2 text-[9px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allAlerts.map((alert, i) => (
                  <motion.tr
                    key={alert.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => setActiveAlert(alert)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-2.5">
                      <p className="text-[11px] font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{alert.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs truncate">{alert.desc}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[10px] text-slate-500">{alert.dim}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <SourceBadge source={alert.source} />
                    </td>
                    <td className="px-4 py-2.5">
                      <SeverityBadge severity={alert.severity} size="xs" />
                    </td>
                    <td className="px-4 py-2.5">
                      <TypeBadge type={alert.type} size="xs" />
                    </td>
                    <td className="px-4 py-2.5 text-[10px] text-slate-400 whitespace-nowrap">{alert.time}</td>
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