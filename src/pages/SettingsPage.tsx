import { CONSOLES } from '@/data/mockData';
import { ExtensionBadge } from '@/components/ExtensionBadge';

export default function SettingsPage() {
  const allExtensions = [...new Set(CONSOLES.flatMap(c => c.extensions))].sort();

  return (
    <div className="space-y-6">
      <h1 className="font-pixel text-sm text-primary glow-green">⚙ SETTINGS</h1>

      <div className="space-y-4">
        {/* Duplicate Detection */}
        <div className="pixel-border bg-card p-4">
          <h2 className="font-pixel text-[10px] text-primary mb-3">DUPLICATE DETECTION</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-retro text-sm text-foreground">Status</span>
              <span className="font-pixel text-[10px] text-primary px-3 py-1 border border-primary bg-primary/10">ENABLED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-retro text-sm text-foreground">Hash Algorithm</span>
              <span className="font-mono text-sm text-retro-cyan">SHA256</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-retro text-sm text-foreground">Auto-detect on upload</span>
              <span className="font-pixel text-[10px] text-primary">YES</span>
            </div>
          </div>
        </div>

        {/* Storage Paths */}
        <div className="pixel-border bg-card p-4">
          <h2 className="font-pixel text-[10px] text-primary mb-3">STORAGE PATHS</h2>
          <div className="space-y-2">
            {['/roms/', '/unsorted/', '/duplicates/'].map(path => (
              <div key={path} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                <span className="font-mono text-sm text-retro-amber">{path}</span>
                <span className="font-pixel text-[8px] text-primary">MOUNTED</span>
              </div>
            ))}
          </div>
        </div>

        {/* Allowed Extensions */}
        <div className="pixel-border bg-card p-4">
          <h2 className="font-pixel text-[10px] text-primary mb-3">ALLOWED EXTENSIONS</h2>
          <div className="flex flex-wrap gap-2">
            {allExtensions.map(ext => (
              <ExtensionBadge key={ext} ext={ext} />
            ))}
          </div>
        </div>

        {/* Display */}
        <div className="pixel-border bg-card p-4">
          <h2 className="font-pixel text-[10px] text-primary mb-3">DISPLAY</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-retro text-sm text-foreground">CRT Effect</span>
              <span className="font-retro text-sm text-muted-foreground">Use toggle in sidebar</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-retro text-sm text-foreground">Boot Screen</span>
              <span className="font-pixel text-[10px] text-primary">ENABLED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-retro text-sm text-foreground">Pixel Animations</span>
              <span className="font-pixel text-[10px] text-primary">ENABLED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-retro text-sm text-foreground">Sound Effects</span>
              <span className="font-pixel text-[10px] text-muted-foreground">OFF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
