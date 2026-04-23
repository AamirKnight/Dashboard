import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Brain, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { SeverityBadge, TypeBadge, SourceBadge } from '../components/ui/Badges';

// ─── SLIDER COMPONENT ────────────────────────────────────────────────────────
function SliderRow({ label, name, value, min = 0, max = 100, suffix = '', signed = false, onChange }) {
  const display = signed && value > 0 ? `+${value}${suffix}` : `${value}${suffix}`;
  const pct = ((value - min) / (max - min)) * 100;
  const danger = pct > 70;
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
        <span className={clsx(
          'text-[10px] font-bold font-mono',
          danger ? 'text-red-500' : 'text-blue-600',
        )}>{display}</span>
      </div>
      <input
        type="range"
        name={name}
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(name, Number(e.target.value))}
        style={{ '--pct': `${pct}%` }}
        className="w-full"
      />
    </div>
  );
}

// ─── SLIDER GROUP ─────────────────────────────────────────────────────────────
function SliderGroup({ title, children }) {
  return (
    <div className="mb-5">
      <h4 className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mb-3 border-l-2 border-blue-500 pl-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

// ─── EXPLAINABILITY BAR ───────────────────────────────────────────────────────
function ExplainBar({ label, value }) {
  const color = value > 70 ? 'bg-red-500' : value > 45 ? 'bg-orange-500' : 'bg-emerald-500';
  const textColor = value > 70 ? 'text-red-600' : value > 45 ? 'text-orange-600' : 'text-emerald-600';
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
        <span className={clsx('text-[10px] font-bold font-mono', textColor)}>{Math.round(value)}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className={clsx('h-full rounded-full', color)}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', damping: 20, stiffness: 120 }}
        />
      </div>
    </div>
  );
}

// ─── TRIGGER CARD ─────────────────────────────────────────────────────────────
function TriggerCard({ sev, title, desc, type, source }) {
  const styles = {
    Critical: 'bg-red-50 border-red-200 border-l-red-500',
    High:     'bg-orange-50 border-orange-200 border-l-orange-500',
    Medium:   'bg-yellow-50 border-yellow-200 border-l-yellow-500',
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -4 }}
      transition={{ duration: 0.2 }}
      className={clsx('rounded-lg border border-l-[3px] p-3', styles[sev])}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className={clsx(
          'text-[11px] font-bold leading-snug',
          sev === 'Critical' ? 'text-red-800' : sev === 'High' ? 'text-orange-800' : 'text-yellow-800',
        )}>{title}</p>
        <SeverityBadge severity={sev} size="xs" />
      </div>
      <p className="text-[10px] text-slate-600 leading-snug mb-2">{desc}</p>
      <div className="flex items-center gap-1.5">
        <TypeBadge type={type} size="xs" />
        <SourceBadge source={source} />
      </div>
    </motion.div>
  );
}

// ─── SIMULATOR PAGE ───────────────────────────────────────────────────────────
const DEFAULTS = {
  gpUptime: 72, declineWeeks: 2, incidentCount: 3,
  ftthGross: 65, ftthChurn: 4, ftthNet: 2,
  openCritical: 5, maxIssueAge: 2, resolutionRate: 70,
  elecUnavail: 0, acUnavail: 0, rackUnavail: 0, manpower: 0,
  hoto: 60, daysSinceUpdate: 5, commissionGap: 0, patFatOverdue: 0,
};

export default function Simulator() {
  const [params, setParams] = useState(DEFAULTS);

  const update = (name, value) => setParams(p => ({ ...p, [name]: value }));
  const reset  = () => setParams(DEFAULTS);

  // ── Triggered alerts logic ────────────────────────────────────────────────
  const triggers = [];
  if (params.gpUptime < 98) triggers.push({ sev: 'Critical', title: 'GP Uptime Below 98% SLA', desc: `Uptime at ${params.gpUptime}% — below 98% SLA mandate.`, type: 'Rules', source: 'UNMS/NOC' });
  if (params.declineWeeks >= 3) triggers.push({ sev: 'Critical', title: 'Consecutive SLA Compliance Decline', desc: `${params.declineWeeks} consecutive weeks of SLA decline detected.`, type: 'AI', source: 'UNMS/NOC' });
  if (params.incidentCount > 15) triggers.push({ sev: 'High', title: 'Incident / Fault History Spike', desc: `${params.incidentCount} incidents — exceeds 15/week baseline by ${Math.round(params.incidentCount / 5)}×.`, type: 'Rules', source: 'NOC' });
  if (params.ftthGross < 80) triggers.push({ sev: 'High', title: 'Low FTTH Gross Activations', desc: `Activations at ${params.ftthGross}% — below 80% threshold.`, type: 'Rules', source: 'PMIS' });
  if (params.ftthChurn > 10) triggers.push({ sev: 'High', title: 'High FTTH Churn Rate', desc: `Churn at ${params.ftthChurn}% — exceeds 10% tolerance.`, type: 'Rules', source: 'PMIS' });
  if (params.ftthNet < 0) triggers.push({ sev: 'Medium', title: 'Net Active Connections Declining', desc: `Net connections change at ${params.ftthNet}% — negative trend.`, type: 'AI', source: 'PMIS' });
  if (params.openCritical > 10) triggers.push({ sev: 'High', title: 'High Open Issue Count', desc: `${params.openCritical} critical issues open — exceeds baseline of 10.`, type: 'Rules', source: 'IMS' });
  if (params.maxIssueAge > 5) triggers.push({ sev: 'High', title: 'Aging Issues Unresolved', desc: `Issues open for ${params.maxIssueAge} days — exceeds 5-day SLA.`, type: 'Rules', source: 'IMS' });
  if (params.resolutionRate < 60) triggers.push({ sev: 'Medium', title: 'Low Issue Resolution Rate', desc: `Resolution at ${params.resolutionRate}% — below 60% weekly threshold.`, type: 'AI', source: 'IMS' });
  if (params.elecUnavail > 0) triggers.push({ sev: 'Critical', title: 'Electricity Unavailability at Site', desc: `${params.elecUnavail} sites reporting electricity unavailability.`, type: 'Rules', source: 'Samridh Gram' });
  if (params.acUnavail > 0) triggers.push({ sev: 'High', title: 'AC Unavailability at Site', desc: `${params.acUnavail} sites with cooling/AC failures.`, type: 'Rules', source: 'Samridh Gram' });
  if (params.rackUnavail > 0) triggers.push({ sev: 'Medium', title: 'Rack Space Unavailability', desc: `Rack utilization critical at ${params.rackUnavail} sites.`, type: 'Rules', source: 'Samridh Gram' });
  if (params.manpower > 0) triggers.push({ sev: 'High', title: 'Manpower Shortage', desc: `${params.manpower} sites below minimum staffing threshold.`, type: 'Rules', source: 'Samridh Gram' });
  if (params.hoto < 40) triggers.push({ sev: 'Medium', title: 'HOTO Completion Stagnation', desc: `HOTO at ${params.hoto}% — well below expected 40% progress.`, type: 'AI', source: 'PMIS' });
  if (params.daysSinceUpdate > 14) triggers.push({ sev: 'Medium', title: 'No Recent Project Updates', desc: `${params.daysSinceUpdate} days since last recorded update.`, type: 'Rules', source: 'PMIS' });

  // ── Explainability weights ────────────────────────────────────────────────
  const weights = {
    'GP Uptime / SLA':    Math.min(100, Math.max(0, Math.round(Math.abs(100 - params.gpUptime) + params.declineWeeks * 5))),
    'FTTH Utilisation':   Math.min(100, Math.max(0, Math.round(Math.abs(100 - params.ftthGross) + params.ftthChurn * 3))),
    'HOTO / Delivery':    Math.min(100, Math.max(0, Math.round(Math.abs(100 - params.hoto) * 0.8))),
    'Open Issues':        Math.min(100, Math.max(0, Math.round(params.openCritical * 5 + params.maxIssueAge * 3))),
    'Infrastructure':     Math.min(100, Math.max(0, Math.round((params.elecUnavail + params.acUnavail + params.rackUnavail) * 0.6 + params.manpower * 0.4))),
  };

  const critCount = triggers.filter(t => t.sev === 'Critical').length;

  return (
    <div className="p-5 h-[calc(100vh-0px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-sm font-bold text-slate-800">Alert Simulator</h1>
          <p className="text-[10px] text-slate-400 mt-0.5">Adjust parameters to simulate telecom network conditions in real-time</p>
        </div>
        <button
          onClick={reset}
          className="text-[10px] font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors"
        >
          ↺ Reset defaults
        </button>
      </div>

      <div className="flex-1 grid grid-cols-[260px_1fr] gap-4 min-h-0">

        {/* ── LEFT: CONTROLS ─────────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-y-auto p-4">
          <div className="flex items-center gap-1.5 mb-4">
            <Settings size={13} className="text-slate-500" />
            <span className="text-[11px] font-bold text-slate-700">Simulation Controls</span>
          </div>

          <SliderGroup title="Network SLA">
            <SliderRow label="GP Uptime"            name="gpUptime"       value={params.gpUptime}       min={0}   max={100} suffix="%" onChange={update} />
            <SliderRow label="SLA Decline Weeks"    name="declineWeeks"   value={params.declineWeeks}   min={0}   max={10}  suffix=" wks" onChange={update} />
            <SliderRow label="Incident Count"       name="incidentCount"  value={params.incidentCount}  min={0}   max={50}  onChange={update} />
          </SliderGroup>

          <SliderGroup title="FTTH Utilisation">
            <SliderRow label="Gross Activations"    name="ftthGross"      value={params.ftthGross}      min={0}   max={100} suffix="%" onChange={update} />
            <SliderRow label="Churn Rate"           name="ftthChurn"      value={params.ftthChurn}      min={0}   max={30}  suffix="%" onChange={update} />
            <SliderRow label="Net Connections Δ"    name="ftthNet"        value={params.ftthNet}        min={-20} max={20}  suffix="%" signed onChange={update} />
          </SliderGroup>

          <SliderGroup title="Issue Management">
            <SliderRow label="Open Critical Issues" name="openCritical"   value={params.openCritical}   min={0}   max={30}  onChange={update} />
            <SliderRow label="Max Issue Age (days)" name="maxIssueAge"    value={params.maxIssueAge}    min={0}   max={30}  onChange={update} />
            <SliderRow label="Resolution Rate"      name="resolutionRate" value={params.resolutionRate} min={0}   max={100} suffix="%" onChange={update} />
          </SliderGroup>

          <SliderGroup title="Infrastructure">
            <SliderRow label="Electricity Issues"   name="elecUnavail"    value={params.elecUnavail}    min={0}   max={100} onChange={update} />
            <SliderRow label="AC/Cooling Issues"    name="acUnavail"      value={params.acUnavail}      min={0}   max={100} onChange={update} />
            <SliderRow label="Rack Space Issues"    name="rackUnavail"    value={params.rackUnavail}    min={0}   max={100} onChange={update} />
            <SliderRow label="Manpower Shortage"    name="manpower"       value={params.manpower}       min={0}   max={100} onChange={update} />
          </SliderGroup>

          <SliderGroup title="Project Progress">
            <SliderRow label="HOTO Completion"      name="hoto"           value={params.hoto}           min={0}   max={100} suffix="%" onChange={update} />
            <SliderRow label="Days Since Update"    name="daysSinceUpdate" value={params.daysSinceUpdate} min={0} max={30}  onChange={update} />
            <SliderRow label="Commission Gap"       name="commissionGap"  value={params.commissionGap}  min={0}   max={100} suffix="%" onChange={update} />
            <SliderRow label="PAT/FAT Overdue"      name="patFatOverdue"  value={params.patFatOverdue}  min={0}   max={30}  suffix=" days" onChange={update} />
          </SliderGroup>
        </div>

        {/* ── RIGHT: OUTPUTS ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 min-h-0 overflow-y-auto pr-0.5">

          {/* Triggered Alerts */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-shrink-0">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
              <AlertTriangle size={13} className="text-red-500" />
              <span className="text-[11px] font-bold text-slate-700">Triggered Alerts</span>
              <div className="flex gap-1.5 ml-1">
                {critCount > 0 && (
                  <span className="text-[9px] font-bold bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded-full">
                    {critCount} Critical
                  </span>
                )}
                <span className="text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-full">
                  {triggers.length} Total
                </span>
              </div>
            </div>
            <div className="p-3">
              {triggers.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-6 text-[11px] text-slate-400">
                  <span>✅</span> No alerts triggered — all parameters within thresholds
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <AnimatePresence mode="popLayout">
                    {triggers.map(t => (
                      <TriggerCard key={t.title} {...t} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* AI Explainability */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex-shrink-0">
            <div className="flex items-center gap-1.5 mb-4">
              <Brain size={13} className="text-violet-500" />
              <span className="text-[11px] font-bold text-slate-700">AI Explainability — Risk Factor Weights</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-0">
              {Object.entries(weights).map(([label, value]) => (
                <ExplainBar key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          {/* Risk Score Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex-shrink-0">
            <h4 className="text-[11px] font-bold text-slate-700 mb-3">Overall Risk Assessment</h4>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Network Risk',  value: Math.round((weights['GP Uptime / SLA'] + weights['FTTH Utilisation']) / 2),  color: 'text-blue-600',   bg: 'bg-blue-50' },
                { label: 'Infra Risk',    value: weights['Infrastructure'],                                                    color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Delivery Risk', value: Math.round((weights['HOTO / Delivery'] + weights['Open Issues']) / 2),        color: 'text-violet-600', bg: 'bg-violet-50' },
              ].map(({ label, value, color, bg }) => (
                <div key={label} className={clsx('rounded-lg p-3 text-center', bg)}>
                  <p className={clsx('text-2xl font-bold', color)}>{value}%</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{label}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">
                    {value > 70 ? '🔴 High' : value > 40 ? '🟠 Medium' : '🟢 Low'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}