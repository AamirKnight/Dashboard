import clsx from 'clsx';

export function SeverityBadge({ severity, size = 'sm' }) {
  const styles = {
    Critical: 'bg-red-50 text-red-700 border-red-200 ring-red-100',
    High:     'bg-amber-50 text-amber-700 border-amber-200 ring-amber-100',
    Medium:   'bg-violet-50 text-violet-700 border-violet-200 ring-violet-100',
    Low:      'bg-gray-100 text-gray-600 border-gray-200',
  };
  const dots = {
    Critical: 'bg-red-500',
    High:     'bg-amber-500',
    Medium:   'bg-violet-500',
    Low:      'bg-gray-400',
  };
  return (
    <span className={clsx(
      'inline-flex items-center gap-1.5 font-medium border rounded-md',
      size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5',
      styles[severity] ?? styles.Low,
    )}>
      <span className={clsx('rounded-full flex-shrink-0', dots[severity] ?? dots.Low, size === 'xs' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {severity}
    </span>
  );
}

export function TypeBadge({ type, size = 'sm' }) {
  const styles = {
    AI:    'bg-indigo-50 text-indigo-700 border-indigo-200',
    Rules: 'bg-sky-50 text-sky-700 border-sky-200',
  };
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 font-medium border rounded-md',
      size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5',
      styles[type] ?? styles.Rules,
    )}>
      {type === 'AI' ? '✦' : '◈'} {type}
    </span>
  );
}

export function SourceBadge({ source }) {
  return (
    <span className="inline-flex items-center text-[10px] font-medium border rounded-md bg-emerald-50 text-emerald-700 border-emerald-200 px-1.5 py-0.5">
      {source}
    </span>
  );
}

export function SeverityBar({ severity }) {
  const colors = {
    Critical: 'bg-red-500',
    High:     'bg-amber-500',
    Medium:   'bg-violet-400',
    Low:      'bg-gray-300',
  };
  return (
    <div className={clsx('w-0.5 rounded-full flex-shrink-0 self-stretch', colors[severity] ?? colors.Low)} />
  );
}