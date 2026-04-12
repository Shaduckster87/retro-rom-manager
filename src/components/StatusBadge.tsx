import { RomStatus, getStatusBgColor, getStatusLabel, getStatusColor } from '@/data/mockData';

interface StatusBadgeProps {
  status: RomStatus;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-pixel border ${getStatusBgColor(status)} ${getStatusColor(status)} ${className}`}>
      {status === 'hashing' && <span className="mr-1 animate-blink">⚙</span>}
      {status === 'duplicate' && <span className="mr-1">⚠</span>}
      {status === 'unsorted' && <span className="mr-1">?</span>}
      {status === 'sorted' && <span className="mr-1">✓</span>}
      {getStatusLabel(status)}
    </span>
  );
}
