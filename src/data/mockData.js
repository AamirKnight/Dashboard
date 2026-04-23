export const summaryStats = {
  onTrack: 8,
  atRisk: 5,
  critical: 3,
  total: 16
};

export const recentAlerts = [
  {
    id: 1,
    title: "Consecutive SLA Compliance Decline",
    desc: "Package shows 3 consecutive weeks of declining SLA compliance.",
    severity: "Critical",
    type: "AI",
    time: "2h ago",
    triggerCondition: "Trend engine slope < 0 for 3 weeks",
    dataField: "% of GPs meeting >98% uptime SLA",
    dataSource: "PMIS + UNMS / NOC"
  },
  {
    id: 2,
    title: "GP Uptime Below 98% SLA",
    desc: "% of GPs meeting >98% uptime falls below threshold.",
    severity: "Critical",
    type: "Rules",
    time: "3h ago",
    triggerCondition: "Current week GP Uptime < 98%",
    dataField: "GP Uptime (%)",
    dataSource: "PMIS"
  }
];

export const pipelineSteps = [
  { id: 1, title: "Data Ingestion", desc: "All data sources synced" },
  { id: 2, title: "Rules Engine", desc: "Checking all fields" },
  { id: 3, title: "AI Analysis", desc: "AI analysis complete" },
  { id: 4, title: "Alert Dispatch", desc: "Alerts dispatched" }
];