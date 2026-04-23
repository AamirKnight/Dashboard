import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pipelineSteps } from '../data/mockData';

export default function Simulator() {
  const [gpUptime, setGpUptime] = useState(59);
  const [activeStep, setActiveStep] = useState(4); // Default finished
  const [isSimulating, setIsSimulating] = useState(false);

  // Fake pipeline simulation
  const handleSliderChange = (e) => {
    setGpUptime(e.target.value);
    
    if (!isSimulating) {
      setIsSimulating(true);
      setActiveStep(1);
      
      let step = 1;
      const interval = setInterval(() => {
        step++;
        setActiveStep(step);
        if (step >= 4) {
          clearInterval(interval);
          setIsSimulating(false);
        }
      }, 600);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8">
      {/* Controls Panel */}
      <div className="col-span-4 bg-white dark:bg-brand-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-bold mb-6 border-b pb-4 dark:border-slate-700">Parameter Controls</h3>
        
        <div className="mb-6">
          <label className="flex justify-between text-sm font-medium mb-2">
            <span>GP Uptime (%)</span>
            <span className="text-orange-500">{gpUptime}%</span>
          </label>
          <input 
            type="range" 
            min="0" max="100" 
            value={gpUptime} 
            onChange={handleSliderChange}
            className="w-full accent-orange-500"
          />
        </div>
        {/* Add more sliders here following the same pattern */}
      </div>

      {/* Output Panel */}
      <div className="col-span-8 space-y-6">
        
        {/* Pipeline Stepper */}
        <div className="bg-white dark:bg-brand-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold mb-4">Processing Pipeline</h3>
          <div className="flex gap-4">
            {pipelineSteps.map((step) => (
              <div key={step.id} className={`flex-1 p-3 rounded-lg border transition-colors duration-300 ${activeStep >= step.id ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200 dark:bg-brand-900 dark:border-slate-700'}`}>
                <h4 className={`text-xs font-bold uppercase mb-1 ${activeStep >= step.id ? 'text-emerald-700' : 'text-slate-500'}`}>{step.title}</h4>
                <p className={`text-xs ${activeStep >= step.id ? 'text-emerald-600' : 'text-slate-400'}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Explainability Panel */}
        <div className="bg-white dark:bg-brand-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="font-bold mb-6">🧠 AI Explainability - Risk Factor Weights</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>GP Uptime / SLA</span>
                <span className="text-red-500 font-bold">{Math.abs(100 - gpUptime)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <motion.div 
                  className="bg-red-500 h-2 rounded-full" 
                  animate={{ width: `${Math.abs(100 - gpUptime)}%` }}
                  transition={{ type: "spring" }}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <span className="text-emerald-700 font-mono text-lg">Package Health Score: {gpUptime} / 100</span>
          </div>
        </div>
      </div>
    </div>
  );
}