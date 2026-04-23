import toast from 'react-hot-toast';

const shown = new Set();

export function triggerAlertToast(alert, navigate) {
  if (shown.has(alert.id)) return;
  shown.add(alert.id);

  const bgColor = alert.severity === 'Critical' ? '#FEF2F2' : alert.severity === 'High' ? '#FFFBEB' : '#EFF6FF';
  const borderColor = alert.severity === 'Critical' ? '#FECACA' : alert.severity === 'High' ? '#FDE68A' : '#BFDBFE';
  const badgeBg = alert.severity === 'Critical' ? '#DC2626' : alert.severity === 'High' ? '#D97706' : '#2563EB';

  toast.custom(
    (t) => (
      <div
        onClick={() => {
          toast.dismiss(t.id);
          if (navigate) navigate('/alerts', { state: { alertId: alert.id } });
        }}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          background: bgColor,
          border: `1px solid ${borderColor}`,
          borderRadius: '12px',
          padding: '12px 14px',
          cursor: 'pointer',
          maxWidth: '360px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          opacity: t.visible ? 1 : 0,
          transform: t.visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'all 0.3s cubic-bezier(0.32,0.72,0,1)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: badgeBg, color: '#fff', padding: '1px 7px', borderRadius: 4 }}>
              {alert.severity.toUpperCase()}
            </span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0F1623' }}>{alert.title}</span>
          </div>
          <span style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{alert.desc}</span>
          <span style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3 }}>Click to view details →</span>
        </div>
      </div>
    ),
    { duration: 5000, position: 'top-right' }
  );
}

export function triggerBatchAlerts(alerts, navigate) {
  alerts.forEach((alert, i) => {
    setTimeout(() => triggerAlertToast(alert, navigate), i * 800);
  });
}

export function resetShownAlerts() {
  shown.clear();
}