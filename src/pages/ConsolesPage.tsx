import { useRomPackages } from '@/hooks/useRomPackages';
import { CONSOLES } from '@/data/mockData';
import { ExtensionBadge } from '@/components/ExtensionBadge';

export default function ConsolesPage() {
  const { data: packages = [] } = useRomPackages();
  const manufacturers = [...new Set(CONSOLES.map(c => c.manufacturer))];

  // Count ROMs per console from DB
  const consoleCounts = packages.reduce((acc, r) => {
    if (r.console) acc[r.console] = (acc[r.console] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <h1 className="font-pixel text-sm text-primary glow-green">🎮 CONSOLES</h1>

      {manufacturers.map(mfr => (
        <div key={mfr} className="space-y-3">
          <h2 className="font-pixel text-[10px] text-retro-cyan">{mfr.toUpperCase()}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CONSOLES.filter(c => c.manufacturer === mfr).map(console => (
              <div key={console.name} className="pixel-border bg-card p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{console.icon}</span>
                  <div>
                    <h3 className="font-retro text-lg text-foreground">{console.name}</h3>
                    <span className="font-pixel text-[8px] text-primary">{consoleCounts[console.name] || 0} ROMs</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {console.extensions.map(ext => (
                    <ExtensionBadge key={ext} ext={ext} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
