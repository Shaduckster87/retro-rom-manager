import { useRomPackages } from '@/hooks/useRomPackages';
import { formatFileSize } from '@/data/mockData';
import { StatusBadge } from '@/components/StatusBadge';
import { PixelCharacter } from '@/components/PixelCharacter';
import { GameQuoteBubble } from '@/components/GameQuoteBubble';

export default function Dashboard() {
  const { data: packages = [], isLoading } = useRomPackages();

  const totalRoms = packages.filter(r => r.status === 'sorted').length;
  const duplicates = packages.filter(r => r.status === 'duplicate').length;
  const unsorted = packages.filter(r => r.status === 'unsorted').length;
  const totalSize = packages.reduce((acc, r) => acc + Number(r.file_size), 0);

  const consoleDist = packages.filter(r => r.console).reduce((acc, r) => {
    acc[r.console!] = (acc[r.console!] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const extDist = packages.reduce((acc, r) => {
    if (r.file_extension) acc[r.file_extension] = (acc[r.file_extension] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const stats = [
    { label: 'TOTAL ROMS', value: totalRoms, character: 'coin' as const, color: 'glow-green text-primary' },
    { label: 'STORAGE', value: formatFileSize(totalSize), character: 'mushroom' as const, color: 'text-retro-cyan' },
    { label: 'DUPLICATES', value: duplicates, character: 'ghost' as const, color: 'glow-red text-destructive' },
    { label: 'UNSORTED', value: unsorted, character: 'star' as const, color: 'glow-amber text-retro-amber' },
  ];

  const consoleValues = Object.values(consoleDist);
  const maxConsole = consoleValues.length > 0 ? Math.max(...consoleValues) : 1;
  const extValues = Object.values(extDist);
  const maxExt = extValues.length > 0 ? Math.max(...extValues) : 1;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-pixel text-sm text-primary glow-green">DASHBOARD</h1>
        <div className="pixel-border bg-card p-12 text-center">
          <p className="font-pixel text-[10px] text-muted-foreground animate-blink">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PixelCharacter type="hero" size={28} />
          <h1 className="font-pixel text-sm text-primary glow-green">DASHBOARD</h1>
        </div>
        <GameQuoteBubble />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="pixel-border bg-card p-4 hover:bg-muted/20 transition-colors">
            <div className="flex items-center gap-2 mb-1">
              <PixelCharacter type={stat.character} size={20} />
            </div>
            <div className={`font-pixel text-lg ${stat.color}`}>{stat.value}</div>
            <div className="font-pixel text-[8px] text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="pixel-border bg-card p-4">
          <h2 className="font-pixel text-[10px] text-primary mb-4">CONSOLE DISTRIBUTION</h2>
          {Object.keys(consoleDist).length === 0 ? (
            <div className="text-center py-6">
              <PixelCharacter type="ghost" size={32} className="mx-auto mb-2 opacity-30" />
              <p className="font-retro text-sm text-muted-foreground">No data yet — upload some ROMs!</p>
            </div>
          ) : (
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
          )}
        </div>

        <div className="pixel-border bg-card p-4">
          <h2 className="font-pixel text-[10px] text-primary mb-4">EXTENSION DISTRIBUTION</h2>
          {Object.keys(extDist).length === 0 ? (
            <div className="text-center py-6">
              <PixelCharacter type="coin" size={32} className="mx-auto mb-2 opacity-30" />
              <p className="font-retro text-sm text-muted-foreground">No data yet</p>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      <div className="pixel-border bg-card p-4">
        <h2 className="font-pixel text-[10px] text-primary mb-4">RECENT UPLOADS</h2>
        {packages.length === 0 ? (
          <div className="text-center py-6">
            <PixelCharacter type="star" size={32} className="mx-auto mb-2 opacity-30" />
            <p className="font-retro text-sm text-muted-foreground">No ROM packages uploaded yet. Start uploading!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {packages.slice(0, 5).map((rom) => (
              <div key={rom.id} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <PixelCharacter type="coin" size={16} animated={false} />
                  <div>
                    <div className="font-retro text-sm text-foreground">{rom.title}</div>
                    <div className="font-mono text-xs text-muted-foreground">{rom.filename}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{formatFileSize(Number(rom.file_size))}</span>
                  <StatusBadge status={rom.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
