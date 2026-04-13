import { useRomPackages } from '@/hooks/useRomPackages';
import { formatFileSize, CONSOLES } from '@/data/mockData';
import { ExtensionBadge } from '@/components/ExtensionBadge';
import { PackageTypeBadge } from '@/components/PackageTypeBadge';
import { toast } from 'sonner';

export default function ReviewPage() {
  const { data: packages = [], isLoading } = useRomPackages();
  const unsorted = packages.filter(r => r.status === 'unsorted');
  const consoleNames = CONSOLES.map(c => c.name);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-pixel text-sm text-retro-amber glow-amber">⚠ REVIEW / UNSORTED</h1>
        <div className="pixel-border bg-card p-12 text-center">
          <p className="font-pixel text-[10px] text-muted-foreground animate-blink">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="font-pixel text-sm text-retro-amber glow-amber">⚠ REVIEW / UNSORTED</h1>
        <span className="font-pixel text-[8px] text-muted-foreground">{unsorted.length} PACKAGES</span>
      </div>

      <p className="font-retro text-sm text-muted-foreground">
        These packages could not be automatically matched to a console. Review and assign them manually.
      </p>

      <div className="space-y-3">
        {unsorted.map(rom => (
          <div key={rom.id} className="pixel-border-amber bg-card p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xl">❓</span>
                <div>
                  <p className="font-mono text-sm text-foreground">{rom.filename}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <PackageTypeBadge type={rom.package_type} totalFiles={rom.total_files} />
                    {rom.file_extension && <ExtensionBadge ext={rom.file_extension} />}
                    <span className="font-mono text-xs text-muted-foreground">{formatFileSize(Number(rom.file_size))}</span>
                    <span className="font-mono text-xs text-muted-foreground">{new Date(rom.upload_date).toLocaleDateString()}</span>
                  </div>
                  {rom.detection_source && (
                    <p className="font-retro text-xs text-retro-cyan mt-1">
                      💡 Detected from: <span className="text-primary">{rom.detection_source}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select defaultValue="" className="bg-background border border-border px-3 py-1.5 font-retro text-sm text-foreground">
                  <option value="">Assign Console...</option>
                  {consoleNames.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button onClick={() => toast.success(`${rom.filename} assigned and moved to /roms/`)}
                  className="px-3 py-1.5 border border-primary text-primary font-retro text-sm hover:bg-primary/10 whitespace-nowrap">
                  Assign & Move
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {unsorted.length === 0 && (
        <div className="pixel-border bg-card p-12 text-center">
          <p className="font-pixel text-[10px] text-primary">✓ ALL PACKAGES SORTED</p>
        </div>
      )}
    </div>
  );
}
