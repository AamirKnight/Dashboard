export const summaryStats = [
  { id: 'priority', title: 'Priority Alerts', value: 4, icon: 'AlertTriangle', color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'network', title: 'Network Issues', value: 2, icon: 'Activity', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'worsening', title: 'Worsening Trends', value: 5, icon: 'TrendingDown', color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { id: 'improving', title: 'Improving', value: 3, icon: 'TrendingUp', color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

export const allAlerts = [
  { id: 1, title: "Consecutive SLA Compliance Decline", desc: "Package shows 3 consecutive weeks of declining SLA compliance.", severity: "Critical", type: "AI", time: "2h ago" },
  { id: 2, title: "GP Uptime Below 98% SLA", desc: "% of GPs meeting >98% uptime falls below threshold.", severity: "Critical", type: "Rules", time: "3h ago" },
  { id: 3, title: "Package Health Score Critical", desc: "Score drops to 40/100 or below.", severity: "Critical", type: "AI", time: "1h ago" },
  { id: 4, title: "Electricity Unavailability at Site", desc: "Electricity unavailable at Block/GP.", severity: "Critical", type: "Rules", time: "5h ago" },
  { id: 5, title: "Infrastructure-SLA Correlation", desc: "AI detects infra gaps affecting SLA.", severity: "Critical", type: "AI", time: "6h ago" },
  { id: 6, title: "Outage Pattern Detected", desc: "Recurring outages during peak hours.", severity: "High", type: "AI", time: "1d ago" },
  { id: 7, title: "Low FTTH Gross Activations", desc: "Activations at 38% — below 80% threshold.", severity: "High", type: "Rules", time: "2d ago" },
  { id: 8, title: "High FTTH Churn", desc: "Churn exceeds 10% tolerance.", severity: "High", type: "Rules", time: "2d ago" },
  { id: 9, title: "Aging Issues Unresolved", desc: "Critical issues open for > 5 days.", severity: "High", type: "Rules", time: "3d ago" },
  { id: 10, title: "Manpower Shortage", desc: "Field staff below required threshold.", severity: "Medium", type: "Rules", time: "4d ago" },
  { id: 11, title: "Net Active Connections Declining", desc: "Total active connections dropping.", severity: "Medium", type: "AI", time: "4d ago" },
  { id: 12, title: "Explainable Risk Driver Alert", desc: "Multiple minor factors contributing to high risk.", severity: "High", type: "AI", time: "5d ago" },
  { id: 13, title: "HOTO Completion Stagnation", desc: "No progress in handover over last 2 weeks.", severity: "Medium", type: "AI", time: "5d ago" },
  { id: 14, title: "Flat FTTH Growth", desc: "Growth rate below 2% week over week.", severity: "Medium", type: "AI", time: "6d ago" },
  { id: 15, title: "High Open Issue Count", desc: "Overall open issues exceeding baseline.", severity: "Medium", type: "Rules", time: "1w ago" },
];

export const recentAlerts = allAlerts.slice(0, 5);