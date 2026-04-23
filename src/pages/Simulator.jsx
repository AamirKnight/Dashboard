import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Simulator() {
  // State for Simulator Controls
  const [params, setParams] = useState({
    gpUptime: 72, declineWeeks: 2, incidentCount: 3,
    ftthGross: 65, ftthChurn: 4, ftthNet: 2,
    openCritical: 5, maxIssueAge: 2, resolutionRate: 70,
    elecUnavail: 0, acUnavail: 0, rackUnavail: 0, manpower: 0,
    hoto: 60, daysSinceUpdate: 5, commissionGap: 0, patFatOverdue: 0
  });

  const handleChange = (e) => {
    setParams({ ...params, [e.target.name]: Number(e.target.value) });
  };

  // Mock calculation for Explainability Bars (0-100 scale)
  const weights = {
    uptime: Math.abs(100 - params.gpUptime),
    ftth: Math.max(0, 100 - params.ftthGross + (params.ftthChurn * 2)),
    hoto: Math.abs(100 - params.hoto),
    issues: Math.min(100, params.openCritical * 15 + params.maxIssueAge * 5),
    infra: Math.min(100, (params.elecUnavail + params.acUnavail + params.rackUnavail) * 20)
  };

  const Slider = ({ label, name, value, min=0, max=100, suffix="" }) => (
    <div className="mb-4">
      <label className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wide">
        <span>{label}</span>
        <span className="text-brand-accent">{value}{suffix}</span>
      </label>
      <input type="range" name={name} min={min} max={max} value={value} onChange={handleChange}
        className="w-full accent-purple-500 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
    </div>
  );

  return (
    <div className="p-8 max-w-[1600px] mx-auto grid grid-cols-12 gap-8">
      {/* LEFT PANEL - CONTROLS */}
      <div className="col-span-4 bg-white dark:bg-brand-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 h-[calc(100vh-120px)] overflow-y-auto">
        <h3 className="font-bold text-lg mb-6 border-b pb-4 dark:border-slate-700 flex items-center gap-2">
          <Settings size={20} /> Simulator Controls
        </h3>
        
        <div className="space-y-8">
          <section>
            <h4 className="text-sm font-bold text-slate-400 mb-4 border-l-2 border-purple-500 pl-2">Network Health</h4>
            <Slider label="GP Uptime" name="gpUptime" value={params.gpUptime} suffix="%" />
            <Slider label="Consecutive SLA Decline" name="declineWeeks" value={params.declineWeeks} max={10} suffix=" wks" />
            <Slider label="Incident Count" name="incidentCount" value={params.incidentCount} max={50} />
          </section>

          <section>
            <h4 className="text-sm font-bold text-slate-400 mb-4 border-l-2 border-purple-500 pl-2">FTTH Utilisation</h4>
            <Slider label="Gross Activations" name="ftthGross" value={params.ftthGross} suffix="%" />
            <Slider label="Churn Rate" name="ftthChurn" value={params.ftthChurn} suffix="%" />
            <Slider label="Net Active Connections" name="ftthNet" value={params.ftthNet} min={-100} max={100} suffix="%" />
          </section>

          <section>
            <h4 className="text-sm font-bold text-slate-400 mb-4 border-l-2 border-purple-500 pl-2">Issue Management</h4>
            <Slider label="Open Critical Issues" name="openCritical" value={params.openCritical} max={20} />
            <Slider label="Max Issue Age" name="maxIssueAge" value={params.maxIssueAge} max={30} suffix=" days" />
            <Slider label="Resolution Rate" name="resolutionRate" value={params.resolutionRate} suffix="%" />
          </section>

          <section>
            <h4 className="text-sm font-bold text-slate-400 mb-4 border-l-2 border-purple-500 pl-2">Infrastructure</h4>
            <Slider label="Electricity Unavailable" name="elecUnavail" value={params.elecUnavail} max={100} />
            <Slider label="AC/Cooling Unavailable" name="acUnavail" value={params.acUnavail} max={100} />
            <Slider label="Rack Space Unavailable" name="rackUnavail" value={params.rackUnavail} max={100} />
          </section>

          <section>
            <h4 className="text-sm font-bold text-slate-400 mb-4 border-l-2 border-purple-500 pl-2">Project Progress</h4>
            <Slider label="HOTO Completion" name="hoto" value={params.hoto} suffix="%" />
            <Slider label="Days Since Last Update" name="daysSinceUpdate" value={params.daysSinceUpdate} max={30} />
          </section>
        </div>
      </div>

      {/* RIGHT PANEL - OUTPUTS */}
      <div className="col-span-8 flex flex-col gap-6 h-[calc(100vh-120px)] overflow-y-auto pr-2">
        
        {/* Triggered Alerts Area */}
        <div className="bg-white dark:bg-brand-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> Triggered Alerts
          </h3>
          <div className="grid grid-cols-2 gap-4">
            
            {/* Conditional Mock Alerts */}
            {params.gpUptime < 98 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
                className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/10 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-red-900 dark:text-red-400 text-sm">GP Uptime Below 98% SLA</h4>
                  <span className="text-[10px] font-bold bg-red-200 text-red-800 px-2 py-0.5 rounded">CRITICAL</span>
                </div>
                <p className="text-xs text-red-700 dark:text-red-300 mb-3">Uptime is {params.gpUptime}% — below SLA mandate.</p>
                <span className="text-[10px] font-bold bg-white/50 text-red-800 px-2 py-1 rounded flex items-center gap-1 w-max">
                  <Settings size={12}/> Rules: PMIS+UNMS/NOC
                </span>
              </motion.div>
            )}

            {params.ftthGross < 80 && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
                className="p-4 border border-orange-200 bg-orange-50 dark:bg-orange-900/10 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-orange-900 dark:text-orange-400 text-sm">Low FTTH Gross Activations</h4>
                  <span className="text-[10px] font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded">HIGH</span>
                </div>
                <p className="text-xs text-orange-700 dark:text-orange-300 mb-3">Activations at {params.ftthGross}% — below 80% threshold.</p>
                <span className="text-[10px] font-bold bg-white/50 text-orange-800 px-2 py-1 rounded flex items-center gap-1 w-max">
                  <Settings size={12}/> Rules: PMIS+UNMS
                </span>
              </motion.div>
            )}

            {params.gpUptime >= 98 && params.ftthGross >= 80 && (
               <p className="text-sm text-slate-400 col-span-2">No active alerts triggered with current parameters.</p>
            )}
          </div>
        </div>

        {/* Explainability Panel */}
        <div className="bg-white dark:bg-brand-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex-1">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Brain className="text-purple-500" size={20} /> AI Explainability - Risk Factor Weights
          </h3>
          
          <div className="space-y-6">
            {Object.entries(weights).map(([key, weight]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-2 font-medium">
                  <span className="uppercase tracking-wide text-xs text-slate-500">
                    {key === 'uptime' ? 'GP Uptime / SLA' : 
                     key === 'ftth' ? 'FTTH Utilisation' :
                     key === 'hoto' ? 'HOTO / Delivery' :
                     key === 'issues' ? 'Open Issues' : 'Infrastructure'}
                  </span>
                  <span className={clsx("font-bold", weight > 75 ? 'text-red-500' : weight > 50 ? 'text-orange-500' : 'text-emerald-500')}>
                    {Math.round(weight)}% Risk Share
                  </span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className={clsx("h-full rounded-full", weight > 75 ? 'bg-red-500' : weight > 50 ? 'bg-orange-500' : 'bg-emerald-500')}
                    animate={{ width: `${weight}%` }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}