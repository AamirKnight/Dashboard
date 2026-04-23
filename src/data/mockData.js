// ─── SUMMARY STATS ───────────────────────────────────────────────────────────
export const summaryStats = [
  { id: 'priority',  title: 'Priority Alerts',  value: 4, icon: 'AlertTriangle', color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', sub: '↑ 2 from yesterday' },
  { id: 'network',   title: 'Network Issues',    value: 2, icon: 'Activity',      color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', sub: 'SLA at risk' },
  { id: 'worsening', title: 'Worsening Trends',  value: 5, icon: 'TrendingDown',  color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE', sub: '3-week decline' },
  { id: 'improving', title: 'Improving',          value: 3, icon: 'TrendingUp',   color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', sub: 'Resolution up' },
];

// ─── ALERTS BY SOURCE ─────────────────────────────────────────────────────────
export const alertsBySource = {
  unms: [
    { id:1, title:'Consecutive SLA Compliance Decline', desc:'Package shows 3 consecutive weeks of declining SLA compliance.', severity:'Critical', type:'AI',    source:'UNMS/NOC',     time:'2h ago',  trigger:'SLA decline ≥ 3 consecutive weeks',      dim:'Network SLA',      dataField:'SLA Compliance %',          dataSource:'UNMS + NOC Dashboard' },
    { id:2, title:'GP Uptime Below 98% SLA',            desc:'% of GPs meeting >98% uptime falls below threshold.',          severity:'Critical', type:'Rules', source:'UNMS/NOC',     time:'3h ago',  trigger:'GP uptime < 98%',                        dim:'Network SLA',      dataField:'GP Uptime %',               dataSource:'UNMS Network Monitor' },
    { id:3, title:'Outage Pattern Detected',            desc:'Recurring outages during peak hours flagged by AI engine.',    severity:'High',     type:'AI',    source:'UNMS/NOC',     time:'1d ago',  trigger:'Repeated outage events in 24h window',   dim:'Network SLA',      dataField:'Outage Events',             dataSource:'NOC Fault Management' },
    { id:4, title:'Incident / Fault History Spike',     desc:'Incident count exceeds baseline by 3× in 7 days.',            severity:'High',     type:'Rules', source:'NOC',          time:'6h ago',  trigger:'Incident count > 15/week',               dim:'Network SLA',      dataField:'Incident Count',            dataSource:'NOC Ticketing System' },
  ],
  samridh: [
    { id:5, title:'Electricity Unavailability at Site', desc:'Electricity unavailable at Block/GP site via field app.',      severity:'Critical', type:'Rules', source:'Samridh Gram', time:'5h ago',  trigger:'Electricity issue reports > 0 in app',   dim:'Infrastructure',   dataField:'Power Status',              dataSource:'Samridh Gram Field App' },
    { id:6, title:'AC Unavailability at Site',          desc:'Air cooling/conditioning failure at exchange point.',         severity:'High',     type:'Rules', source:'Samridh Gram', time:'8h ago',  trigger:'AC issue reports > 0',                   dim:'Infrastructure',   dataField:'Cooling Status',            dataSource:'Samridh Gram Field App' },
    { id:7, title:'Rack Space Unavailability',          desc:'Physical rack space critically low at exchange.',             severity:'Medium',   type:'Rules', source:'Samridh Gram', time:'2d ago',  trigger:'Rack utilization > 90%',                 dim:'Infrastructure',   dataField:'Rack Utilization',          dataSource:'Samridh Gram Field App' },
    { id:8, title:'Manpower Shortage',                  desc:'Field staff count below minimum required threshold.',         severity:'High',     type:'Rules', source:'Samridh Gram', time:'4d ago',  trigger:'Staff headcount < threshold',            dim:'Infrastructure',   dataField:'Field Staff Count',         dataSource:'Samridh Gram HR Module' },
  ],
  issues: [
    { id:9,  title:'High Open Issue Count',          desc:'Overall open issues exceeding weekly baseline.',              severity:'High',     type:'Rules', source:'IMS',          time:'1w ago',  trigger:'Open issues > 10',                       dim:'Issue Management', dataField:'Open Issue Count',          dataSource:'Issue Management System' },
    { id:10, title:'Aging Issues Unresolved',        desc:'Critical issues open for more than 5 days without update.',  severity:'High',     type:'Rules', source:'IMS',          time:'3d ago',  trigger:'Issue age > 5 days (critical priority)', dim:'Issue Management', dataField:'Issue Age (days)',           dataSource:'Issue Management System' },
    { id:11, title:'Low Issue Resolution Rate',      desc:'Weekly resolution rate drops below acceptable threshold.',   severity:'Medium',   type:'AI',    source:'IMS',          time:'5d ago',  trigger:'Resolution rate < 60% weekly',           dim:'Issue Management', dataField:'Resolution Rate %',         dataSource:'Issue Management System' },
    { id:12, title:'Package Health Score Critical',  desc:'AI composite score drops to 40/100 or below.',              severity:'Critical', type:'AI',    source:'AI Composite', time:'1h ago',  trigger:'Package health score ≤ 40',              dim:'AI Composite',     dataField:'Package Health Score',      dataSource:'AI Risk Engine' },
    { id:13, title:'Low FTTH Gross Activations',     desc:'Activations at 38% — significantly below 80% threshold.',  severity:'High',     type:'Rules', source:'PMIS',         time:'2d ago',  trigger:'FTTH gross activations < 80%',           dim:'FTTH Utilisation', dataField:'FTTH Gross Activations %',  dataSource:'PMIS Dashboard' },
    { id:14, title:'High FTTH Churn Rate',           desc:'Monthly churn exceeds 10% tolerance level.',               severity:'High',     type:'Rules', source:'PMIS',         time:'2d ago',  trigger:'FTTH churn > 10%',                       dim:'FTTH Utilisation', dataField:'FTTH Churn Rate %',         dataSource:'PMIS Dashboard' },
    { id:15, title:'Infrastructure–SLA Correlation', desc:'AI detects infrastructure gaps affecting SLA performance.', severity:'Critical', type:'AI',    source:'AI Composite', time:'6h ago',  trigger:'Correlation score exceeds threshold',     dim:'AI Composite',     dataField:'Infra-SLA Correlation Score',dataSource:'AI Risk Engine' },
  ],
};

export const allAlerts = [
  ...alertsBySource.unms,
  ...alertsBySource.samridh,
  ...alertsBySource.issues,
];

export const recentAlerts = allAlerts.filter(a => a.severity === 'Critical').slice(0, 5);