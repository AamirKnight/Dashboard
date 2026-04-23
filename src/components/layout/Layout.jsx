import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Sliders, List, Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Alert Simulator', path: '/simulator', icon: Sliders },
    { name: 'All Alerts', path: '/alerts', icon: List },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-500">
            BharatNet ALERT
          </h1>
          <p className="text-xs text-slate-400 mt-1">AI EARLY RISK TRACKING</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} className="relative block">
                {isActive && (
                  <motion.div layoutId="nav-pill" className="absolute inset-0 bg-slate-800 rounded-lg" />
                )}
                <div className={`relative flex items-center gap-3 px-4 py-3 rounded-lg z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}>
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 flex justify-between items-center">
          <span className="text-sm text-slate-400">Light Mode</span>
          <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-slate-800 rounded-full text-slate-300">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-brand-900">
        <Outlet />
      </main>
    </div>
  );
}