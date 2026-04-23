import { useState, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Image, Video, FileText, CheckCircle2, Clock, AlertCircle, ChevronDown, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const GP_DATA = [
  { id: 1, name: 'Kahalgaon Block GP',       district: 'Bhagalpur', block: 'Kahalgaon',  status: 'Completed', images: 28, videos: 12, docs: 8,  lastUpdated: '2h ago',  equipment: 'OLT, Splitter, Cabinet' },
  { id: 2, name: 'Sultanganj Panchayat',      district: 'Bhagalpur', block: 'Sultanganj', status: 'Pending',   images: 8,  videos: 4,  docs: 0,  lastUpdated: '1d ago',  equipment: 'OLT, Power Unit' },
  { id: 3, name: 'Naugachhia Exchange',       district: 'Bhagalpur', block: 'Naugachhia', status: 'Overdue',   images: 0,  videos: 0,  docs: 0,  lastUpdated: '14d ago', equipment: 'Pending Survey' },
  { id: 4, name: 'Pirpainti GP Node',         district: 'Bhagalpur', block: 'Pirpainti',  status: 'Completed', images: 42, videos: 6,  docs: 11, lastUpdated: '3h ago',  equipment: 'OLT, Splitter, UPS' },
  { id: 5, name: 'Banka Central Exchange',    district: 'Banka',     block: 'Banka',      status: 'Completed', images: 35, videos: 9,  docs: 7,  lastUpdated: '5h ago',  equipment: 'OLT, Cabinet, Battery' },
  { id: 6, name: 'Amarpur Block',             district: 'Banka',     block: 'Amarpur',    status: 'Pending',   images: 4,  videos: 0,  docs: 2,  lastUpdated: '3d ago',  equipment: 'OLT only' },
  { id: 7, name: 'Katoria GP Hub',            district: 'Banka',     block: 'Katoria',    status: 'Completed', images: 55, videos: 14, docs: 9,  lastUpdated: '1h ago',  equipment: 'OLT, Splitter, Cabinet, UPS' },
  { id: 8, name: 'Bausi Panchayat Node',      district: 'Banka',     block: 'Bausi',      status: 'Overdue',   images: 0,  videos: 0,  docs: 0,  lastUpdated: '21d ago', equipment: 'Pending Survey' },
  { id: 9, name: 'Munger City Exchange',      district: 'Munger',    block: 'Munger',     status: 'Completed', images: 38, videos: 11, docs: 6,  lastUpdated: '6h ago',  equipment: 'OLT, Splitter, Cabinet' },
  { id: 10, name: 'Jamalpur Block GP',        district: 'Munger',    block: 'Jamalpur',   status: 'Pending',   images: 6,  videos: 2,  docs: 1,  lastUpdated: '2d ago',  equipment: 'OLT, Power Unit' },
  { id: 11, name: 'Kharagpur Node',           district: 'Munger',    block: 'Kharagpur',  status: 'Completed', images: 31, videos: 8,  docs: 5,  lastUpdated: '4h ago',  equipment: 'OLT, Splitter' },
  { id: 12, name: 'Tarapur Exchange',         district: 'Munger',    block: 'Tarapur',    status: 'Completed', images: 27, videos: 7,  docs: 4,  lastUpdated: '8h ago',  equipment: 'OLT, Cabinet, UPS' },
];

const STATUS_CONFIG = {
  Completed: { icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Pending:   { icon: Clock,        color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200',   dot: 'bg-amber-500' },
  Overdue:   { icon: AlertCircle,  color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200',     dot: 'bg-red-500' },
};

function StatCard({ label, value, sub, color = 'text-[#0F1623]', bg = 'bg-[#F5F7FA]' }) {
  return (
    <div className={`${bg} rounded-2xl p-5`}>
      <p className={`text-[32px] font-700 leading-none ${color}`}>{value}</p>
      <p className="text-[14px] font-500 text-[#4B5563] mt-1.5">{label}</p>
      {sub && <p className="text-[12px] text-[#9CA3AF] mt-0.5">{sub}</p>}
    </div>
  );
}

export default function GPEquipment() {
  const navigate = useNavigate();
  const [search, setSearch]     = useState('');
  const [district, setDistrict] = useState('All');
  const [status, setStatus]     = useState('All');
  const [expanded, setExpanded] = useState(null);

  const districts = ['All', ...new Set(GP_DATA.map(g => g.district))];

  const filtered = useMemo(() => GP_DATA.filter(g => {
    const q = search.toLowerCase();
    const matchSearch   = g.name.toLowerCase().includes(q) || g.block.toLowerCase().includes(q);
    const matchDistrict = district === 'All' || g.district === district;
    const matchStatus   = status === 'All' || g.status === status;
    return matchSearch && matchDistrict && matchStatus;
  }), [search, district, status]);

  const totalMedia = GP_DATA.reduce((s, g) => s + g.images + g.videos + g.docs, 0);
  const completed  = GP_DATA.filter(g => g.status === 'Completed').length;
  const pending    = GP_DATA.filter(g => g.status === 'Pending').length;
  const overdue    = GP_DATA.filter(g => g.status === 'Overdue').length;

  return (
    <div className="px-6 py-6 max-w-[1400px] mx-auto">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-[26px] font-700 text-[#0F1623]">GP Equipment</h1>
        <p className="text-[15px] text-[#6B7280] mt-1">GP-level equipment and infrastructure survey</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Started" value={GP_DATA.length.toLocaleString()} bg="bg-white" />
        <StatCard label="Completed"     value={completed} sub={`${Math.round(completed / GP_DATA.length * 100)}% done`} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Pending"       value={pending}   sub="In progress" color="text-amber-600"   bg="bg-amber-50" />
        <StatCard label="Overdue"       value={overdue}   sub="No updates"  color="text-red-600"     bg="bg-red-50" />
        <StatCard label="Media Files"   value={totalMedia.toLocaleString()} sub="images · videos · docs" bg="bg-[#F5F7FA]" />
      </div>

      {/* Media breakdown */}
      <div className="bg-white rounded-2xl border border-[#E8ECF0] p-5 mb-5">
        <h3 className="text-[15px] font-600 text-[#0F1623] mb-4">Media Breakdown</h3>
        <div className="flex gap-6">
          {[
            { icon: Image,     label: 'Images',    count: GP_DATA.reduce((s,g) => s + g.images, 0), color: 'text-blue-600',    bg: 'bg-blue-50' },
            { icon: Video,     label: 'Videos',    count: GP_DATA.reduce((s,g) => s + g.videos, 0), color: 'text-violet-600',  bg: 'bg-violet-50' },
            { icon: FileText,  label: 'Documents', count: GP_DATA.reduce((s,g) => s + g.docs, 0),   color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(({ icon: Icon, label, count, color, bg }) => (
            <div key={label} className={`flex items-center gap-3 ${bg} rounded-xl px-5 py-3`}>
              <Icon size={18} className={color} />
              <div>
                <p className={`text-[22px] font-700 leading-none ${color}`}>{count.toLocaleString()}</p>
                <p className="text-[12px] text-[#6B7280] mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#E8ECF0] rounded-2xl p-4 mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search GP name or block…"
            className="w-full pl-9 pr-3 py-2 text-[14px] border border-[#E8ECF0] rounded-xl bg-[#F5F7FA] text-[#0F1623] focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-[#9CA3AF]" />
          <select
            value={district}
            onChange={e => setDistrict(e.target.value)}
            className="text-[13px] border border-[#E8ECF0] rounded-xl px-3 py-2 bg-[#F5F7FA] text-[#0F1623] focus:outline-none cursor-pointer"
          >
            {districts.map(d => <option key={d}>{d}</option>)}
          </select>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="text-[13px] border border-[#E8ECF0] rounded-xl px-3 py-2 bg-[#F5F7FA] text-[#0F1623] focus:outline-none cursor-pointer"
          >
            {['All', 'Completed', 'Pending', 'Overdue'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <span className="text-[13px] text-[#9CA3AF] ml-auto">Survey results — {filtered.length} found</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8ECF0] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#F0F3F7]">
              {['GP Name', 'District', 'Block', 'Status', 'Images', 'Videos', 'Docs', 'Equipment', 'Last Updated'].map(h => (
                <th key={h} className="px-5 py-3.5 text-[11px] font-600 text-[#9CA3AF] uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {filtered.map((gp, i) => {
                const cfg = STATUS_CONFIG[gp.status];
                const Icon = cfg.icon;
                return (
                  <Fragment key={gp.id}>
                    <motion.tr
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.02 }}
                      onClick={() => setExpanded(expanded === gp.id ? null : gp.id)}
                      className="border-b border-[#F0F3F7] last:border-0 hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-[14px] font-500 text-[#0F1623]">{gp.name}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{gp.district}</td>
                      <td className="px-5 py-3.5 text-[13px] text-[#6B7280]">{gp.block}</td>
                      <td className="px-5 py-3.5">
                        <span className={clsx('inline-flex items-center gap-1.5 text-[12px] font-500 px-2.5 py-1 rounded-lg border', cfg.color, cfg.bg, cfg.border)}>
                          <Icon size={11} />
                          {gp.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[14px] text-blue-600 font-500">{gp.images}</td>
                      <td className="px-5 py-3.5 text-[14px] text-violet-600 font-500">{gp.videos}</td>
                      <td className="px-5 py-3.5 text-[14px] text-emerald-600 font-500">{gp.docs}</td>
                      <td className="px-5 py-3.5 text-[12px] text-[#6B7280]">{gp.equipment}</td>
                      <td className="px-5 py-3.5 text-[12px] text-[#9CA3AF] whitespace-nowrap">{gp.lastUpdated}</td>
                    </motion.tr>

                    {/* Expandable Context Section */}
                    <AnimatePresence>
                      {expanded === gp.id && (
                        <tr className="bg-[#FAFBFC] border-b border-[#F0F3F7]">
                          <td colSpan={9} className="p-0">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-5 flex items-center justify-between shadow-inner">
                                <div>
                                  <p className="text-[13px] font-semibold text-[#0F1623] mb-1">Equipment Details</p>
                                  <p className="text-[12px] text-[#4B5563]">
                                    Required: {gp.equipment} | Location: {gp.block}, {gp.district} | Media Logged: {gp.images} Images, {gp.videos} Videos.
                                  </p>
                                </div>
                                {gp.status === 'Overdue' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate('/ai-query', {
                                        state: {
                                          contextData: {
                                            id: gp.id,
                                            type: 'Equipment',
                                            title: `${gp.name} Installation Overdue`,
                                            desc: `Block: ${gp.block}, District: ${gp.district} | Needed: ${gp.equipment}`,
                                            severity: 'High',
                                            name: gp.name,
                                            equipment: gp.equipment,
                                            district: gp.district
                                          },
                                          initialQuery: `Here is the data for ${gp.name}. Please help me resolve the overdue status.`
                                        }
                                      });
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-[12px] font-semibold rounded-xl hover:bg-violet-700 transition-colors shadow-sm"
                                  >
                                    <Brain size={14} />
                                    Ask AI About This
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </Fragment>
                );
              })}
            </AnimatePresence>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-[13px] text-[#9CA3AF]">No results match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}