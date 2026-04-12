import { MOCK_ROMS, CONSOLES, formatFileSize } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';

export default function Dashboard() {
  const totalRoms = MOCK_ROMS.filter(r => r.status === 'sorted').length;
  const duplicates = MOCK_ROMS.filter(r => r.status === 'duplicate').length;
  const unsorted = MOCK_ROMS.filter(r => r.status === 'unsorted').length;
  const totalSize = MOCK_ROMS.reduce((acc, r) => acc + r.file_size, 0);

  // Console distribution
  const consoleDist = MOCK_ROMS.filter(r => r.console).reduce((acc, r) => {
    acc[r.console] = (acc[r.console] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Extension distribution
  const extDist = MOCK_ROMS.reduce((acc, r) => {
    acc[r.file_extension] = (acc[r.file_extension] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: 'TOTAL ROMS', value: totalRoms, icon: '🎮', color: 'glow-green text-primary' },
    { label: 'STORAGE', value: formatFileSize(totalSize), icon: '💾', color: 'text-retro-cyan' },
    { label: 'DUPLICATES', value: duplicates, icon: '⚠', color: 'glow-red text-destructive' },
    { label: 'UNSORTED', value: unsorted, icon: '❓', color: 'glow-amber text-retro-amber' },
  ];

  const maxConsole = Math.max(...Object.values(consoleDist));
  const maxExt = Math.max(...Object.values(extDist));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-pixel text-sm text-primary glow-green">DASHBOARD</h1>
        <span className="text-xs font-pixel text-muted-foreground animate-blink">● ONLINE</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="pixel-border bg-card p-4">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`font-pixel text-lg ${stat.color}`}>{stat.value}</div>
            <div className="font-pixel text-[8px] text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Console Distribution */}
        <div className="pixel-border bg-card p-4">
          <h2 className="font-pixel text-[10px] text-primary mb-4">CONSOLE DISTRIBUTION</h2>
          <div className="space-y-2">
            {Object.entries(consoleDist).sort((a, b) => b[1] - a[1]).map(([name, count]) => (
              <div key={name} className="flex items-center gap-2">
                <span className="font-retro text-sm text-foreground w-20 truncate">{name}</span>
                <div className="flex-1 retro-progress">
                  <div className="retro-progress-fill" style={{ width: `${(count / maxConsole) * 100}%` }} />
                </div>
                <span className="font-pixel text-[8px] text-primary w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Extension Distribution */}
        <div className="pixel-border bg-card p-4">
          <h2 className="font-pixel text-[10px] text-primary mb-4">EXTENSION DISTRIBUTION</h2>
          <div className="space-y-2">
            {Object.entries(extDist).sort((a, b) => b[1] - a[1]).map(([ext, count]) => (
              <div key={ext} className="flex items-center gap-2">
                <span className="font-mono text-sm text-retro-cyan w-12">{ext}</span>
                <div className="flex-1 retro-progress">
                  <div className="retro-progress-fill" style={{ width: `${(count / maxExt) * 100}%` }} />
                </div>
                <span className="font-pixel text-[8px] text-primary w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="pixel-border bg-card p-4">
        <h2 className="font-pixel text-[10px] text-primary mb-4">RECENT UPLOADS</h2>
        <div className="space-y-2">
          {MOCK_ROMS.slice(0, 5).map((rom) => (
            <div key={rom.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">🎮</span>
                <div>
                  <div className="font-retro text-sm text-foreground">{rom.title}</div>
                  <div className="font-mono text-xs text-muted-foreground">{rom.filename}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{formatFileSize(rom.file_size)}</span>
                <StatusBadge status={rom.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
