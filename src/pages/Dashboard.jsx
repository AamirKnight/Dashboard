import { motion } from 'framer-motion';
import { summaryStats, recentAlerts, allAlerts } from '../data/mockData';
import { AlertTriangle, Activity, TrendingDown, TrendingUp, Brain, Settings } from 'lucide-react';
import clsx from 'clsx';

const ICONS = { AlertTriangle, Activity, TrendingDown, TrendingUp };

export default function Dashboard() {
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto flex gap-8">
      {/* LEFT SIDEBAR - 25% */}
      <div className="w-1/4 flex flex-col gap-4">
        <div className="mb-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Alerts</h2>
          <p className="text-sm text-slate-500">Latest 5 issues</p>
        </div>
        
        {recentAlerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-brand-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{alert.title}</h4>
            <p className="text-xs text-slate-500 mt-1 mb-3 line-clamp-2">{alert.desc}</p>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <span className={clsx("px-2 py-0.5 text-[10px] font-bold uppercase rounded border", getSeverityStyles(alert.severity))}>
                  {alert.severity}
                </span>
                <span className={clsx("px-2 py-0.5 text-[10px] font-bold uppercase rounded border flex items-center gap-1", 
                  alert.type === 'AI' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                )}>
                  {alert.type === 'AI' ? <Brain size={10} /> : <Settings size={10} />}
                  {alert.type}
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400">{alert.time}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MAIN CONTENT AREA - 75% */}
      <div className="w-3/4 flex flex-col gap-6">
        
        {/* AI Analysis Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-900 to-brand-900 rounded-2xl p-6 shadow-lg border border-purple-800 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Brain size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="text-purple-400" size={24} />
              <h2 className="text-2xl font-bold">AI Analysis Summary</h2>
            </div>
            <h3 className="text-lg font-medium text-red-400 mb-2">3 critical alerts detected</h3>
            <p className="text-purple-100/80 leading-relaxed max-w-3xl">
              BharatNet ALERT has identified 3 critical alerts requiring immediate attention — primarily network infrastructure issues in Eastern regions with service disruptions predicted within 48 hours based on pattern recognition across 5 data sources.
            </p>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-4 gap-6">
          {summaryStats.map((stat, i) => {
            const Icon = ICONS[stat.icon];
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white dark:bg-brand-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={clsx("p-2 rounded-lg", stat.bg, stat.color)}>
                    <Icon size={20} />
                  </div>
                </div>
                <span className={clsx("text-4xl font-bold mb-1", stat.color)}>{stat.value}</span>
                <h3 className="text-sm font-medium text-slate-500">{stat.title}</h3>
              </motion.div>
            );
          })}
        </div>

        {/* Full Alerts List */}
        <div className="bg-white dark:bg-brand-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden flex flex-col mt-2">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-lg font-bold">All Active Alerts</h3>
          </div>
          <div className="overflow-y-auto max-h-[400px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-medium">Alert Details</th>
                  <th className="px-6 py-4 font-medium">Severity</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {allAlerts.map(alert => (
                  <tr key={alert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{alert.title}</p>
                      <p className="text-slate-500 mt-1 text-xs">{alert.desc}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={clsx("px-2.5 py-1 text-xs font-bold uppercase rounded-md border", getSeverityStyles(alert.severity))}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {alert.type === 'AI' ? <Brain size={14} className="text-purple-500"/> : <Settings size={14} className="text-blue-500"/>}
                        {alert.type}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {alert.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}