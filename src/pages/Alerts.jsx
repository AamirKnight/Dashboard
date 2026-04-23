import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Brain, Settings } from 'lucide-react';
import clsx from 'clsx';
import { allAlerts } from '../data/mockData';

export default function Alerts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Filter Logic
  const filteredAlerts = allAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alert.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || alert.severity === severityFilter;
    const matchesType = typeFilter === 'All' || alert.type === typeFilter;
    return matchesSearch && matchesSeverity && matchesType;
  });

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const FilterButton = ({ active, label, onClick }) => (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 rounded-lg text-sm font-medium transition-colors border",
        active 
          ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300" 
          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-brand-800 dark:border-slate-700 dark:text-slate-300"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Alert Register</h1>
        <div className="flex items-center gap-3 text-sm text-slate-500 mb-4">
          <span className="font-medium bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">27 Defined</span>
          <span>·</span>
          <span className="font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-1 rounded">
            {allAlerts.length} Active
          </span>
        </div>
        <p className="text-sm text-slate-500 max-w-2xl">
          All alerts sourced strictly from the BharatNet ALERT Concept Note — tracking network health, FTTH utilization, and infrastructure SLAs.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-brand-800 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 flex flex-wrap gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search alerts by title or description..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-900 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          />
        </div>

        {/* Severity Filters */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400 mr-1" />
          <FilterButton active={severityFilter === 'All'} label="All Severity" onClick={() => setSeverityFilter('All')} />
          <FilterButton active={severityFilter === 'Critical'} label="Critical" onClick={() => setSeverityFilter('Critical')} />
          <FilterButton active={severityFilter === 'High'} label="High" onClick={() => setSeverityFilter('High')} />
          <FilterButton active={severityFilter === 'Medium'} label="Medium" onClick={() => setSeverityFilter('Medium')} />
        </div>

        {/* Type Filters */}
        <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-700 pl-4">
          <FilterButton active={typeFilter === 'All'} label="All Types" onClick={() => setTypeFilter('All')} />
          <FilterButton active={typeFilter === 'AI'} label="🧠 AI" onClick={() => setTypeFilter('AI')} />
          <FilterButton active={typeFilter === 'Rules'} label="📏 Rules" onClick={() => setTypeFilter('Rules')} />
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm font-medium text-slate-500 mb-4">
        Showing {filteredAlerts.length} alerts
      </p>

      {/* Alert List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredAlerts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-12 bg-white dark:bg-brand-800 rounded-2xl border border-slate-100 dark:border-slate-700"
            >
              <p className="text-slate-500">No alerts found matching your filters.</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="bg-white dark:bg-brand-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all flex items-center justify-between gap-6 group"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {alert.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">{alert.desc}</p>
                </div>
                
                <div className="flex items-center gap-3 w-48 justify-end">
                  <span className={clsx("px-2.5 py-1 text-[11px] font-bold uppercase rounded-md border", getSeverityStyles(alert.severity))}>
                    {alert.severity}
                  </span>
                  <span className={clsx("px-2.5 py-1 text-[11px] font-bold uppercase rounded-md border flex items-center gap-1.5 w-[75px] justify-center", 
                    alert.type === 'AI' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-blue-100 text-blue-700 border-blue-200'
                  )}>
                    {alert.type === 'AI' ? <Brain size={12} /> : <Settings size={12} />}
                    {alert.type}
                  </span>
                </div>

                <div className="w-20 text-right">
                  <span className="text-xs font-medium text-slate-400">{alert.time}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}