import clsx from 'clsx';

const SEVERITY = {
  Critical: 'bg-red-50 text-red-700 border-red-200',
  High:     'bg-orange-50 text-orange-700 border-orange-200',
  Medium:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  Low:      'bg-slate-100 text-slate-600 border-slate-200',
};

const TYPE = {
  AI:    'bg-violet-50 text-violet-700 border-violet-200',
  Rules: 'bg-blue-50  text-blue-700  border-blue-200',
};

export function SeverityBadge({ severity, size = 'sm' }) {
  return (
    <span className={clsx(
      'inline-flex items-center font-semibold uppercase tracking-wide border rounded',
      size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5',
      SEVERITY[severity] ?? SEVERITY.Low,
    )}>
      {severity}
    </span>
  );
}

export function TypeBadge({ type, size = 'sm' }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-semibold uppercase tracking-wide border rounded',
      size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5',
      TYPE[type] ?? TYPE.Rules,
    )}>
      {type === 'AI' ? '🧠' : '📏'} {type}
    </span>
  );
}

export function SourceBadge({ source }) {
  return (
    <span className="inline-flex items-center text-[9px] font-semibold uppercase tracking-wide border rounded bg-emerald-50 text-emerald-700 border-emerald-200 px-1.5 py-0.5">
      {source}
    </span>
  );
}