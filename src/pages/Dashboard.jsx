import { useState } from 'react';
import { motion } from 'framer-motion';
import { summaryStats, recentAlerts } from '../data/mockData';
import AlertDrawer from '../components/alerts/AlertDrawer';

export default function Dashboard() {
  const [selectedAlert, setSelectedAlert] = useState(null);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Implementation Dashboard</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {Object.entries(summaryStats).map(([key, value], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-brand-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"
          >
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <span className={`text-4xl font-bold ${key === 'critical' ? 'text-red-500' : key === 'atRisk' ? 'text-orange-500' : 'text-emerald-500'}`}>
              {value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Recent Alerts */}
      <div className="bg-white dark:bg-brand-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <h3 className="text-lg font-bold mb-4">Recent Alerts</h3>
        <div className="space-y-4">
          {recentAlerts.map((alert, i) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedAlert(alert)}
              className="flex items-start justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{alert.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{alert.desc}</p>
              </div>
              <div className="flex gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-md">
                  {alert.severity}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded-md ${alert.type === 'AI' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                  {alert.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AlertDrawer alert={selectedAlert} onClose={() => setSelectedAlert(null)} />
    </div>
  );
}